-- Additive access alignment for solo founder; no generation or publishing.
-- Keep creator/reviewer separation, and honor app_metadata role only.
drop policy if exists studio_jobs_admin_read on public.studio_song_jobs;
create policy studio_jobs_admin_read on public.studio_song_jobs for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role') in ('admin','founder','reviewer'));
drop policy if exists studio_versions_admin_read on public.studio_song_versions;
create policy studio_versions_admin_read on public.studio_song_versions for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role') in ('admin','founder','reviewer'));
drop policy if exists studio_concepts_admin_read on public.studio_song_job_concepts;
create policy studio_concepts_admin_read on public.studio_song_job_concepts for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role') in ('admin','founder','reviewer'));
create or replace function public.studio_create_song(
 p_title text, p_objective text, p_concept_ids text[],
 p_lyrics text, p_hooks jsonb, p_music_prompt text, p_exercises jsonb
) returns table(job_id uuid, version integer)
language plpgsql security definer set search_path = ''
as $$
declare v_actor uuid := (select auth.uid()); v_id uuid; v_count integer;
begin
 if v_actor is null or coalesce((select auth.jwt()->'app_metadata'->>'borao_studio_role'),'') not in ('admin','founder') then
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


create or replace function public.studio_revise_song(
 p_job_id uuid, p_expected_version integer, p_title text, p_objective text,
 p_concept_ids text[], p_lyrics text, p_hooks jsonb,
 p_music_prompt text, p_exercises jsonb
) returns table(job_id uuid, version integer)
language plpgsql security definer set search_path = ''
as $$
declare v_actor uuid := (select auth.uid()); v_current integer; v_status text;
 declare_count integer;
begin
 if v_actor is null or coalesce((select auth.jwt()->'app_metadata'->>'borao_studio_role'),'') not in ('admin','founder') then
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

