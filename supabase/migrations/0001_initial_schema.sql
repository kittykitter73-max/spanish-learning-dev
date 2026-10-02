create extension if not exists pgcrypto;

create table public.learner_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  goal text,
  starting_level text not null default 'beginner',
  preferred_genres text[] not null default '{}',
  disliked_genres text[] not null default '{}',
  preferred_modes text[] not null default '{}',
  allowed_content_rating text not null default 'general' check (allowed_content_rating in ('general','teen','mature_18')),
  mature_content_enabled boolean not null default false,
  english_support_level smallint not null default 2 check (english_support_level between 0 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.concepts (
  id text primary key,
  slug text not null unique,
  concept_type text not null,
  canonical_spanish text not null,
  canonical_english text,
  communicative_function text,
  difficulty smallint not null default 1,
  status text not null default 'draft' check (status in ('draft','qa','approved','published','retired')),
  created_at timestamptz not null default now()
);

create table public.concept_prerequisites (
  concept_id text not null references public.concepts(id) on delete cascade,
  prerequisite_concept_id text not null references public.concepts(id) on delete cascade,
  required_strength numeric(4,3) not null default 0.35,
  primary key (concept_id, prerequisite_concept_id),
  check (concept_id <> prerequisite_concept_id)
);

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','approved','published','retired')),
  created_at timestamptz not null default now()
);

create table public.speakers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  character_id uuid references public.characters(id) on delete set null,
  role text not null check (role in ('character','narrator','unfamiliar_transfer')),
  accent_region text,
  register text not null default 'casual',
  default_speech_rate numeric(4,2) not null default 1.00,
  voice_provider text,
  voice_provider_id text,
  status text not null default 'draft' check (status in ('draft','approved','published','retired')),
  created_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content_type text not null check (content_type in ('song','micro_lesson','pattern_play','scene','mission','debrief','drive_drill','mini_series_episode')),
  difficulty smallint not null default 1,
  language_ratio numeric(4,3) not null default 0.50 check (language_ratio between 0 and 1),
  content_rating text not null default 'general' check (content_rating in ('general','teen','mature_18')),
  content_flags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','language_qa','pedagogical_qa','approved','published','retired')),
  rights_status text not null default 'internal' check (rights_status in ('internal','licensed','cleared','restricted','unknown')),
  provider_metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_concepts (
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  concept_id text not null references public.concepts(id) on delete cascade,
  role text not null check (role in ('active_target','recycled','exposure_only')),
  primary key (content_item_id, concept_id, role)
);

create table public.spoken_lessons (
  content_item_id uuid primary key references public.content_items(id) on delete cascade,
  format text not null check (format in ('micro_lesson','pattern_play','scene','mission','debrief','drive_drill','mini_series_episode')),
  transfer_goal text,
  estimated_seconds integer,
  story_arc text,
  episode_number integer,
  production_notes text
);

create table public.spoken_lesson_segments (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.spoken_lessons(content_item_id) on delete cascade,
  sequence_number integer not null,
  segment_type text not null check (segment_type in ('dialogue','narration','prompt','pause','model_answer','music_cue')),
  speaker_id uuid references public.speakers(id) on delete set null,
  text_es text,
  text_en text,
  expected_response text,
  expected_response_type text check (expected_response_type in ('none','recognition','meaning_recall','listening','manipulation','guided_production','independent_production','transfer')),
  hint_level smallint not null default 0 check (hint_level between 0 and 3),
  pause_ms integer,
  speech_rate numeric(4,2),
  metadata jsonb not null default '{}'::jsonb,
  unique (content_item_id, sequence_number)
);

create table public.learner_evidence_events (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null references public.concepts(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  segment_id uuid references public.spoken_lesson_segments(id) on delete set null,
  modality text not null,
  evidence_type text not null check (evidence_type in ('exposure','recognition','meaning_recall','listening_comprehension','manipulation','guided_production','independent_production','spontaneous_transfer')),
  success boolean,
  score numeric(5,4),
  evidence_strength numeric(5,4) not null check (evidence_strength between 0 and 1),
  hint_level smallint not null default 0 check (hint_level between 0 and 3),
  attempts smallint not null default 1,
  response_latency_ms integer,
  prompt_familiarity text,
  context_novelty text,
  audio_speed numeric(4,2),
  self_generated boolean not null default false,
  error_class text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index learner_evidence_events_learner_concept_idx on public.learner_evidence_events(learner_id, concept_id, occurred_at desc);
create index learner_evidence_events_learner_time_idx on public.learner_evidence_events(learner_id, occurred_at desc);

create table public.learner_concept_state (
  learner_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null references public.concepts(id) on delete cascade,
  recognition_confidence numeric(5,4) not null default 0,
  recall_confidence numeric(5,4) not null default 0,
  listening_confidence numeric(5,4) not null default 0,
  manipulation_confidence numeric(5,4) not null default 0,
  production_confidence numeric(5,4) not null default 0,
  transfer_confidence numeric(5,4) not null default 0,
  last_evidence_at timestamptz,
  last_success_at timestamptz,
  last_failure_at timestamptz,
  due_at timestamptz,
  support_level smallint not null default 2 check (support_level between 0 and 3),
  recent_error_class text,
  updated_at timestamptz not null default now(),
  primary key (learner_id, concept_id)
);

create index learner_concept_state_due_idx on public.learner_concept_state(learner_id, due_at);

create table public.favorites (
  learner_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (learner_id, content_item_id)
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete cascade,
  recommendation_type text not null,
  score numeric(10,4) not null,
  reason_codes text[] not null default '{}',
  explanation jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  consumed_at timestamptz
);

create index recommendations_learner_created_idx on public.recommendations(learner_id, created_at desc);

create table public.billing_customers (
  learner_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null,
  provider_customer_id text not null unique,
  created_at timestamptz not null default now()
);

create table public.subscription_entitlements (
  learner_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null,
  provider_subscription_id text unique,
  plan_code text not null,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.learner_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Enable RLS on all public tables.
alter table public.learner_profiles enable row level security;
alter table public.concepts enable row level security;
alter table public.concept_prerequisites enable row level security;
alter table public.characters enable row level security;
alter table public.speakers enable row level security;
alter table public.content_items enable row level security;
alter table public.content_concepts enable row level security;
alter table public.spoken_lessons enable row level security;
alter table public.spoken_lesson_segments enable row level security;
alter table public.learner_evidence_events enable row level security;
alter table public.learner_concept_state enable row level security;
alter table public.favorites enable row level security;
alter table public.recommendations enable row level security;
alter table public.billing_customers enable row level security;
alter table public.subscription_entitlements enable row level security;

-- Public/published curriculum and content are readable, not client-writable.
create policy concepts_read_published on public.concepts for select to anon, authenticated using (status = 'published');
create policy concept_prerequisites_read on public.concept_prerequisites for select to anon, authenticated using (true);
create policy characters_read_published on public.characters for select to anon, authenticated using (status = 'published');
create policy speakers_read_published on public.speakers for select to anon, authenticated using (status = 'published');
create policy content_items_read_published on public.content_items for select to anon, authenticated using (status = 'published' and rights_status in ('internal','licensed','cleared'));
create policy content_concepts_read on public.content_concepts for select to anon, authenticated using (true);
create policy spoken_lessons_read on public.spoken_lessons for select to anon, authenticated using (true);
create policy spoken_segments_read on public.spoken_lesson_segments for select to anon, authenticated using (true);

-- Learner-owned rows.
create policy learner_profiles_select_own on public.learner_profiles for select to authenticated using ((select auth.uid()) = id);
create policy learner_profiles_update_own on public.learner_profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy learner_evidence_select_own on public.learner_evidence_events for select to authenticated using ((select auth.uid()) = learner_id);
create policy learner_evidence_insert_own on public.learner_evidence_events for insert to authenticated with check ((select auth.uid()) = learner_id);

create policy learner_state_select_own on public.learner_concept_state for select to authenticated using ((select auth.uid()) = learner_id);
-- State writes are server-owned; no authenticated INSERT/UPDATE policy.

create policy favorites_select_own on public.favorites for select to authenticated using ((select auth.uid()) = learner_id);
create policy favorites_insert_own on public.favorites for insert to authenticated with check ((select auth.uid()) = learner_id);
create policy favorites_delete_own on public.favorites for delete to authenticated using ((select auth.uid()) = learner_id);

create policy recommendations_select_own on public.recommendations for select to authenticated using ((select auth.uid()) = learner_id);
-- Recommendation writes are server-owned.

create policy billing_customers_select_own on public.billing_customers for select to authenticated using ((select auth.uid()) = learner_id);
create policy entitlements_select_own on public.subscription_entitlements for select to authenticated using ((select auth.uid()) = learner_id);
-- Billing writes are server-owned.

-- Explicit Data API grants. RLS remains the row-level enforcement layer.
grant usage on schema public to anon, authenticated;
grant select on public.concepts, public.concept_prerequisites, public.characters, public.speakers, public.content_items, public.content_concepts, public.spoken_lessons, public.spoken_lesson_segments to anon, authenticated;
grant select, update on public.learner_profiles to authenticated;
grant select, insert on public.learner_evidence_events to authenticated;
grant select on public.learner_concept_state to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select on public.recommendations, public.billing_customers, public.subscription_entitlements to authenticated;
