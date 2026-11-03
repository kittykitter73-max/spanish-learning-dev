-- Borao Studio server-side durable work queue, disabled by default.
-- PROPOSAL ONLY: apply only after worker role and retry tests.
create table public.studio_generation_control (
 singleton boolean primary key default true check (singleton),
 enabled boolean not null default false,
 max_attempts integer not null default 2 check (max_attempts between 1 and 5),
 max_calls_per_day integer not null default 0 check (max_calls_per_day between 0 and 200),
 updated_at timestamptz not null default now()
);
insert into public.studio_generation_control(singleton,enabled,max_calls_per_day)
 values(true,false,0);
create table public.studio_generation_jobs (
 id uuid primary key default gen_random_uuid(),
 song_job_id uuid not null references public.studio_song_jobs(id),
 song_version integer not null,
 stage text not null check (stage in
 ('song_draft','language_review','pedagogy_review','creative_review','companion_dialogue','exercise_pack')),
 provider_key text not null,
 idempotency_key text not null unique,
 status text not null default 'queued' check (status in ('queued','running','completed','failed','canceled')),
 attempts integer not null default 0 check (attempts>=0),
 available_at timestamptz not null default now(),
 lease_expires_at timestamptz,
 last_error_code text,
 requested_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 foreign key(song_job_id,song_version) references public.studio_song_versions(job_id,version)
);
create index studio_generation_claim_idx on public.studio_generation_jobs(status,available_at);
create table public.studio_generation_usage (
 usage_id bigint generated always as identity primary key,
 generation_job_id uuid not null references public.studio_generation_jobs(id),
 attempt integer not null check(attempt>=1),
 provider_key text not null,
 model_key text,
 input_tokens bigint check(input_tokens>=0),
 output_tokens bigint check(output_tokens>=0),
 estimated_cost_usd numeric(12,6) check(estimated_cost_usd>=0),
 final_cost_usd numeric(12,6) check(final_cost_usd>=0),
 created_at timestamptz not null default now(),
 unique(generation_job_id,attempt)
);
alter table public.studio_generation_control enable row level security;
alter table public.studio_generation_jobs enable row level security;
alter table public.studio_generation_usage enable row level security;
revoke all on public.studio_generation_control,public.studio_generation_jobs,
 public.studio_generation_usage from public,anon,authenticated;
-- No client-facing queue write grants. Server worker identity/claim RPCs deferred.
-- No worker scheduling, provider secrets or paid calls included in this migration.
