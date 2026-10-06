create table public.content_collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  collection_type text not null check (collection_type in ('album','series')),
  description text,
  artwork_path text,
  release_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','qa','published','retired')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collection_items (
  collection_id uuid not null references public.content_collections(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  position integer not null,
  item_role text not null default 'core'
    check (item_role in ('core','starter','bonus','alternate','preview')),
  access_rule text not null default 'manual'
    check (access_rule in ('immediate','unit_ready','unit_complete','path_complete','manual')),
  required_unit_id uuid references public.learning_units(id) on delete set null,
  required_path_id uuid references public.learning_paths(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (collection_id, content_item_id),
  unique (collection_id, position),
  check (
    (access_rule = 'immediate' and required_unit_id is null and required_path_id is null)
    or (access_rule in ('unit_ready','unit_complete') and required_unit_id is not null and required_path_id is null)
    or (access_rule = 'path_complete' and required_path_id is not null and required_unit_id is null)
    or (access_rule = 'manual' and required_unit_id is null and required_path_id is null)
  )
);

create table public.game_mechanics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  evidence_type text,
  status text not null default 'draft' check (status in ('draft','qa','published','retired')),
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.game_unlock_rules (
  game_id uuid primary key references public.game_mechanics(id) on delete cascade,
  access_rule text not null default 'manual'
    check (access_rule in ('immediate','unit_ready','unit_complete','path_complete','manual')),
  required_unit_id uuid references public.learning_units(id) on delete set null,
  required_path_id uuid references public.learning_paths(id) on delete set null,
  check (
    (access_rule = 'immediate' and required_unit_id is null and required_path_id is null)
    or (access_rule in ('unit_ready','unit_complete') and required_unit_id is not null and required_path_id is null)
    or (access_rule = 'path_complete' and required_path_id is not null and required_unit_id is null)
    or (access_rule = 'manual' and required_unit_id is null and required_path_id is null)
  )
);

create table public.learner_unlocks (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references auth.users(id) on delete cascade,
  unlock_kind text not null check (unlock_kind in ('content','collection','game','feature')),
  content_item_id uuid references public.content_items(id) on delete cascade,
  collection_id uuid references public.content_collections(id) on delete cascade,
  game_id uuid references public.game_mechanics(id) on delete cascade,
  feature_key text,
  source text not null,
  unlocked_at timestamptz not null default now(),
  seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  check (
    ((content_item_id is not null)::int
      + (collection_id is not null)::int
      + (game_id is not null)::int
      + (feature_key is not null)::int) = 1
  )
);

create unique index learner_unlock_content_unique
  on public.learner_unlocks(learner_id, content_item_id)
  where content_item_id is not null;
create unique index learner_unlock_collection_unique
  on public.learner_unlocks(learner_id, collection_id)
  where collection_id is not null;
create unique index learner_unlock_game_unique
  on public.learner_unlocks(learner_id, game_id)
  where game_id is not null;
create unique index learner_unlock_feature_unique
  on public.learner_unlocks(learner_id, feature_key)
  where feature_key is not null;

create index collection_items_collection_position_idx
  on public.collection_items(collection_id, position);
create index learner_unlocks_unseen_idx
  on public.learner_unlocks(learner_id, unlocked_at desc)
  where seen_at is null;

alter table public.content_collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.game_mechanics enable row level security;
alter table public.game_unlock_rules enable row level security;
alter table public.learner_unlocks enable row level security;

create policy content_collections_read_published
on public.content_collections for select to authenticated
using (status = 'published');

create policy collection_items_read_for_published_collection
on public.collection_items for select to authenticated
using (
  exists (
    select 1 from public.content_collections c
    where c.id = collection_id and c.status = 'published'
  )
);

create policy game_mechanics_read_published
on public.game_mechanics for select to authenticated
using (status = 'published');

create policy game_unlock_rules_read_published_game
on public.game_unlock_rules for select to authenticated
using (
  exists (
    select 1 from public.game_mechanics g
    where g.id = game_id and g.status = 'published'
  )
);

create policy learner_unlocks_read_own
on public.learner_unlocks for select to authenticated
using (learner_id = (select auth.uid()));

create policy learner_unlocks_mark_seen_own
on public.learner_unlocks for update to authenticated
using (learner_id = (select auth.uid()))
with check (learner_id = (select auth.uid()));

revoke all on public.content_collections, public.collection_items,
  public.game_mechanics, public.game_unlock_rules, public.learner_unlocks
  from anon, authenticated;

grant select on public.content_collections, public.collection_items,
  public.game_mechanics, public.game_unlock_rules to authenticated;
grant select, update on public.learner_unlocks to authenticated;
