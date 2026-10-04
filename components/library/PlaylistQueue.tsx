'use client'

import { usePlayer } from '@/components/player/PlayerProvider'

type Item = {
  id: string
  title: string
  subtitle: string
  mediaKind: string
  position: number
}

export default function PlaylistQueue({ items }: { items: Item[] }) {
  const player = usePlayer()
  const queue = items.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
  }))

  return (
    <section className="playlist-queue">
      <div className="playlist-actions">
        <button
          className="primary"
          type="button"
          onClick={() => player.playQueue(queue, 0)}
          disabled={player.loadingId !== null}
        >
          {player.loadingId ? 'Loading…' : 'Play all'}
        </button>
      </div>

      <div className="playlist-track-list">
        {items.map((item, index) => (
          <button
            className="playlist-track"
            key={item.id}
            type="button"
            onClick={() => player.playQueue(queue, index)}
            disabled={player.loadingId === item.id}
          >
            <span className="track-number">{index + 1}</span>
            <div>
              <strong>{item.title}</strong>
              <span>{item.subtitle} · {item.mediaKind.replaceAll('_', ' ')}</span>
            </div>
            <span className="track-play">{player.loadingId === item.id ? '…' : '▶'}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
