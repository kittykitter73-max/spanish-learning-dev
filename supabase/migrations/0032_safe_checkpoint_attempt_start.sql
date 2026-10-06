create unique index if not exists checkpoint_attempts_one_open_idx
  on public.checkpoint_attempts(learner_id, checkpoint_id)
  where status='in_progress';

drop policy if exists checkpoint_attempts_start_own_published on public.checkpoint_attempts;
create policy checkpoint_attempts_start_own_published
on public.checkpoint_attempts
for insert
to authenticated
with check (
  learner_id=(select auth.uid())
  and status='in_progress'
  and learner_result_code is null
  and learner_message is null
  and completed_at is null
  and exists (
    select 1
    from public.checkpoints cp
    join public.learning_units u on u.id=cp.unit_id
    join public.learning_paths p on p.id=u.path_id
    where cp.id=checkpoint_id
      and cp.status='published'
      and u.status='published'
      and p.status='published'
  )
);

grant insert (learner_id, checkpoint_id)
on public.checkpoint_attempts
to authenticated;
