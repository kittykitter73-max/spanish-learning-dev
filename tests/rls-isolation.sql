-- Borao RLS cross-user policy simulation.
-- Uses a fake authenticated JWT subject against one existing learner and rolls back.
-- This validates database RLS isolation; it does not replace a second real browser account E2E.

begin;

create temporary table _rls_subject as
select id
from auth.users
order by created_at
limit 1;

grant select on _rls_subject to authenticated;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

do $$
declare
  v_subject uuid;
  v_count integer;
begin
  select id into v_subject from _rls_subject;

  select count(*) into v_count
  from public.learner_evidence_events
  where learner_id=v_subject;
  if v_count <> 0 then raise exception 'cross-user evidence rows visible: %', v_count; end if;

  select count(*) into v_count
  from public.learner_concept_state
  where learner_id=v_subject;
  if v_count <> 0 then raise exception 'cross-user concept state visible: %', v_count; end if;

  select count(*) into v_count
  from public.recommendations
  where learner_id=v_subject;
  if v_count <> 0 then raise exception 'cross-user recommendations visible: %', v_count; end if;

  select count(*) into v_count
  from public.learner_content_progress
  where learner_id=v_subject;
  if v_count <> 0 then raise exception 'cross-user content progress visible: %', v_count; end if;

  select count(*) into v_count
  from public.learner_media_progress
  where learner_id=v_subject;
  if v_count <> 0 then raise exception 'cross-user media progress visible: %', v_count; end if;

  select count(*) into v_count
  from public.playlists
  where learner_id=v_subject;
  if v_count <> 0 then raise exception 'cross-user playlists visible: %', v_count; end if;

  update public.learner_media_progress
  set position_ms = position_ms + 1
  where learner_id=v_subject;
  get diagnostics v_count = row_count;
  if v_count <> 0 then raise exception 'cross-user media progress mutated: %', v_count; end if;

  update public.playlists
  set name = name
  where learner_id=v_subject;
  get diagnostics v_count = row_count;
  if v_count <> 0 then raise exception 'cross-user playlist mutated: %', v_count; end if;
end $$;

rollback;
