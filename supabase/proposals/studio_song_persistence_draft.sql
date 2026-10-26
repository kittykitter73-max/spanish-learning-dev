-- Borao Studio persistence proposal — NOT APPLIED.
-- Staging review required before deploying. Admin access comes from trusted
-- auth.users.raw_app_meta_data; never use user-editable user_metadata.
-- An administrator must separately provision this claim via an audited process.

create table if not exists public.studio_song_jobs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id),
  title text not null check (length(trim(title)) between 1 and 160),
  objective text not null check (length(trim(objective)) > 0),
  concept_ids text[] not null default '{}',
  status text not null default 'drafting'
    check (status in ('queued','drafting','language_review','pedagogy_review',
                     'creative_review','needs_revision','awaiting_founder','approved')),
  current_version integer not null default 1 check (current_version > 0),
  approved_version integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint approved_version_is_current
    check (approved_version is null or
      (status = 'approved' and approved_version = current_version))
);

create table if not exists public.studio_song_versions (
  job_id uuid not null references public.studio_song_jobs(id) on delete cascade,
  version integer not null check (version > 0),
  lyrics text not null default '',
  hooks jsonb not null default '[]'::jsonb check (jsonb_typeof(hooks) = 'array'),
  music_prompt text not null default '' check (length(music_prompt) <= 900),
  exercises jsonb not null default '[]'::jsonb check (jsonb_typeof(exercises) = 'array'),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  primary key(job_id, version)
);

create table if not exists public.studio_song_reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null,
  version integer not null,
  dimension text not null check (dimension in ('language','pedagogy','creative')),
  verdict text not null check (verdict in ('pass','revise')),
  reason_codes text[] not null default '{}',
  notes text not null default '',
  reviewer_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  foreign key(job_id,version) references public.studio_song_versions(job_id,version)
);

create index if not exists studio_jobs_status_idx on public.studio_song_jobs(status,updated_at desc);
create index if not exists studio_reviews_job_version_idx on public.studio_song_reviews(job_id,version);

alter table public.studio_song_jobs enable row level security;
alter table public.studio_song_versions enable row level security;
alter table public.studio_song_reviews enable row level security;

-- Deliberately read-only from the client until audited server-side RPCs exist.
-- No insert/update/delete grants to browser roles at this stage.
revoke all on public.studio_song_jobs from anon, authenticated;
revoke all on public.studio_song_versions from anon, authenticated;
revoke all on public.studio_song_reviews from anon, authenticated;

grant select on public.studio_song_jobs to authenticated;
grant select on public.studio_song_versions to authenticated;
grant select on public.studio_song_reviews to authenticated;

create policy studio_admin_read_jobs on public.studio_song_jobs
  for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'borao_studio_role') = 'admin');

create policy studio_admin_read_versions on public.studio_song_versions
  for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'borao_studio_role') = 'admin');

create policy studio_admin_read_reviews on public.studio_song_reviews
  for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'borao_studio_role') = 'admin');

-- Before enabling any writes:
-- 1. Check existing content schema and canonical curriculum ID type.
-- 2. Enforce concept foreign keys / validation, not free text alone.
-- 3. Add server-side, auditable atomic transitions with expected-version checks;
--    publication must remain separate and require explicit founder approval.
-- 4. Verify RLS and role claims with fresh JWTs using real test identities.
-- 5. Add update timestamps and audit-log trigger to governed write path.
