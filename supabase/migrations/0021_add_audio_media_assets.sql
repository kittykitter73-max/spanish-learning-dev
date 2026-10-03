create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  segment_id uuid references public.spoken_lesson_segments(id) on delete cascade,
  media_kind text not null check (media_kind in ('full_audio','segment_audio','music_mix','alternate_audio')),
  storage_bucket text not null default 'learning-media',
  storage_path text not null,
  mime_type text,
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  language_code text,
  provider text,
  provider_asset_id text,
  status text not null default 'draft' check (status in ('draft','processing','ready','failed','retired')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create index media_assets_content_ready_idx
  on public.media_assets(content_item_id, status);

create index media_assets_segment_ready_idx
  on public.media_assets(segment_id, status)
  where segment_id is not null;

alter table public.media_assets enable row level security;

create policy media_assets_read_ready
on public.media_assets
for select
to authenticated
using (
  status = 'ready'
  and exists (
    select 1
    from public.content_items ci
    where ci.id = content_item_id
      and ci.status = 'published'
      and ci.rights_status in ('internal','licensed','cleared')
  )
);

revoke all on public.media_assets from anon, authenticated;
grant select on public.media_assets to authenticated;
