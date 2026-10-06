'use client'

import { usePlayer } from '@/components/player/PlayerProvider'
import { formatPlaybackTime } from '@/lib/player/queue'

type TrackRow = {
  contentItemId: string
  position: number
  title: string
  subtitle: string
  itemRole: string
  unlocked: boolean
  mediaId: string | null
  playbackUrl: string | null
  durationMs: number | null
}

export default function CollectionTrackList({ items }: { items: TrackRow[] }) {
  const player = usePlayer()

  const playable = items.flatMap(item =>
    item.unlocked && item.mediaId && item.playbackUrl
      ? [{
          id: item.mediaId,
          title: item.title,
          subtitle: item.subtitle,
          contentItemId: item.contentItemId,
          playbackUrl: item.playbackUrl,
        }]
      : []
  )

  function playableIndex(contentItemId: string) {
    return playable.findIndex(item => item.contentItemId === contentItemId)
  }

  return (
    <section className="collection-track-list">
      {playable.length > 1 && (
        <div className="collection-actions">
          <button
            className="primary"
            type="button"
            onClick={() => player.playQueue(playable, 0)}
          >
            Play unlocked tracks
          </button>
        </div>
      )}

      {items.map(item => {
        const index = playableIndex(item.contentItemId)
        const canPlay = index >= 0
        const duration = item.durationMs
          ? formatPlaybackTime(item.durationMs / 1000)
          : null

        return (
          <article
            className={`collection-track ${item.unlocked ? 'unlocked' : 'locked'}`}
            key={item.contentItemId}
          >
            <span className="collection-track-number">{item.position}</span>
            <div className="collection-track-copy">
              <div className="collection-track-title">
                <strong>{item.title}</strong>
                {item.itemRole === 'bonus' && <span>Bonus</span>}
                {item.itemRole === 'starter' && <span>Starter</span>}
              </div>
              <small>
                {!item.unlocked
                  ? 'Locked'
                  : canPlay
                    ? [item.subtitle, duration].filter(Boolean).join(' · ')
                    : 'Unlocked · audio coming soon'}
              </small>
            </div>

            {canPlay ? (
              <button
                className="collection-play-button"
                type="button"
                onClick={() => player.playQueue(playable, index)}
                aria-label={`Play ${item.title}`}
              >
                ▶
              </button>
            ) : (
              <span className="collection-lock" aria-label={item.unlocked ? 'Audio coming soon' : 'Locked'}>
                {item.unlocked ? '○' : '◇'}
              </span>
            )}
          </article>
        )
      })}
    </section>
  )
}
