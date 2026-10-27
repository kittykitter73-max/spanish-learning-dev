-- Borao Studio v2: version-scoped human review and founder approval.
-- Additive migration proposal. Do not apply until role/negative tests are ready.
-- Review and approval are never publication.
alter table public.studio_song_jobs drop constraint if exists studio_song_jobs_status_check;
alter table public.studio_song_jobs add constraint studio_song_jobs_status_check
 check (status in ('drafting','needs_revision','awaiting_founder','approved'));
create table public.studio_song_reviews (
 review_id bigint generated always as identity primary key,
 job_id uuid not null,
 version integer not null,
 dimension text not null check(dimension in ('language','pedagogy','creative')),
 verdict text not null check(verdict in ('pass','revise')),
 reviewer_id uuid not null references auth.users(id),
 notes text not null check(length(btrim(notes)) between 3 and 4000),
 created_at timestamptz not null default now(),
 foreign key(job_id,version) references public.studio_song_versions(job_id,version)
);
create unique index studio_reviews_one_decision_per_dimension
 on public.studio_song_reviews(job_id,version,dimension);
create table public.studio_song_approvals (
 job_id uuid not null,
 version integer not null,
 founder_id uuid not null references auth.users(id),
 approved_at timestamptz not null default now(),
 primary key(job_id,version),
 foreign key(job_id,version) references public.studio_song_versions(job_id,version)
);
alter table public.studio_song_reviews enable row level security;
alter table public.studio_song_approvals enable row level security;
revoke all on public.studio_song_reviews,public.studio_song_approvals from public,anon,authenticated;
grant select on public.studio_song_reviews,public.studio_song_approvals to authenticated;
create policy studio_review_admin_read on public.studio_song_reviews for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role') in ('admin','reviewer','founder'));
create policy studio_approval_admin_read on public.studio_song_approvals for select to authenticated
 using ((select auth.jwt()->'app_metadata'->>'borao_studio_role') in ('admin','reviewer','founder'));
create trigger studio_reviews_immutable before update or delete on public.studio_song_reviews
 for each row execute function public.studio_history_immutable();
create trigger studio_approvals_immutable before update or delete on public.studio_song_approvals
 for each row execute function public.studio_history_immutable();
-- No direct client mutations. Operations require trusted current-version RPCs.
create function public.studio_record_review(
 p_job_id uuid,p_expected_version integer,p_dimension text,p_verdict text,p_notes text
) returns void language plpgsql security definer set search_path = '' as $body$
declare v_current integer; v_role text := coalesce(auth.jwt()->'app_metadata'->>'borao_studio_role','');
begin
 if auth.uid() is null or v_role not in ('reviewer','admin','founder') then
  raise exception 'studio_access_denied' using errcode='42501'; end if;
 if p_dimension not in ('language','pedagogy','creative') or p_verdict not in ('pass','revise')
  or p_notes is null or length(btrim(p_notes)) not between 3 and 4000 then
  raise exception 'invalid_review' using errcode='22023'; end if;
 select current_version into v_current from public.studio_song_jobs where id=p_job_id for update;
 if not found then raise exception 'studio_not_found' using errcode='P0002'; end if;
 if v_current <> p_expected_version or p_expected_version is null then
  raise exception 'studio_version_conflict' using errcode='40001'; end if;
 if exists(select 1 from public.studio_song_approvals where job_id=p_job_id and version=v_current) then
  raise exception 'already_approved' using errcode='23514'; end if;
 insert into public.studio_song_reviews(job_id,version,dimension,verdict,reviewer_id,notes)
 values(p_job_id,v_current,p_dimension,p_verdict,auth.uid(),btrim(p_notes));
 update public.studio_song_jobs
 set status=case when p_verdict='revise' then 'needs_revision'
 when (select count(*) from public.studio_song_reviews where job_id=p_job_id and version=v_current and verdict='pass')=3
 then 'awaiting_founder' else 'drafting' end, updated_at=now()
 where id=p_job_id;
end $body$;
create function public.studio_approve_song(p_job_id uuid,p_expected_version integer)
 returns void language plpgsql security definer set search_path = '' as $body$
declare v_current integer;v_status text;
begin
 if auth.uid() is null or coalesce(auth.jwt()->'app_metadata'->>'borao_studio_role','') <> 'founder' then
  raise exception 'founder_access_required' using errcode='42501'; end if;
 select current_version,status into v_current,v_status from public.studio_song_jobs where id=p_job_id for update;
 if not found then raise exception 'studio_not_found' using errcode='P0002'; end if;
 if p_expected_version is null or p_expected_version<>v_current then
  raise exception 'studio_version_conflict' using errcode='40001'; end if;
 if v_status<>'awaiting_founder' or
   (select count(*) from public.studio_song_reviews where job_id=p_job_id and version=v_current and verdict='pass')<>3
 then raise exception 'studio_not_ready' using errcode='23514';end if;
 insert into public.studio_song_approvals(job_id,version,founder_id)
 values(p_job_id,v_current,auth.uid());
 update public.studio_song_jobs set status='approved',updated_at=now() where id=p_job_id;
end $body$;
revoke all on function public.studio_record_review(uuid,integer,text,text,text) from public,anon;
revoke all on function public.studio_approve_song(uuid,integer) from public,anon;
grant execute on function public.studio_record_review(uuid,integer,text,text,text) to authenticated;
grant execute on function public.studio_approve_song(uuid,integer) to authenticated;
