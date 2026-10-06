-- Ready Check publication guard regression.
-- Confirms an authenticated learner cannot start a QA-only checkpoint.

begin;

create temporary table _checkpoint_guard as
select
  (select id from auth.users order by created_at limit 1) as learner_id,
  (select id from public.checkpoints where slug='core-01-ready-check') as checkpoint_id;

grant select on _checkpoint_guard to authenticated;

set local role authenticated;

select set_config(
  'request.jwt.claims',
  json_build_object(
    'sub', learner_id::text,
    'role', 'authenticated'
  )::text,
  true
)
from _checkpoint_guard;

do $$
declare
  v_learner uuid;
  v_checkpoint uuid;
  v_denied boolean := false;
begin
  select learner_id, checkpoint_id
  into v_learner, v_checkpoint
  from _checkpoint_guard;

  begin
    insert into public.checkpoint_attempts (learner_id, checkpoint_id)
    values (v_learner, v_checkpoint);
  exception
    when insufficient_privilege then
      v_denied := true;
  end;

  if not v_denied then
    raise exception 'QA checkpoint start unexpectedly succeeded';
  end if;
end $$;

rollback;
