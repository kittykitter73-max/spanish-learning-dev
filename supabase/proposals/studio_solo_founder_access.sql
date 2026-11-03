-- Solo-founder Studio access alignment (review proposal).
-- Only a trusted server operator may set app_metadata.borao_studio_role=founder.
-- UI allowlist BORAO_STUDIO_ADMIN_USER_IDS remains a separate required gate.
-- Founder may create/edit and read own production jobs, but may NOT self-review,
-- bypass distinct-review checks, or self-approve their own authored work.
drop policy if exists studio_jobs_admin_read on public.studio_song_jobs;
create policy studio_jobs_admin_read on public.studio_song_jobs for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role') in ('admin','founder','reviewer'));
drop policy if exists studio_concepts_admin_read on public.studio_song_job_concepts;
create policy studio_concepts_admin_read on public.studio_song_job_concepts for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role') in ('admin','founder','reviewer'));
drop policy if exists studio_versions_admin_read on public.studio_song_versions;
create policy studio_versions_admin_read on public.studio_song_versions for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role') in ('admin','founder','reviewer'));
-- Existing create/revise RPCs are SECURITY DEFINER; retain their checks but
-- extend edit permission narrowly to founder (not reviewer).
create or replace function public.studio_editor_role_allowed() returns boolean
 language sql stable security invoker set search_path='' as $$
  select (select auth.uid()) is not null and
    coalesce((select auth.jwt()->'app_metadata'->>'borao_studio_role'),'')
    in ('admin','founder')
 $$;
revoke all on function public.studio_editor_role_allowed() from public,anon;
grant execute on function public.studio_editor_role_allowed() to authenticated;
-- IMPORTANT: edit RPC changes to use this helper require separate audited migration
-- and negative authorization tests before a founder-only session can save drafts.
