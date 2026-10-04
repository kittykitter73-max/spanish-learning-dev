'use client'

import { usePlayer } from '@/components/player/PlayerProvider'
import { addToPlaylist, toggleFavorite } from '@/app/listen/actions'

type ListenItem = {
  id: string
  contentItemId: string
  title: string
  subtitle: string
  mediaKind: string
  playbackUrl?: string
  resumeSeconds?: number
}

type PlaylistOption = {
  id: string
  name: string
}

export default function ListenGrid({
  items,
  playlists,
  favoriteContentIds,
}: {
  items: ListenItem[]
  playlists: PlaylistOption[]
  favoriteContentIds: string[]
}) {
  const player = usePlayer()
  const queue = items.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    contentItemId: item.contentItemId,
    supportKind: item.subtitle === 'spoken lesson' ? ('transcript' as const) : undefined,
    playbackUrl: item.playbackUrl,
    resumeSeconds: item.resumeSeconds,
  }))
  const favorites = new Set(favoriteContentIds)

  return (
    <section className="media-grid">
      {items.map((item, index) => {
        const saved = favorites.has(item.contentItemId)

        return (
          <article className="media-card media-card-interactive" key={item.id}>
            <button
              className="media-play"
              type="button"
              onClick={() => player.playQueue(queue, index)}
              disabled={player.loadingId === item.id}
            >
              <div className="media-art" aria-hidden="true">
                <span>{player.loadingId === item.id ? '…' : '▶'}</span>
              </div>
              <p className="media-type">{item.mediaKind.replaceAll('_', ' ')}</p>
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>
            </button>

            <div className="media-actions">
              <form action={toggleFavorite}>
                <input type="hidden" name="contentItemId" value={item.contentItemId} />
                <button className={saved ? 'saved' : ''} type="submit">
                  {saved ? 'Saved' : 'Save'}
                </button>
              </form>

              {playlists.length > 0 && (
                <form action={addToPlaylist} className="playlist-add-form">
                  <input type="hidden" name="contentItemId" value={item.contentItemId} />
                  <select name="playlistId" aria-label={`Add ${item.title} to playlist`} required defaultValue="">
                    <option value="" disabled>Add to playlist</option>
                    {playlists.map(playlist => (
                      <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                    ))}
                  </select>
                  <button type="submit">Add</button>
                </form>
              )}
            </div>
          </article>
        )
      })}
    </section>
  )
}
