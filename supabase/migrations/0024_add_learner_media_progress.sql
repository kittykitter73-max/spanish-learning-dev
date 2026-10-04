create table public.learner_media_progress (
  learner_id uuid not null references auth.users(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  position_ms integer not null default 0 check (position_ms >= 0),
  completed_at timestamptz,
  last_played_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (learner_id, media_asset_id)
);

create index learner_media_progress_recent_idx
  on public.learner_media_progress(learner_id, last_played_at desc);

alter table public.learner_media_progress enable row level security;

create policy learner_media_progress_select_own
on public.learner_media_progress for select to authenticated
using (learner_id = (select auth.uid()));

create policy learner_media_progress_insert_own
on public.learner_media_progress for insert to authenticated
with check (learner_id = (select auth.uid()));

create policy learner_media_progress_update_own
on public.learner_media_progress for update to authenticated
using (learner_id = (select auth.uid()))
with check (learner_id = (select auth.uid()));

create policy learner_media_progress_delete_own
on public.learner_media_progress for delete to authenticated
using (learner_id = (select auth.uid()));

revoke all on public.learner_media_progress from anon, authenticated;
grant select, insert, update, delete on public.learner_media_progress to authenticated;
