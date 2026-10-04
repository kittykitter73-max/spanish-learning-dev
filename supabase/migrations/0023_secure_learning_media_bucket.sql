insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'learning-media',
  'learning-media',
  false,
  104857600,
  array['audio/mpeg','audio/mp4','audio/x-m4a','audio/wav','audio/webm','audio/ogg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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
  )
);
