drop policy if exists learner_path_state_start_core_own on public.learner_path_state;
create policy learner_path_state_start_core_own
on public.learner_path_state
for insert
to authenticated
with check (
  learner_id=(select auth.uid())
  and status='active'
  and exists (
    select 1
    from public.learning_paths p
    where p.id=path_id
      and p.path_kind='core'
      and p.status='published'
  )
);

drop policy if exists learner_unit_state_start_first_core_own on public.learner_unit_state;
create policy learner_unit_state_start_first_core_own
on public.learner_unit_state
for insert
to authenticated
with check (
  learner_id=(select auth.uid())
  and status='active'
  and exists (
    select 1
    from public.learning_units u
    join public.learning_paths p on p.id=u.path_id
    where u.id=unit_id
      and u.sequence_number=1
      and u.status='published'
      and p.path_kind='core'
      and p.status='published'
  )
);

grant insert (learner_id,path_id,status)
on public.learner_path_state
to authenticated;

grant insert (learner_id,unit_id,status)
on public.learner_unit_state
to authenticated;
