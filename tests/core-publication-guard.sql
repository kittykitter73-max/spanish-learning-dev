-- Core publication guard regression.
-- Confirms an authenticated learner cannot self-enroll while Core remains QA-only.

begin;

create temporary table _core_guard as
select
  (select id from auth.users order by created_at limit 1) as learner_id,
  (select id from public.learning_paths where slug='core') as path_id,
  (select id from public.learning_units where slug='core-01-make-something-happen') as unit_id;

grant select on _core_guard to authenticated;

set local role authenticated;

select set_config(
  'request.jwt.claims',
  json_build_object('sub',learner_id::text,'role','authenticated')::text,
  true
)
from _core_guard;

do $$
declare
  v_learner uuid;
  v_path uuid;
  v_unit uuid;
  v_path_denied boolean := false;
  v_unit_denied boolean := false;
begin
  select learner_id,path_id,unit_id
  into v_learner,v_path,v_unit
  from _core_guard;

  begin
    insert into public.learner_path_state (learner_id,path_id,status)
    values (v_learner,v_path,'active');
  exception when insufficient_privilege then
    v_path_denied := true;
  end;

  begin
    insert into public.learner_unit_state (learner_id,unit_id,status)
    values (v_learner,v_unit,'active');
  exception when insufficient_privilege then
    v_unit_denied := true;
  end;

  if not v_path_denied then
    raise exception 'QA Core path enrollment unexpectedly succeeded';
  end if;

  if not v_unit_denied then
    raise exception 'QA Core unit enrollment unexpectedly succeeded';
  end if;
end $$;

rollback;
