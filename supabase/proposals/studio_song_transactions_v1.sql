-- Borao Studio: draft creation, optimistic revision and append-only auditing.
-- Review-only migration. NOT APPLIED to Supabase.
-- Auth: trusted auth.users.raw_app_meta_data.borao_studio_role = admin.
-- Never grant access using user-editable raw_user_meta_data.
create table public.studio_song_jobs (
 id uuid primary key default gen_random_uuid(),
 created_by uuid not null references auth.users(id),
 title text not null check (length(btrim(title)) between 1 and 160),
 objective text not null check (length(btrim(objective)) between 1 and 2000),
 status text not null default 'drafting' check (status in ('drafting','needs_revision')),
 current_version integer not null default 1 check (current_version >= 1),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table public.studio_song_job_concepts (
 job_id uuid not null references public.studio_song_jobs(id) on delete restrict,
 concept_id text not null references public.concepts(id),
 role text not null default 'active_target' check (role in ('active_target','recycled','exposure_only')),
 primary key (job_id,concept_id)
);
create table public.studio_song_versions (
 job_id uuid not null references public.studio_song_jobs(id) on delete restrict,
 version integer not null check (version >= 1),
 lyrics text not null,
 hooks jsonb not null check (jsonb_typeof(hooks) = 'array'),
 music_prompt text not null check (length(music_prompt) <= 900),
 exercises jsonb not null check (jsonb_typeof(exercises) = 'array'),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 primary key (job_id,version)
);
create table public.studio_song_audit (
 id bigint generated always as identity primary key,
 job_id uuid not null references public.studio_song_jobs(id) on delete restrict,
 actor_id uuid not null references auth.users(id),
 action text not null check (action in ('created','revised')),
 old_version integer,
 new_version integer not null,
 occurred_at timestamptz not null default now(),
 constraint audit_version_step check (
   (action='created' and old_version is null and new_version=1)
   or (action='revised' and old_version >= 1 and new_version = old_version + 1)
 )
);
create index studio_song_audit_job_idx on public.studio_song_audit(job_id,occurred_at);
create index studio_song_jobs_updated_idx on public.studio_song_jobs(updated_at desc);

alter table public.studio_song_jobs enable row level security;
alter table public.studio_song_job_concepts enable row level security;
alter table public.studio_song_versions enable row level security;
alter table public.studio_song_audit enable row level security;
revoke all on public.studio_song_jobs, public.studio_song_job_concepts,
 public.studio_song_versions, public.studio_song_audit from public,anon,authenticated;
grant select on public.studio_song_jobs, public.studio_song_job_concepts,
 public.studio_song_versions, public.studio_song_audit to authenticated;
create policy studio_jobs_admin_read on public.studio_song_jobs for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role')='admin');
create policy studio_concepts_admin_read on public.studio_song_job_concepts for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role')='admin');
create policy studio_versions_admin_read on public.studio_song_versions for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role')='admin');
create policy studio_audit_admin_read on public.studio_song_audit for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role')='admin');

-- Prevent mutation even by accidentally over-granted clients. RPC owner may write.
create function public.studio_create_song(
 p_title text, p_objective text, p_concept_ids text[],
 p_lyrics text, p_hooks jsonb, p_music_prompt text, p_exercises jsonb
) returns table(job_id uuid, version integer)
language plpgsql security definer set search_path = ''
as $$
declare v_actor uuid := (select auth.uid()); v_id uuid; v_count integer;
begin
 if v_actor is null or coalesce((select auth.jwt()->'app_metadata'->>'borao_studio_role'),'') <> 'admin' then
   raise exception 'studio_access_denied' using errcode='42501';
 end if;
 if p_title is null or length(btrim(p_title)) not between 1 and 160
   or p_objective is null or length(btrim(p_objective)) not between 1 and 2000
   or p_lyrics is null or p_hooks is null or jsonb_typeof(p_hooks) <> 'array'
   or p_exercises is null or jsonb_typeof(p_exercises) <> 'array'
   or p_music_prompt is null or length(p_music_prompt) > 900
 then raise exception 'studio_invalid_payload' using errcode='22023'; end if;
 if p_concept_ids is null or cardinality(p_concept_ids) < 1 or cardinality(p_concept_ids) > 30
   or array_position(p_concept_ids,null) is not null then
   raise exception 'studio_invalid_concepts' using errcode='22023'; end if;
 select count(*) into v_count from public.concepts c
 where c.id=any(p_concept_ids) and c.status in ('approved','published');
 if v_count <> cardinality(p_concept_ids)
    or (select count(distinct x) from unnest(p_concept_ids) x) <> cardinality(p_concept_ids)
 then raise exception 'studio_invalid_concepts' using errcode='22023'; end if;
 insert into public.studio_song_jobs(created_by,title,objective)
 values(v_actor,btrim(p_title),btrim(p_objective)) returning id into v_id;
 insert into public.studio_song_job_concepts(job_id,concept_id)
 select v_id,x from unnest(p_concept_ids) x;
 insert into public.studio_song_versions
   (job_id,version,lyrics,hooks,music_prompt,exercises,created_by)
 values(v_id,1,p_lyrics,p_hooks,p_music_prompt,p_exercises,v_actor);
 insert into public.studio_song_audit(job_id,actor_id,action,old_version,new_version)
 values(v_id,v_actor,'created',null,1);
 return query select v_id,1;
end $$;

create function public.studio_revise_song(
 p_job_id uuid, p_expected_version integer, p_title text, p_objective text,
 p_concept_ids text[], p_lyrics text, p_hooks jsonb,
 p_music_prompt text, p_exercises jsonb
) returns table(job_id uuid, version integer)
language plpgsql security definer set search_path = ''
as $$
declare v_actor uuid := (select auth.uid()); v_current integer; v_status text;
 declare_count integer;
begin
 if v_actor is null or coalesce((select auth.jwt()->'app_metadata'->>'borao_studio_role'),'') <> 'admin' then
  raise exception 'studio_access_denied' using errcode='42501'; end if;
 -- Row lock serializes simultaneous revisions; second writer will fail version check.
 select j.current_version,j.status into v_current,v_status
 from public.studio_song_jobs j where j.id=p_job_id for update;
 if not found then raise exception 'studio_not_found' using errcode='P0002'; end if;
 if p_expected_version is null or v_current <> p_expected_version then
   raise exception 'studio_version_conflict' using errcode='40001'; end if;
 if v_status not in ('drafting','needs_revision') then
   raise exception 'studio_revision_not_allowed' using errcode='23514'; end if;
 if p_title is null or length(btrim(p_title)) not between 1 and 160
   or p_objective is null or length(btrim(p_objective)) not between 1 and 2000
   or p_lyrics is null or p_hooks is null or jsonb_typeof(p_hooks) <> 'array'
   or p_exercises is null or jsonb_typeof(p_exercises) <> 'array'
   or p_music_prompt is null or length(p_music_prompt) > 900
 then raise exception 'studio_invalid_payload' using errcode='22023'; end if;
 if p_concept_ids is null or cardinality(p_concept_ids) not between 1 and 30
   or array_position(p_concept_ids,null) is not null then
   raise exception 'studio_invalid_concepts' using errcode='22023'; end if;
 select count(*) into declare_count from public.concepts c
 where c.id=any(p_concept_ids) and c.status in ('approved','published');
 if declare_count <> cardinality(p_concept_ids)
    or (select count(distinct x) from unnest(p_concept_ids) x) <> cardinality(p_concept_ids)
 then raise exception 'studio_invalid_concepts' using errcode='22023'; end if;
 delete from public.studio_song_job_concepts where studio_song_job_concepts.job_id=p_job_id;
 insert into public.studio_song_job_concepts(job_id,concept_id)
 select p_job_id,x from unnest(p_concept_ids) x;
 insert into public.studio_song_versions
 (job_id,version,lyrics,hooks,music_prompt,exercises,created_by)
 values(p_job_id,v_current+1,p_lyrics,p_hooks,p_music_prompt,p_exercises,v_actor);
 update public.studio_song_jobs set title=btrim(p_title),objective=btrim(p_objective),
 status='drafting',current_version=v_current+1,updated_at=now() where id=p_job_id;
 insert into public.studio_song_audit(job_id,actor_id,action,old_version,new_version)
 values(p_job_id,v_actor,'revised',v_current,v_current+1);
 return query select p_job_id,v_current+1;
end $$;
-- Explicit grants: SECURITY DEFINER functions otherwise default to PUBLIC EXECUTE.
revoke all on function public.studio_create_song(text,text,text[],text,jsonb,text,jsonb) from public,anon;
revoke all on function public.studio_revise_song(uuid,integer,text,text,text[],text,jsonb,text,jsonb) from public,anon;
grant execute on function public.studio_create_song(text,text,text[],text,jsonb,text,jsonb) to authenticated;
grant execute on function public.studio_revise_song(uuid,integer,text,text,text[],text,jsonb,text,jsonb) to authenticated;
