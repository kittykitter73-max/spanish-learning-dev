'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type PlayRequest = {
  id: string
  title: string
  subtitle?: string
}

type Track = PlayRequest & {
  src: string
}

type PlayerContextValue = {
  current: Track | null
  playing: boolean
  loadingId: string | null
  error: string | null
  play: (request: PlayRequest) => Promise<void>
  toggle: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function usePlayer() {
  const value = useContext(PlayerContext)
  if (!value) throw new Error('usePlayer must be used inside PlayerProvider')
  return value
}

export default function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [current, setCurrent] = useState<Track | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const play = useCallback(async (request: PlayRequest) => {
    setLoadingId(request.id)
    setError(null)

    try {
      const response = await fetch(`/api/media/${encodeURIComponent(request.id)}`, {
        cache: 'no-store',
      })

      const payload = await response.json()
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || 'Audio could not be loaded.')
      }

      const next: Track = {
        ...request,
        src: payload.url,
      }

      setCurrent(next)

      queueMicrotask(async () => {
        try {
          if (!audioRef.current) return
          audioRef.current.src = next.src
          await audioRef.current.play()
          setPlaying(true)
        } catch {
          setPlaying(false)
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audio could not be loaded.')
    } finally {
      setLoadingId(null)
    }
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !current) return

    if (audio.paused) {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }, [current])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const value = useMemo<PlayerContextValue>(() => ({
    current,
    playing,
    loadingId,
    error,
    play,
    toggle,
  }), [current, playing, loadingId, error, play, toggle])

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
      {current && (
        <aside className="player-dock" aria-label="Now playing">
          <div className="player-copy">
            <span className="tiny">NOW PLAYING</span>
            <strong>{current.title}</strong>
            {current.subtitle && <span>{current.subtitle}</span>}
          </div>
          <button onClick={toggle} type="button" aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? 'Pause' : 'Play'}
          </button>
        </aside>
      )}
      {error && <div className="player-error" role="status">{error}</div>}
    </PlayerContext.Provider>
  )
}
