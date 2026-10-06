create index if not exists checkpoints_unit_idx
  on public.checkpoints(unit_id);

create index if not exists checkpoint_attempts_checkpoint_idx
  on public.checkpoint_attempts(checkpoint_id);

create index if not exists checkpoint_item_uses_checkpoint_idx
  on public.checkpoint_item_uses(checkpoint_id);

create index if not exists checkpoint_item_uses_attempt_idx
  on public.checkpoint_item_uses(attempt_id);
