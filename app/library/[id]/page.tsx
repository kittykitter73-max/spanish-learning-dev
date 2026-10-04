import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/app/AppNav'
import PlaylistQueue from '@/components/library/PlaylistQueue'

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const { data: playlist, error: playlistError } = await supabase
    .from('playlists')
    .select('id,name,description,playlist_type,playback_mode')
    .eq('id', id)
    .maybeSingle()

  if (playlistError || !playlist) notFound()

  const { data: rows, error: itemError } = await supabase
    .from('playlist_items')
    .select('position,content_item_id,content_item:content_items(id,title,content_type)')
    .eq('playlist_id', playlist.id)
    .order('position', { ascending: true })

  if (itemError) throw new Error(itemError.message)

  const contentIds = (rows ?? []).map(row => row.content_item_id)
  const { data: media, error: mediaError } = contentIds.length
    ? await supabase
        .from('media_assets')
        .select('id,content_item_id,media_kind,status')
        .in('content_item_id', contentIds)
        .eq('status', 'ready')
    : { data: [], error: null }

  if (mediaError) throw new Error(mediaError.message)

  const firstMediaByContent = new Map<string, any>()
  for (const asset of media ?? []) {
    if (!firstMediaByContent.has(asset.content_item_id)) {
      firstMediaByContent.set(asset.content_item_id, asset)
    }
  }

  const playable = (rows ?? []).flatMap((row: any) => {
    const asset = firstMediaByContent.get(row.content_item_id)
    if (!asset) return []

    return [{
      id: asset.id,
      title: row.content_item?.title ?? 'Borao audio',
      subtitle: row.content_item?.content_type?.replaceAll('_', ' ') ?? 'audio',
      mediaKind: asset.media_kind,
      position: row.position,
    }]
  })

  return (
    <main className="product-shell app-surface">
      <AppNav active="library" />

      <section className="surface-hero compact playlist-hero">
        <div>
          <p className="eyebrow">{playlist.playlist_type.toUpperCase()} PLAYLIST</p>
          <h1>{playlist.name}</h1>
          <p className="lede">
            {playlist.description || 'Your listening mix. Add songs and spoken episodes as your Borao library grows.'}
          </p>
          <p className="playlist-meta">
            {rows?.length ?? 0} saved item{(rows?.length ?? 0) === 1 ? '' : 's'} · {playable.length} playable now
          </p>
        </div>
      </section>

      {playable.length > 0 ? (
        <PlaylistQueue items={playable} />
      ) : (
        <section className="card media-empty">
          <p className="eyebrow">NOTHING PLAYABLE YET</p>
          <h2>This mix is ready for audio.</h2>
          <p>
            Items can stay in your playlist before their audio is ready. As soon as an approved audio asset is attached, it becomes playable here automatically.
          </p>
          <Link className="primary" href="/listen">Browse Listen</Link>
        </section>
      )}

      {(rows ?? []).length > playable.length && (
        <section className="playlist-pending">
          <p className="eyebrow">SAVED FOR LATER</p>
          {(rows ?? []).filter((row: any) => !firstMediaByContent.has(row.content_item_id)).map((row: any) => (
            <div className="library-row" key={row.content_item_id}>
              <div>
                <strong>{row.content_item?.title ?? 'Saved content'}</strong>
                <span>Audio not ready yet</span>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
