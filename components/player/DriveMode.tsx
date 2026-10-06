'use client'

import Link from 'next/link'
import { usePlayer } from '@/components/player/PlayerProvider'
import { formatPlaybackTime } from '@/lib/player/queue'

export default function DriveMode() {
  const player = usePlayer()

  if (!player.current) {
    return (
      <main className="drive-shell">
        <div className="drive-empty">
          <p className="eyebrow">DRIVE MODE</p>
          <h1>Start something, then drive.</h1>
          <p>Choose a song, episode, or mix first. Drive mode keeps the controls big and the screen quiet.</p>
          <Link className="primary" href="/listen">Choose audio</Link>
          <Link className="drive-back" href="/today">Back home</Link>
        </div>
      </main>
    )
  }

  const progress = player.duration > 0
    ? Math.min(100, Math.max(0, (player.currentTime / player.duration) * 100))
    : 0

  return (
    <main className="drive-shell active">
      <header className="drive-head">
        <Link href="/listen">Exit Drive</Link>
        <span>DRIVE MODE</span>
      </header>

      <section className="drive-now">
        <div className="drive-orb" aria-hidden="true">
          <span>{player.playing ? '♪' : 'Ⅱ'}</span>
        </div>

        <div className="drive-copy">
          <p>NOW PLAYING</p>
          <h1>{player.current.title}</h1>
          {player.current.subtitle && <span>{player.current.subtitle}</span>}
        </div>

        <div className="drive-progress" aria-label="Playback progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="drive-time">
          <span>{formatPlaybackTime(player.currentTime)}</span>
          <span>{formatPlaybackTime(player.duration)}</span>
        </div>

        <div className="drive-controls">
          <button type="button" onClick={() => void player.previous()} aria-label="Previous or restart">‹</button>
          <button className="drive-play" type="button" onClick={player.toggle}>
            {player.playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" onClick={() => void player.next()} aria-label="Next">›</button>
        </div>

        <p className="drive-note">Drive mode stays listen-only while you’re moving. Practice and scored responses wait until you’re safely stopped.</p>
      </section>
    </main>
  )
}
