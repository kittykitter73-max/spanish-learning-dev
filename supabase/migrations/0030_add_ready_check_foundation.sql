create table public.checkpoints (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text,
  estimated_seconds integer check (estimated_seconds is null or estimated_seconds > 0),
  curriculum_version text not null,
  policy_version text not null,
  status text not null default 'draft' check (status in ('draft','qa','published','retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.checkpoint_requirements (
  checkpoint_id uuid not null references public.checkpoints(id) on delete cascade,
  requirement_key text not null,
  concept_id text references public.concepts(id) on delete restrict,
  dimension text not null check (dimension in ('listening','generated_use','manipulation','practical_adjustment')),
  min_successes smallint not null default 1 check (min_successes > 0),
  max_hint_level smallint check (max_hint_level is null or max_hint_level between 0 and 3),
  require_self_generated boolean not null default false,
  require_fresh boolean not null default true,
  required boolean not null default true,
  policy jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (checkpoint_id, requirement_key)
);

create table public.checkpoint_attempts (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references auth.users(id) on delete cascade,
  checkpoint_id uuid not null references public.checkpoints(id) on delete restrict,
  status text not null default 'in_progress' check (
    status in ('in_progress','ready','needs_more_evidence','booster_recommended','technical_issue','abandoned')
  ),
  learner_result_code text,
  learner_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.checkpoint_attempt_evaluations (
  attempt_id uuid primary key references public.checkpoint_attempts(id) on delete cascade,
  evaluator_version text not null,
  evidence_snapshot jsonb not null default '{}'::jsonb,
  unresolved_requirements jsonb not null default '[]'::jsonb,
  technical_status jsonb not null default '{}'::jsonb,
  evaluated_at timestamptz not null default now()
);

create table public.checkpoint_item_uses (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references auth.users(id) on delete cascade,
  checkpoint_id uuid references public.checkpoints(id) on delete cascade,
  attempt_id uuid references public.checkpoint_attempts(id) on delete cascade,
  item_key text not null,
  use_context text not null check (use_context in ('teaching','model','booster','check','retest')),
  answer_revealed boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index checkpoint_requirements_concept_idx
  on public.checkpoint_requirements(concept_id);

create index checkpoint_attempts_learner_idx
  on public.checkpoint_attempts(learner_id, started_at desc);

create index checkpoint_item_uses_learner_item_idx
  on public.checkpoint_item_uses(learner_id, item_key, occurred_at desc);

alter table public.checkpoints enable row level security;
alter table public.checkpoint_requirements enable row level security;
alter table public.checkpoint_attempts enable row level security;
alter table public.checkpoint_attempt_evaluations enable row level security;
alter table public.checkpoint_item_uses enable row level security;

create policy checkpoints_read_published
on public.checkpoints
for select
to authenticated
using (
  status='published'
  and exists (
    select 1
    from public.learning_units u
    join public.learning_paths p on p.id=u.path_id
    where u.id=unit_id
      and u.status='published'
      and p.status='published'
  )
);

create policy checkpoint_attempts_read_own
on public.checkpoint_attempts
for select
to authenticated
using ((select auth.uid())=learner_id);

revoke all on public.checkpoints,
  public.checkpoint_requirements,
  public.checkpoint_attempts,
  public.checkpoint_attempt_evaluations,
  public.checkpoint_item_uses
from anon, authenticated;

grant select on public.checkpoints to authenticated;
grant select on public.checkpoint_attempts to authenticated;

insert into public.checkpoints (
  unit_id,slug,title,description,estimated_seconds,curriculum_version,policy_version,status
)
select
  u.id,
  'core-01-ready-check',
  'Ready Check',
  'Adaptive evidence check for Core chapter 1. Learner-facing result is readiness guidance, not a percentage score.',
  270,
  '1.2',
  'arc1-v0.3-provisional',
  'qa'
from public.learning_units u
join public.learning_paths p on p.id=u.path_id
where p.slug='core' and u.slug='core-01-make-something-happen'
on conflict (slug) do update set
  unit_id=excluded.unit_id,
  title=excluded.title,
  description=excluded.description,
  estimated_seconds=excluded.estimated_seconds,
  curriculum_version=excluded.curriculum_version,
  policy_version=excluded.policy_version,
  status='qa',
  updated_at=now();

insert into public.checkpoint_requirements (
  checkpoint_id,requirement_key,concept_id,dimension,min_successes,max_hint_level,
  require_self_generated,require_fresh,required,policy
)
select
  cp.id, r.requirement_key, r.concept_id, r.dimension, r.min_successes, r.max_hint_level,
  r.require_self_generated, true, true, r.policy
from public.checkpoints cp
cross join (values
  ('C001-listening','C001','listening',1,0,false,'{"transcript_free":true,"fresh_voice_preferred":true}'::jsonb),
  ('C001-generated','C001','generated_use',1,0,true,'{"uncued":true}'::jsonb),
  ('C002-listening','C002','listening',1,0,false,'{"transcript_free":true,"fresh_voice_preferred":true}'::jsonb),
  ('C002-generated','C002','generated_use',1,0,true,'{"uncued":true}'::jsonb),
  ('C004-listening','C004','listening',1,0,false,'{"transcript_free":true,"fresh_voice_preferred":true}'::jsonb),
  ('C004-generated','C004','generated_use',1,0,true,'{"uncued":true}'::jsonb),
  ('C006-listening','C006','listening',1,0,false,'{"transcript_free":true,"fresh_voice_preferred":true}'::jsonb),
  ('C006-generated','C006','generated_use',1,0,true,'{"uncued":true}'::jsonb),
  ('C007-listening','C007','listening',1,0,false,'{"transcript_free":true,"fresh_voice_preferred":true}'::jsonb),
  ('C007-generated','C007','generated_use',1,0,true,'{"uncued":true}'::jsonb),
  ('C008-listening','C008','listening',1,0,false,'{"transcript_free":true,"fresh_voice_preferred":true}'::jsonb),
  ('C008-generated','C008','generated_use',1,0,true,'{"uncued":true}'::jsonb),
  ('C090-manipulation','C090','manipulation',3,0,true,'{"distinct_constructions":3}'::jsonb),
  ('held-out-adjustment',null,'practical_adjustment',1,0,true,'{"held_out":true,"task_level":true}'::jsonb)
) as r(requirement_key,concept_id,dimension,min_successes,max_hint_level,require_self_generated,policy)
where cp.slug='core-01-ready-check'
on conflict (checkpoint_id,requirement_key) do update set
  concept_id=excluded.concept_id,
  dimension=excluded.dimension,
  min_successes=excluded.min_successes,
  max_hint_level=excluded.max_hint_level,
  require_self_generated=excluded.require_self_generated,
  require_fresh=excluded.require_fresh,
  required=excluded.required,
  policy=excluded.policy;
