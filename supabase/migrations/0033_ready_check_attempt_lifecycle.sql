alter table public.checkpoint_attempts
  add column if not exists attempt_kind text not null default 'check'
    check (attempt_kind in ('check','retest')),
  add column if not exists parent_attempt_id uuid references public.checkpoint_attempts(id) on delete set null;

alter table public.checkpoint_attempt_evaluations
  add column if not exists booster_plan jsonb not null default '{}'::jsonb;

create table if not exists public.checkpoint_runtime_items (
  checkpoint_id uuid not null references public.checkpoints(id) on delete cascade,
  item_key text not null,
  item_family text not null,
  dimension text not null check (dimension in ('listening_comprehension','elicited_production','manipulation','practical_adjustment')),
  concept_ids jsonb not null default '[]'::jsonb,
  context_id text,
  learner_payload jsonb not null default '{}'::jsonb,
  evaluator_kind text not null check (evaluator_kind in ('exact_normalized','accepted_normalized','manual')),
  evaluator_rules jsonb not null default '{}'::jsonb,
  semantic_answer_key text,
  approval_status text not null default 'draft' check (approval_status in ('draft','qa','approved','published','retired')),
  audio_ready boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (checkpoint_id, item_key)
);

create table if not exists public.checkpoint_attempt_items (
  attempt_id uuid not null references public.checkpoint_attempts(id) on delete cascade,
  ordinal smallint not null check (ordinal > 0),
  item_key text not null,
  item_family text not null,
  dimension text not null,
  concept_ids jsonb not null default '[]'::jsonb,
  context_id text,
  learner_payload jsonb not null default '{}'::jsonb,
  evaluator_kind text not null,
  evaluator_rules jsonb not null default '{}'::jsonb,
  semantic_answer_key text,
  primary key (attempt_id, item_key),
  unique (attempt_id, ordinal)
);

create table if not exists public.checkpoint_attempt_responses (
  attempt_id uuid not null references public.checkpoint_attempts(id) on delete cascade,
  item_key text not null,
  response_text text not null default '',
  success boolean,
  evaluation_status text not null default 'scored'
    check (evaluation_status in ('scored','technical_issue')),
  evaluation_note text,
  submitted_at timestamptz not null default now(),
  primary key (attempt_id, item_key),
  foreign key (attempt_id, item_key)
    references public.checkpoint_attempt_items(attempt_id, item_key)
    on delete cascade
);

alter table public.checkpoint_runtime_items enable row level security;
alter table public.checkpoint_attempt_items enable row level security;
alter table public.checkpoint_attempt_responses enable row level security;

revoke all on public.checkpoint_runtime_items,
  public.checkpoint_attempt_items,
  public.checkpoint_attempt_responses
from anon, authenticated;

create index if not exists checkpoint_attempts_parent_idx
  on public.checkpoint_attempts(parent_attempt_id);

create index if not exists checkpoint_attempt_items_attempt_ordinal_idx
  on public.checkpoint_attempt_items(attempt_id, ordinal);

create or replace function public.start_checkpoint_attempt_v2(
  p_checkpoint_id uuid,
  p_item_keys text[],
  p_attempt_kind text default 'check',
  p_parent_attempt_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_attempt_id uuid;
  v_requested_count integer;
  v_valid_count integer;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  if p_attempt_kind not in ('check','retest') then
    raise exception 'invalid attempt kind';
  end if;

  v_requested_count := coalesce(array_length(p_item_keys, 1), 0);
  if v_requested_count < 1 or v_requested_count > 6 then
    raise exception 'invalid Ready Check item count';
  end if;

  if not exists (
    select 1
    from public.checkpoints cp
    join public.learning_units u on u.id=cp.unit_id
    join public.learning_paths p on p.id=u.path_id
    where cp.id=p_checkpoint_id
      and cp.status='published'
      and u.status='published'
      and p.status='published'
  ) then
    raise exception 'checkpoint unavailable';
  end if;

  if p_parent_attempt_id is not null and not exists (
    select 1 from public.checkpoint_attempts a
    where a.id=p_parent_attempt_id
      and a.learner_id=v_user_id
      and a.checkpoint_id=p_checkpoint_id
      and a.status in ('ready','booster_recommended','needs_more_evidence','technical_issue')
  ) then
    raise exception 'invalid parent attempt';
  end if;

  select count(*) into v_valid_count
  from unnest(p_item_keys) k(item_key)
  join public.checkpoint_runtime_items ri
    on ri.checkpoint_id=p_checkpoint_id and ri.item_key=k.item_key
  where ri.approval_status in ('approved','published')
    and (ri.dimension <> 'listening_comprehension' or ri.audio_ready=true);

  if v_valid_count <> v_requested_count then
    raise exception 'Ready Check contains unavailable items';
  end if;

  select a.id into v_attempt_id
  from public.checkpoint_attempts a
  where a.learner_id=v_user_id
    and a.checkpoint_id=p_checkpoint_id
    and a.status='in_progress'
  order by a.started_at desc
  limit 1;

  if v_attempt_id is null then
    insert into public.checkpoint_attempts(
      learner_id, checkpoint_id, attempt_kind, parent_attempt_id
    ) values (
      v_user_id, p_checkpoint_id, p_attempt_kind, p_parent_attempt_id
    )
    returning id into v_attempt_id;
  end if;

  if exists (
    select 1 from public.checkpoint_attempt_items i where i.attempt_id=v_attempt_id
  ) then
    return v_attempt_id;
  end if;

  insert into public.checkpoint_attempt_items(
    attempt_id, ordinal, item_key, item_family, dimension, concept_ids,
    context_id, learner_payload, evaluator_kind, evaluator_rules, semantic_answer_key
  )
  select
    v_attempt_id,
    k.ordinality::smallint,
    ri.item_key,
    ri.item_family,
    ri.dimension,
    ri.concept_ids,
    ri.context_id,
    ri.learner_payload,
    ri.evaluator_kind,
    ri.evaluator_rules,
    ri.semantic_answer_key
  from unnest(p_item_keys) with ordinality k(item_key, ordinality)
  join public.checkpoint_runtime_items ri
    on ri.checkpoint_id=p_checkpoint_id and ri.item_key=k.item_key
  order by k.ordinality;

  insert into public.checkpoint_item_uses(
    learner_id, checkpoint_id, attempt_id, item_key, use_context, answer_revealed, metadata
  )
  select
    v_user_id,
    p_checkpoint_id,
    v_attempt_id,
    i.item_key,
    case when p_attempt_kind='retest' then 'retest' else 'check' end,
    false,
    jsonb_build_object(
      'item_family', i.item_family,
      'context_id', i.context_id,
      'semantic_answer_key', i.semantic_answer_key
    )
  from public.checkpoint_attempt_items i
  where i.attempt_id=v_attempt_id;

  return v_attempt_id;
end;
$$;

revoke execute on function public.start_checkpoint_attempt_v2(uuid,text[],text,uuid)
from public, anon;
grant execute on function public.start_checkpoint_attempt_v2(uuid,text[],text,uuid)
to authenticated;

create or replace function public.get_checkpoint_attempt_v2(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  select jsonb_build_object(
    'attemptId', a.id,
    'checkpointId', a.checkpoint_id,
    'status', a.status,
    'attemptKind', a.attempt_kind,
    'parentAttemptId', a.parent_attempt_id,
    'learnerResultCode', a.learner_result_code,
    'learnerMessage', a.learner_message,
    'items', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'itemKey', i.item_key,
          'ordinal', i.ordinal,
          'dimension', i.dimension,
          'payload', i.learner_payload,
          'answered', (r.item_key is not null)
        )
        order by i.ordinal
      )
      from public.checkpoint_attempt_items i
      left join public.checkpoint_attempt_responses r
        on r.attempt_id=i.attempt_id and r.item_key=i.item_key
      where i.attempt_id=a.id
    ), '[]'::jsonb),
    'boosterPlan', coalesce((
      select e.booster_plan
      from public.checkpoint_attempt_evaluations e
      where e.attempt_id=a.id
    ), '{}'::jsonb)
  ) into v_result
  from public.checkpoint_attempts a
  where a.id=p_attempt_id and a.learner_id=v_user_id;

  if v_result is null then
    raise exception 'attempt unavailable';
  end if;

  return v_result;
end;
$$;

revoke execute on function public.get_checkpoint_attempt_v2(uuid) from public, anon;
grant execute on function public.get_checkpoint_attempt_v2(uuid) to authenticated;

create or replace function public.submit_checkpoint_attempt_response_v2(
  p_attempt_id uuid,
  p_item_key text,
  p_response text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_attempt public.checkpoint_attempts%rowtype;
  v_item public.checkpoint_attempt_items%rowtype;
  v_normalized text;
  v_success boolean;
  v_status text := 'scored';
  v_note text;
  v_expected text;
  v_concept_id text;
  v_evidence_type text;
  v_strength numeric(5,4);
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  select * into v_attempt
  from public.checkpoint_attempts
  where id=p_attempt_id and learner_id=v_user_id and status='in_progress';

  if not found then
    raise exception 'attempt unavailable';
  end if;

  select * into v_item
  from public.checkpoint_attempt_items
  where attempt_id=p_attempt_id and item_key=p_item_key;

  if not found then
    raise exception 'item unavailable';
  end if;

  v_normalized := regexp_replace(lower(trim(coalesce(p_response,''))), '[.!?¡¿]+$', '', 'g');
  v_normalized := regexp_replace(v_normalized, '\\s+', ' ', 'g');

  if v_item.evaluator_kind='exact_normalized' then
    v_expected := regexp_replace(
      lower(trim(coalesce(v_item.evaluator_rules->>'expected',''))),
      '[.!?¡¿]+$', '', 'g'
    );
    v_success := (v_expected <> '' and v_normalized=v_expected);
  elsif v_item.evaluator_kind='accepted_normalized' then
    select exists(
      select 1
      from jsonb_array_elements_text(
        coalesce(v_item.evaluator_rules->'accepted', '[]'::jsonb)
      ) a(value)
      where regexp_replace(
        regexp_replace(lower(trim(a.value)), '[.!?¡¿]+$', '', 'g'),
        '\\s+', ' ', 'g'
      ) = v_normalized
    ) into v_success;
  else
    v_success := null;
    v_status := 'technical_issue';
    v_note := 'This response needs a reviewed evaluator before Borao can score it.';
  end if;

  insert into public.checkpoint_attempt_responses(
    attempt_id,item_key,response_text,success,evaluation_status,evaluation_note,submitted_at
  ) values (
    p_attempt_id,p_item_key,coalesce(p_response,''),v_success,v_status,v_note,now()
  )
  on conflict (attempt_id,item_key) do update set
    response_text=excluded.response_text,
    success=excluded.success,
    evaluation_status=excluded.evaluation_status,
    evaluation_note=excluded.evaluation_note,
    submitted_at=excluded.submitted_at;

  if v_status='scored' then
    v_evidence_type := case v_item.dimension
      when 'listening_comprehension' then 'listening_comprehension'
      when 'elicited_production' then 'independent_production'
      when 'manipulation' then 'manipulation'
      when 'practical_adjustment' then 'spontaneous_transfer'
      else null
    end;

    v_strength := case v_evidence_type
      when 'listening_comprehension' then 0.45
      when 'manipulation' then 0.55
      when 'independent_production' then 0.80
      when 'spontaneous_transfer' then 1.00
      else 0.20
    end;

    for v_concept_id in
      select jsonb_array_elements_text(v_item.concept_ids)
    loop
      insert into public.learner_evidence_events(
        learner_id,concept_id,modality,evidence_type,success,evidence_strength,
        hint_level,self_generated,prompt_familiarity,context_novelty,error_class,metadata
      ) values (
        v_user_id,
        v_concept_id,
        'web_interactive',
        v_evidence_type,
        v_success,
        v_strength,
        0,
        v_item.dimension <> 'listening_comprehension',
        'fresh_check',
        'novel',
        case when v_success then null else 'retrieval_failure' end,
        jsonb_build_object(
          'attempt_id',p_attempt_id,
          'item_key',v_item.item_key,
          'item_family',v_item.item_family,
          'context_id',v_item.context_id,
          'semantic_answer_key',v_item.semantic_answer_key,
          'fresh',true
        )
      );
    end loop;
  end if;

  return jsonb_build_object(
    'itemKey',p_item_key,
    'success',v_success,
    'evaluationStatus',v_status
  );
end;
$$;

revoke execute on function public.submit_checkpoint_attempt_response_v2(uuid,text,text)
from public, anon;
grant execute on function public.submit_checkpoint_attempt_response_v2(uuid,text,text)
to authenticated;

create or replace function public.finalize_checkpoint_attempt_v2(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_attempt public.checkpoint_attempts%rowtype;
  v_item_count integer;
  v_response_count integer;
  v_has_technical boolean;
  v_unresolved text[];
  v_status text;
  v_message text;
  v_result_code text;
  v_booster jsonb;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  select * into v_attempt
  from public.checkpoint_attempts
  where id=p_attempt_id and learner_id=v_user_id and status='in_progress';

  if not found then
    raise exception 'attempt unavailable';
  end if;

  select count(*) into v_item_count
  from public.checkpoint_attempt_items
  where attempt_id=p_attempt_id;

  select count(*), coalesce(bool_or(evaluation_status='technical_issue'),false)
  into v_response_count, v_has_technical
  from public.checkpoint_attempt_responses
  where attempt_id=p_attempt_id;

  if v_item_count=0 or v_response_count<>v_item_count then
    raise exception 'attempt incomplete';
  end if;

  select coalesce(array_agg(cr.requirement_key order by cr.requirement_key), '{}')
  into v_unresolved
  from public.checkpoint_requirements cr
  where cr.checkpoint_id=v_attempt.checkpoint_id
    and cr.required=true
    and not (
      case cr.dimension
        when 'listening' then (
          select count(*) >= cr.min_successes
          from public.learner_evidence_events e
          where e.learner_id=v_user_id
            and (cr.concept_id is null or e.concept_id=cr.concept_id)
            and e.evidence_type='listening_comprehension'
            and e.success=true
            and e.hint_level <= coalesce(cr.max_hint_level,3)
            and (
              cr.require_fresh=false
              or e.context_novelty='novel'
              or coalesce((e.metadata->>'fresh')::boolean,false)=true
              or coalesce((e.metadata->>'held_out')::boolean,false)=true
            )
        )
        when 'generated_use' then (
          select count(*) >= cr.min_successes
          from public.learner_evidence_events e
          where e.learner_id=v_user_id
            and (cr.concept_id is null or e.concept_id=cr.concept_id)
            and e.evidence_type in ('guided_production','independent_production')
            and e.success=true
            and e.hint_level <= coalesce(cr.max_hint_level,3)
            and (cr.require_self_generated=false or e.self_generated=true)
            and (
              cr.require_fresh=false
              or e.context_novelty='novel'
              or coalesce((e.metadata->>'fresh')::boolean,false)=true
            )
        )
        when 'manipulation' then (
          select count(*) >= cr.min_successes
          from public.learner_evidence_events e
          where e.learner_id=v_user_id
            and (cr.concept_id is null or e.concept_id=cr.concept_id)
            and e.evidence_type='manipulation'
            and e.success=true
            and e.hint_level <= coalesce(cr.max_hint_level,3)
            and (cr.require_self_generated=false or e.self_generated=true)
            and (
              cr.require_fresh=false
              or e.context_novelty='novel'
              or coalesce((e.metadata->>'fresh')::boolean,false)=true
            )
        )
        when 'practical_adjustment' then (
          select count(*) >= cr.min_successes
          from public.learner_evidence_events e
          where e.learner_id=v_user_id
            and (cr.concept_id is null or e.concept_id=cr.concept_id)
            and e.evidence_type='spontaneous_transfer'
            and e.success=true
            and e.hint_level <= coalesce(cr.max_hint_level,3)
            and (cr.require_self_generated=false or e.self_generated=true)
            and (
              cr.require_fresh=false
              or e.context_novelty='novel'
              or coalesce((e.metadata->>'fresh')::boolean,false)=true
              or coalesce((e.metadata->>'held_out')::boolean,false)=true
            )
        )
        else false
      end
    );

  if v_has_technical then
    v_status := 'technical_issue';
    v_result_code := 'needs_review';
    v_message := 'One part could not be scored reliably. Your Spanish was not marked wrong.';
  elsif coalesce(array_length(v_unresolved,1),0)=0 then
    v_status := 'ready';
    v_result_code := 'ready';
    v_message := 'You showed enough fresh evidence to move on.';
  else
    v_status := 'booster_recommended';
    v_result_code := 'almost_there';
    v_message := 'Almost there. Borao will give you a short booster for the exact pieces that still need evidence.';
  end if;

  v_booster := jsonb_build_object(
    'requirementKeys', to_jsonb(v_unresolved),
    'mode', case when v_status='booster_recommended' then 'targeted' else 'none' end,
    'recommendedMinutes', case when v_status='booster_recommended' then 4 else 0 end
  );

  update public.checkpoint_attempts
  set status=v_status,
      learner_result_code=v_result_code,
      learner_message=v_message,
      completed_at=now()
  where id=p_attempt_id;

  insert into public.checkpoint_attempt_evaluations(
    attempt_id,evaluator_version,evidence_snapshot,unresolved_requirements,
    technical_status,booster_plan,evaluated_at
  ) values (
    p_attempt_id,
    'ready-check-v0.15',
    jsonb_build_object('itemCount',v_item_count,'responseCount',v_response_count),
    to_jsonb(v_unresolved),
    jsonb_build_object('hasTechnicalIssue',v_has_technical),
    v_booster,
    now()
  )
  on conflict (attempt_id) do update set
    evaluator_version=excluded.evaluator_version,
    evidence_snapshot=excluded.evidence_snapshot,
    unresolved_requirements=excluded.unresolved_requirements,
    technical_status=excluded.technical_status,
    booster_plan=excluded.booster_plan,
    evaluated_at=excluded.evaluated_at;

  return jsonb_build_object(
    'attemptId',p_attempt_id,
    'status',v_status,
    'learnerResultCode',v_result_code,
    'learnerMessage',v_message,
    'boosterPlan',v_booster
  );
end;
$$;

revoke execute on function public.finalize_checkpoint_attempt_v2(uuid)
from public, anon;
grant execute on function public.finalize_checkpoint_attempt_v2(uuid)
to authenticated;
