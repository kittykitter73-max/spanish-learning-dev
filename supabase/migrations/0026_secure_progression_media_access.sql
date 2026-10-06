create schema if not exists private;

create or replace function private.can_current_learner_access_content(
  p_content_item_id uuid
)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  with current_learner as (
    select (select auth.uid()) as learner_id
  ),
  memberships as (
    select
      ci.collection_id,
      ci.content_item_id,
      ci.access_rule,
      ci.required_unit_id,
      ci.required_path_id
    from public.collection_items ci
    join public.content_collections cc on cc.id = ci.collection_id
    where ci.content_item_id = p_content_item_id
      and cc.status = 'published'
  )
  select case
    when (select learner_id from current_learner) is null then false
    when not exists (select 1 from memberships) then true
    when exists (
      select 1 from memberships m
      where m.access_rule = 'immediate'
    ) then true
    when exists (
      select 1
      from memberships m
      join public.learner_unlocks lu
        on lu.learner_id = (select learner_id from current_learner)
       and (
         lu.content_item_id = m.content_item_id
         or lu.collection_id = m.collection_id
       )
    ) then true
    when exists (
      select 1
      from memberships m
      join public.learner_unit_state us
        on us.learner_id = (select learner_id from current_learner)
       and us.unit_id = m.required_unit_id
      where m.access_rule = 'unit_ready'
        and us.status in ('available','active','checkpoint_ready','completed')
    ) then true
    when exists (
      select 1
      from memberships m
      join public.learner_unit_state us
        on us.learner_id = (select learner_id from current_learner)
       and us.unit_id = m.required_unit_id
      where m.access_rule = 'unit_complete'
        and us.status = 'completed'
    ) then true
    when exists (
      select 1
      from memberships m
      join public.learner_path_state ps
        on ps.learner_id = (select learner_id from current_learner)
       and ps.path_id = m.required_path_id
      where m.access_rule = 'path_complete'
        and ps.status = 'completed'
    ) then true
    else false
  end;
$$;

revoke all on function private.can_current_learner_access_content(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.can_current_learner_access_content(uuid) to authenticated;

drop policy if exists media_assets_read_ready on public.media_assets;
create policy media_assets_read_ready
on public.media_assets
for select
to authenticated
using (
  status = 'ready'
  and private.can_current_learner_access_content(content_item_id)
  and exists (
    select 1
    from public.content_items ci
    where ci.id = content_item_id
      and ci.status = 'published'
      and ci.rights_status in ('internal','licensed','cleared')
  )
);

drop policy if exists learning_media_select_ready on storage.objects;
create policy learning_media_select_ready
on storage.objects
for select
to authenticated
using (
  bucket_id = 'learning-media'
  and exists (
    select 1
    from public.media_assets ma
    join public.content_items ci on ci.id = ma.content_item_id
    where ma.storage_bucket = bucket_id
      and ma.storage_path = name
      and ma.status = 'ready'
      and ci.status = 'published'
      and ci.rights_status in ('internal','licensed','cleared')
      and private.can_current_learner_access_content(ma.content_item_id)
  )
);
