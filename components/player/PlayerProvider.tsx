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
import {
  exposureThresholdSeconds,
  formatPlaybackTime,
  nextQueueIndex,
  previousQueueIndex,
  type QueueItem,
} from '@/lib/player/queue'

type Track = QueueItem & {
  src: string
}

type SupportLine = {
  sequence: number
  speaker: string | null
  es: string | null
  en: string | null
}

type SupportPayload = {
  kind: 'transcript' | 'lyrics' | 'none'
  title: string
  lines: SupportLine[]
}

type PlayerContextValue = {
  current: Track | null
  playing: boolean
  loadingId: string | null
  error: string | null
  queue: QueueItem[]
  currentIndex: number
  currentTime: number
  duration: number
  play: (request: QueueItem) => Promise<void>
  playQueue: (items: QueueItem[], startIndex?: number) => Promise<void>
  toggle: () => void
  next: () => Promise<void>
  previous: () => Promise<void>
  seek: (seconds: number) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function usePlayer() {
  const value = useContext(PlayerContext)
  if (!value) throw new Error('usePlayer must be used inside PlayerProvider')
  return value
}

export default function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const queueRef = useRef<QueueItem[]>([])
  const indexRef = useRef(-1)
  const exposureRecordedForRef = useRef<string | null>(null)

  const [current, setCurrent] = useState<Track | null>(null)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [supportOpen, setSupportOpen] = useState(false)
  const [supportLoading, setSupportLoading] = useState(false)
  const [support, setSupport] = useState<SupportPayload | null>(null)

  const loadAt = useCallback(async (items: QueueItem[], index: number) => {
    const request = items[index]
    if (!request) return

    setLoadingId(request.id)
    setError(null)

    try {
      let src = request.playbackUrl

      if (!src) {
        const response = await fetch(`/api/media/${encodeURIComponent(request.id)}`, {
          cache: 'no-store',
        })

        const payload = await response.json()
        if (!response.ok || !payload?.url) {
          throw new Error(payload?.error || 'Audio could not be loaded.')
        }
        src = payload.url
      }

      const nextTrack: Track = {
        ...request,
        src,
      }

      queueRef.current = items
      indexRef.current = index
      setQueue(items)
      setCurrentIndex(index)
      setCurrent(nextTrack)
      setCurrentTime(0)
      setDuration(0)

      const audio = audioRef.current
      if (!audio) return

      audio.dataset.assetId = request.id
      exposureRecordedForRef.current = null
      audio.src = nextTrack.src
      audio.load()

      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audio could not be loaded.')
    } finally {
      setLoadingId(null)
    }
  }, [])

  const playQueue = useCallback(async (items: QueueItem[], startIndex = 0) => {
    if (items.length === 0) return
    const index = Math.min(Math.max(startIndex, 0), items.length - 1)
    await loadAt(items, index)
  }, [loadAt])

  const play = useCallback(async (request: QueueItem) => {
    await playQueue([request], 0)
  }, [playQueue])

  const next = useCallback(async () => {
    const nextIndex = nextQueueIndex(queueRef.current.length, indexRef.current)
    if (nextIndex < 0) return
    await loadAt(queueRef.current, nextIndex)
  }, [loadAt])

  const previous = useCallback(async () => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 5) {
      audio.currentTime = 0
      setCurrentTime(0)
      return
    }

    const previousIndex = previousQueueIndex(queueRef.current.length, indexRef.current)
    if (previousIndex < 0) {
      if (audio) {
        audio.currentTime = 0
        setCurrentTime(0)
      }
      return
    }
    await loadAt(queueRef.current, previousIndex)
  }, [loadAt])

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

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(seconds)) return
    const bounded = Math.min(Math.max(seconds, 0), Number.isFinite(audio.duration) ? audio.duration : seconds)
    audio.currentTime = bounded
    setCurrentTime(bounded)
  }, [])

  const openSupport = useCallback(async () => {
    if (!current?.contentItemId || !current.supportKind) return

    setSupportOpen(true)
    if (support?.title === current.title && support.kind === current.supportKind) return

    setSupportLoading(true)
    try {
      const response = await fetch(
        `/api/content/${encodeURIComponent(current.contentItemId)}/support`,
        { cache: 'no-store' },
      )
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Support text could not be loaded.')
      setSupport(payload as SupportPayload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Support text could not be loaded.')
      setSupportOpen(false)
    } finally {
      setSupportLoading(false)
    }
  }, [current, support])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTime = () => {
      const time = audio.currentTime || 0
      setCurrentTime(time)

      const assetId = audio.dataset.assetId
      if (!assetId || exposureRecordedForRef.current === assetId) return

      const threshold = exposureThresholdSeconds(audio.duration)
      if (time < threshold) return

      exposureRecordedForRef.current = assetId
      void fetch(`/api/media/${encodeURIComponent(assetId)}/exposure`, {
        method: 'POST',
        cache: 'no-store',
      })
        .then(response => {
          if (!response.ok) exposureRecordedForRef.current = null
        })
        .catch(() => {
          exposureRecordedForRef.current = null
        })
    }
    const onDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onEnded = () => {
      setPlaying(false)
      const nextIndex = nextQueueIndex(queueRef.current.length, indexRef.current)
      if (nextIndex >= 0) void loadAt(queueRef.current, nextIndex)
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('durationchange', onDuration)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('durationchange', onDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [loadAt])

  useEffect(() => {
    setSupportOpen(false)
    setSupport(null)
  }, [current?.id])

  useEffect(() => {
    if (!current || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.subtitle ?? 'Borao',
      album: 'Borao',
    })

    const setHandler = (
      action: MediaSessionAction,
      handler: MediaSessionActionHandler | null,
    ) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler)
      } catch {
        // Some browsers expose Media Session but not every action.
      }
    }

    setHandler('play', () => {
      void audioRef.current?.play()
    })
    setHandler('pause', () => {
      audioRef.current?.pause()
    })
    setHandler('previoustrack', () => {
      void previous()
    })
    setHandler('nexttrack', () => {
      void next()
    })
    setHandler('seekbackward', details => {
      seek((audioRef.current?.currentTime ?? 0) - (details.seekOffset ?? 10))
    })
    setHandler('seekforward', details => {
      seek((audioRef.current?.currentTime ?? 0) + (details.seekOffset ?? 10))
    })
    setHandler('seekto', details => {
      if (typeof details.seekTime === 'number') seek(details.seekTime)
    })

    return () => {
      for (const action of ['play','pause','previoustrack','nexttrack','seekbackward','seekforward','seekto'] as MediaSessionAction[]) {
        setHandler(action, null)
      }
    }
  }, [current, next, previous, seek])

  const value = useMemo<PlayerContextValue>(() => ({
    current,
    playing,
    loadingId,
    error,
    queue,
    currentIndex,
    currentTime,
    duration,
    play,
    playQueue,
    toggle,
    next,
    previous,
    seek,
  }), [
    current,
    playing,
    loadingId,
    error,
    queue,
    currentIndex,
    currentTime,
    duration,
    play,
    playQueue,
    toggle,
    next,
    previous,
    seek,
  ])

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />

      {current && (
        <aside className="player-dock" aria-label="Now playing">
          <div className="player-copy">
            <span className="tiny">
              NOW PLAYING
              {queue.length > 1 ? ` · ${currentIndex + 1}/${queue.length}` : ''}
            </span>
            <strong>{current.title}</strong>
            {current.subtitle && <span>{current.subtitle}</span>}
          </div>

          <div className="player-progress">
            <span>{formatPlaybackTime(currentTime)}</span>
            <input
              aria-label="Playback position"
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              step={1}
              value={Math.min(currentTime, Math.max(duration, 1))}
              onChange={event => seek(Number(event.target.value))}
            />
            <span>{formatPlaybackTime(duration)}</span>
          </div>

          <div className="player-controls">
            {current.supportKind && current.contentItemId && (
              <button
                className="player-support-button"
                type="button"
                onClick={() => void openSupport()}
              >
                {current.supportKind === 'transcript' ? 'Transcript' : 'Lyrics'}
              </button>
            )}
            <button
              className="player-icon"
              onClick={() => void previous()}
              type="button"
              aria-label="Previous track"
            >
              ‹
            </button>
            <button
              className="player-toggle"
              onClick={toggle}
              type="button"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              className="player-icon"
              onClick={() => void next()}
              type="button"
              aria-label="Next track"
              disabled={nextQueueIndex(queue.length, currentIndex) < 0}
            >
              ›
            </button>
          </div>
        </aside>
      )}

      {supportOpen && current?.supportKind && (
        <aside className="player-support-sheet" aria-label={current.supportKind === 'transcript' ? 'Transcript' : 'Lyrics'}>
          <div className="support-sheet-head">
            <div>
              <span className="eyebrow">{current.supportKind.toUpperCase()}</span>
              <strong>{current.title}</strong>
            </div>
            <button type="button" onClick={() => setSupportOpen(false)} aria-label="Close support text">Close</button>
          </div>

          {supportLoading ? (
            <p className="muted">Loading…</p>
          ) : support?.lines?.length ? (
            <div className="support-lines">
              {support.lines.map(line => (
                <div className="support-line" key={line.sequence}>
                  {line.speaker && <b>{line.speaker}</b>}
                  {line.es && <p>{line.es}</p>}
                  {line.en && <small>{line.en}</small>}
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No support text is available for this audio yet.</p>
          )}
        </aside>
      )}

      {error && <div className="player-error" role="status">{error}</div>}
    </PlayerContext.Provider>
  )
}
