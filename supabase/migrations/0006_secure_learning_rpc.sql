revoke insert on public.learner_evidence_events from authenticated;
drop policy if exists learner_evidence_insert_own on public.learner_evidence_events;

create or replace function public.record_content_exposure(p_content_item_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_count integer;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  if not exists (
    select 1 from public.content_items ci
    where ci.id = p_content_item_id
      and ci.status = 'published'
      and ci.rights_status in ('internal','licensed','cleared')
  ) then
    raise exception 'content unavailable';
  end if;

  insert into public.learner_evidence_events (
    learner_id, concept_id, content_item_id, modality, evidence_type,
    success, evidence_strength, self_generated, metadata
  )
  select
    v_user_id, cc.concept_id, p_content_item_id, 'web_interactive', 'exposure',
    true, 0.05, false, jsonb_build_object('source','scene_completed')
  from public.content_concepts cc
  where cc.content_item_id = p_content_item_id
    and cc.role = 'active_target';

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.record_content_exposure(uuid) from public, anon;
grant execute on function public.record_content_exposure(uuid) to authenticated;

create or replace function public.submit_assessment_response(
  p_assessment_item_id uuid,
  p_content_item_id uuid,
  p_response text
)
returns table(success boolean, evidence_type text, concept_id text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_item public.assessment_items%rowtype;
  v_response text;
  v_success boolean := false;
  v_base numeric(5,4);
  v_strength numeric(5,4);
  v_self_generated boolean;
  v_prefix text;
  v_first_word text;
  v_error_class text;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  select ai.* into v_item
  from public.assessment_items ai
  join public.content_items ci on ci.id = ai.content_item_id
  where ai.id = p_assessment_item_id
    and ai.content_item_id = p_content_item_id
    and ai.status = 'published'
    and ci.status = 'published'
    and ci.rights_status in ('internal','licensed','cleared');

  if not found then
    raise exception 'assessment unavailable';
  end if;

  v_response := regexp_replace(lower(trim(coalesce(p_response,''))), '[.!?¡¿]+$', '', 'g');
  v_response := regexp_replace(v_response, '\\s+', ' ', 'g');

  if v_item.scoring_strategy = 'choice_key' then
    v_success := coalesce(v_item.scoring_rules->'accepted_keys', '[]'::jsonb) ? v_response;
  elsif v_item.scoring_strategy = 'exact_text' then
    select exists (
      select 1
      from jsonb_array_elements_text(coalesce(v_item.scoring_rules->'accepted_answers','[]'::jsonb)) a(value)
      where regexp_replace(lower(trim(a.value)), '[.!?¡¿]+$', '', 'g') = v_response
    ) into v_success;
  elsif v_item.scoring_strategy = 'prefix_known_infinitive' then
    v_prefix := lower(trim(coalesce(v_item.scoring_rules->>'prefix','')));
    if v_prefix <> '' and v_response like v_prefix || ' %' then
      v_first_word := split_part(substr(v_response, length(v_prefix) + 2), ' ', 1);
      v_success := coalesce(v_item.scoring_rules->'known_infinitives','[]'::jsonb) ? v_first_word;
    end if;
  end if;

  v_base := case v_item.evidence_type
    when 'recognition' then 0.20
    when 'meaning_recall' then 0.35
    when 'listening_comprehension' then 0.45
    when 'manipulation' then 0.55
    when 'guided_production' then 0.65
    when 'independent_production' then 0.80
    when 'spontaneous_transfer' then 1.00
    else 0.05
  end;

  v_self_generated := v_item.item_type = 'typed_response';
  v_strength := v_base;
  if v_item.hint_level > 0 then
    v_strength := v_strength * greatest(0.35, 1 - (0.18 * v_item.hint_level));
  end if;
  if v_self_generated then
    v_strength := least(1.0, v_strength * 1.08);
  end if;

  v_error_class := case
    when v_success then null
    when v_item.evidence_type = 'manipulation' then 'form_or_conjugation'
    else 'retrieval_failure'
  end;

  insert into public.learner_evidence_events (
    learner_id, concept_id, content_item_id, modality, evidence_type,
    success, evidence_strength, hint_level, self_generated, error_class, metadata
  ) values (
    v_user_id, v_item.concept_id, p_content_item_id, 'web_interactive', v_item.evidence_type,
    v_success, v_strength, v_item.hint_level, v_self_generated, v_error_class,
    jsonb_build_object('assessment_item_id',v_item.id,'response_length',length(v_response))
  );

  return query select v_success, v_item.evidence_type, v_item.concept_id;
end;
$$;

revoke execute on function public.submit_assessment_response(uuid,uuid,text) from public, anon;
grant execute on function public.submit_assessment_response(uuid,uuid,text) to authenticated;

create or replace function public.apply_evidence_to_concept_state()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_due timestamptz;
  success_delta numeric(5,4);
  fail_delta numeric(5,4);
  v_production numeric(5,4);
  v_reason_codes text[] := '{}';
  v_score numeric(10,4) := 0;
begin
  success_delta := least(1.0, greatest(0.0, new.evidence_strength));
  fail_delta := greatest(0.05, new.evidence_strength * 0.25);

  next_due := case
    when new.success is false then now() + interval '4 hours'
    when new.evidence_type in ('independent_production','spontaneous_transfer') then now() + interval '4 days'
    when new.evidence_type in ('guided_production','manipulation') then now() + interval '3 days'
    when new.evidence_type in ('meaning_recall','listening_comprehension') then now() + interval '2 days'
    else now() + interval '1 day'
  end;

  insert into public.learner_concept_state (
    learner_id, concept_id,
    recognition_confidence, recall_confidence, listening_confidence,
    manipulation_confidence, production_confidence, transfer_confidence,
    last_evidence_at, last_success_at, last_failure_at, due_at,
    support_level, recent_error_class, updated_at
  ) values (
    new.learner_id, new.concept_id,
    case when new.evidence_type='recognition' and new.success then success_delta else 0 end,
    case when new.evidence_type='meaning_recall' and new.success then success_delta else 0 end,
    case when new.evidence_type='listening_comprehension' and new.success then success_delta else 0 end,
    case when new.evidence_type='manipulation' and new.success then success_delta else 0 end,
    case when new.evidence_type in ('guided_production','independent_production') and new.success then success_delta else 0 end,
    case when new.evidence_type='spontaneous_transfer' and new.success then success_delta else 0 end,
    new.occurred_at,
    case when new.success then new.occurred_at end,
    case when new.success is false then new.occurred_at end,
    next_due,
    case
      when new.success and new.evidence_type in ('independent_production','spontaneous_transfer') then 0
      when new.success then 1
      else 2
    end,
    new.error_class,
    now()
  )
  on conflict (learner_id, concept_id) do update set
    recognition_confidence = case when new.evidence_type='recognition' then
      case when new.success then greatest(public.learner_concept_state.recognition_confidence, success_delta)
           else greatest(0, public.learner_concept_state.recognition_confidence - fail_delta) end
      else public.learner_concept_state.recognition_confidence end,
    recall_confidence = case when new.evidence_type='meaning_recall' then
      case when new.success then greatest(public.learner_concept_state.recall_confidence, success_delta)
           else greatest(0, public.learner_concept_state.recall_confidence - fail_delta) end
      else public.learner_concept_state.recall_confidence end,
    listening_confidence = case when new.evidence_type='listening_comprehension' then
      case when new.success then greatest(public.learner_concept_state.listening_confidence, success_delta)
           else greatest(0, public.learner_concept_state.listening_confidence - fail_delta) end
      else public.learner_concept_state.listening_confidence end,
    manipulation_confidence = case when new.evidence_type='manipulation' then
      case when new.success then greatest(public.learner_concept_state.manipulation_confidence, success_delta)
           else greatest(0, public.learner_concept_state.manipulation_confidence - fail_delta) end
      else public.learner_concept_state.manipulation_confidence end,
    production_confidence = case when new.evidence_type in ('guided_production','independent_production') then
      case when new.success then greatest(public.learner_concept_state.production_confidence, success_delta)
           else greatest(0, public.learner_concept_state.production_confidence - fail_delta) end
      else public.learner_concept_state.production_confidence end,
    transfer_confidence = case when new.evidence_type='spontaneous_transfer' then
      case when new.success then greatest(public.learner_concept_state.transfer_confidence, success_delta)
           else greatest(0, public.learner_concept_state.transfer_confidence - fail_delta) end
      else public.learner_concept_state.transfer_confidence end,
    last_evidence_at = new.occurred_at,
    last_success_at = case when new.success then new.occurred_at else public.learner_concept_state.last_success_at end,
    last_failure_at = case when new.success is false then new.occurred_at else public.learner_concept_state.last_failure_at end,
    due_at = next_due,
    support_level = case
      when new.success and new.evidence_type in ('independent_production','spontaneous_transfer') then greatest(0, public.learner_concept_state.support_level - 1)
      when new.success is false then least(3, public.learner_concept_state.support_level + 1)
      else public.learner_concept_state.support_level
    end,
    recent_error_class = case when new.success is false then new.error_class else public.learner_concept_state.recent_error_class end,
    updated_at = now();

  select production_confidence into v_production
  from public.learner_concept_state
  where learner_id = new.learner_id and concept_id = new.concept_id;

  if next_due <= now() then v_reason_codes := array_append(v_reason_codes,'due_review'); end if;
  if coalesce(v_production,0) < 0.45 then v_reason_codes := array_append(v_reason_codes,'production_gap'); end if;
  if new.success is false then v_reason_codes := array_append(v_reason_codes,'recent_error'); end if;
  v_reason_codes := array_append(v_reason_codes, case when new.success then 'successful_retrieval' else 'needs_scaffold' end);

  v_score :=
    (case when next_due <= now() then 2.2 else 0 end) +
    (case when new.success is false then 1.8 else 0 end) +
    ((1 - coalesce(v_production,0)) * 1.25) +
    0.88;

  update public.recommendations
  set consumed_at = now()
  where learner_id = new.learner_id and consumed_at is null;

  if new.content_item_id is not null then
    insert into public.recommendations (
      learner_id, content_item_id, recommendation_type, score, reason_codes, explanation
    ) values (
      new.learner_id,
      new.content_item_id,
      case when new.success then 'continue_or_resurface' else 'targeted_review' end,
      v_score,
      v_reason_codes,
      jsonb_build_object('concept_id',new.concept_id,'evidence_type',new.evidence_type)
    );
  end if;

  return new;
end;
$$;

revoke execute on function public.apply_evidence_to_concept_state() from public, anon, authenticated;
grant execute on function public.apply_evidence_to_concept_state() to postgres, service_role;
