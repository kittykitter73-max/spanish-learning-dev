'use client'

import { usePlayer } from '@/components/player/PlayerProvider'

type ListenItem = {
  id: string
  title: string
  subtitle: string
  mediaKind: string
}

export default function ListenGrid({ items }: { items: ListenItem[] }) {
  const player = usePlayer()

  return (
    <section className="media-grid">
      {items.map(item => (
        <button
          className="media-card media-button"
          key={item.id}
          type="button"
          onClick={() => player.play({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
          })}
          disabled={player.loadingId === item.id}
        >
          <div className="media-art" aria-hidden="true">
            <span>{player.loadingId === item.id ? '…' : '▶'}</span>
          </div>
          <p className="media-type">{item.mediaKind.replaceAll('_', ' ')}</p>
          <h2>{item.title}</h2>
          <p>{item.subtitle}</p>
        </button>
      ))}
    </section>
  )
}
