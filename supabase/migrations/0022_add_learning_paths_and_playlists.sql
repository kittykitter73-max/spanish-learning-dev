create table public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  path_kind text not null check (path_kind in ('core','elective')),
  description text,
  unlock_after_path_id uuid references public.learning_paths(id) on delete set null,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','qa','published','retired')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learning_units (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.learning_paths(id) on delete cascade,
  slug text not null,
  title text not null,
  sequence_number integer not null,
  transfer_goal text,
  status text not null default 'draft' check (status in ('draft','qa','published','retired')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (path_id, slug),
  unique (path_id, sequence_number)
);

create table public.unit_content_items (
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  role text not null check (role in ('anchor_music','spoken_episode','practice','game','speaking','checkpoint','reinforcement')),
  sequence_number integer not null,
  required boolean not null default false,
  primary key (unit_id, content_item_id, role),
  unique (unit_id, sequence_number)
);

create table public.learner_path_state (
  learner_id uuid not null references auth.users(id) on delete cascade,
  path_id uuid not null references public.learning_paths(id) on delete cascade,
  status text not null default 'locked' check (status in ('locked','available','active','completed')),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (learner_id, path_id)
);

create table public.learner_unit_state (
  learner_id uuid not null references auth.users(id) on delete cascade,
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  status text not null default 'locked' check (status in ('locked','available','active','checkpoint_ready','completed')),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (learner_id, unit_id)
);

create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  playlist_type text not null default 'manual' check (playlist_type in ('manual','smart','system')),
  playback_mode text not null default 'mixed' check (playback_mode in ('music','spoken','mixed')),
  smart_rules jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (playlist_type='system' and learner_id is null)
    or
    (playlist_type in ('manual','smart') and learner_id is not null)
  )
);

create table public.playlist_items (
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  position integer not null,
  added_at timestamptz not null default now(),
  primary key (playlist_id, content_item_id),
  unique (playlist_id, position)
);

create index learning_units_path_idx on public.learning_units(path_id, sequence_number);
create index unit_content_items_content_idx on public.unit_content_items(content_item_id);
create index learner_path_state_learner_idx on public.learner_path_state(learner_id, status);
create index learner_unit_state_learner_idx on public.learner_unit_state(learner_id, status);
create index playlists_learner_idx on public.playlists(learner_id, updated_at desc);
create index playlist_items_playlist_idx on public.playlist_items(playlist_id, position);

alter table public.learning_paths enable row level security;
alter table public.learning_units enable row level security;
alter table public.unit_content_items enable row level security;
alter table public.learner_path_state enable row level security;
alter table public.learner_unit_state enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_items enable row level security;

create policy learning_paths_read_published on public.learning_paths
for select to authenticated using (status='published');

create policy learning_units_read_published on public.learning_units
for select to authenticated using (
  status='published'
  and exists (
    select 1 from public.learning_paths p
    where p.id=path_id and p.status='published'
  )
);

create policy unit_content_items_read_published on public.unit_content_items
for select to authenticated using (
  exists (
    select 1
    from public.learning_units u
    join public.learning_paths p on p.id=u.path_id
    where u.id=unit_id and u.status='published' and p.status='published'
  )
);

create policy learner_path_state_read_own on public.learner_path_state
for select to authenticated using ((select auth.uid())=learner_id);

create policy learner_unit_state_read_own on public.learner_unit_state
for select to authenticated using ((select auth.uid())=learner_id);

create policy playlists_read_own_or_system on public.playlists
for select to authenticated using (
  learner_id=(select auth.uid())
  or (playlist_type='system' and learner_id is null and status='active')
);

create policy playlists_insert_own on public.playlists
for insert to authenticated
with check (learner_id=(select auth.uid()) and playlist_type in ('manual','smart'));

create policy playlists_update_own on public.playlists
for update to authenticated
using (learner_id=(select auth.uid()) and playlist_type in ('manual','smart'))
with check (learner_id=(select auth.uid()) and playlist_type in ('manual','smart'));

create policy playlists_delete_own on public.playlists
for delete to authenticated
using (learner_id=(select auth.uid()) and playlist_type in ('manual','smart'));

create policy playlist_items_read_visible on public.playlist_items
for select to authenticated
using (
  exists (
    select 1 from public.playlists p
    where p.id=playlist_id
      and (
        p.learner_id=(select auth.uid())
        or (p.playlist_type='system' and p.learner_id is null and p.status='active')
      )
  )
);

create policy playlist_items_insert_own on public.playlist_items
for insert to authenticated
with check (
  exists (
    select 1 from public.playlists p
    where p.id=playlist_id
      and p.learner_id=(select auth.uid())
      and p.playlist_type in ('manual','smart')
  )
);

create policy playlist_items_update_own on public.playlist_items
for update to authenticated
using (
  exists (
    select 1 from public.playlists p
    where p.id=playlist_id
      and p.learner_id=(select auth.uid())
      and p.playlist_type in ('manual','smart')
  )
)
with check (
  exists (
    select 1 from public.playlists p
    where p.id=playlist_id
      and p.learner_id=(select auth.uid())
      and p.playlist_type in ('manual','smart')
  )
);

create policy playlist_items_delete_own on public.playlist_items
for delete to authenticated
using (
  exists (
    select 1 from public.playlists p
    where p.id=playlist_id
      and p.learner_id=(select auth.uid())
      and p.playlist_type in ('manual','smart')
  )
);

revoke all on public.learning_paths, public.learning_units, public.unit_content_items,
  public.learner_path_state, public.learner_unit_state, public.playlists, public.playlist_items
  from anon, authenticated;

grant select on public.learning_paths, public.learning_units, public.unit_content_items to authenticated;
grant select on public.learner_path_state, public.learner_unit_state to authenticated;
grant select, insert, update, delete on public.playlists, public.playlist_items to authenticated;
