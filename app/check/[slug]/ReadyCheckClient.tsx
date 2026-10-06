'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import {
  finalizeReadyCheck,
  getReadyCheckAttempt,
  startReadyCheck,
  startReadyCheckRetest,
  submitReadyCheckResponse,
} from '@/app/check/actions'

type AttemptItem = {
  itemKey: string
  ordinal: number
  dimension: string
  payload: {
    prompt?: string
    source?: string
    audioAssetId?: string
  }
  answered: boolean
}

type Attempt = {
  attemptId: string | null
  checkpointId?: string
  status: string
  attemptKind?: 'check' | 'retest'
  parentAttemptId?: string | null
  learnerResultCode?: string | null
  learnerMessage?: string | null
  items?: AttemptItem[]
  boosterPlan?: {
    requirementKeys?: string[]
    mode?: string
    recommendedMinutes?: number
  }
}

export default function ReadyCheckClient(props: {
  checkpointSlug: string
  initialAttemptId: string | null
  initialStatus: string
  canRunNow: boolean
  unavailableReason: string | null
  selectedCount: number
}) {
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({})
  const [audioLoading, setAudioLoading] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!props.initialAttemptId) return
    startTransition(async () => {
      try {
        setAttempt(await getReadyCheckAttempt(props.initialAttemptId))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not reopen this Ready Check.')
      }
    })
  }, [props.initialAttemptId])

  const items = attempt?.items ?? []
  const current = items[currentIndex]
  const answeredCount = useMemo(
    () => items.filter(item => item.answered).length,
    [items],
  )
  const isFinished = attempt && attempt.status !== 'in_progress'

  function begin() {
    setError(null)
    startTransition(async () => {
      try {
        const next = await startReadyCheck(props.checkpointSlug)
        setAttempt(next)
        setCurrentIndex(0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not start this Ready Check.')
      }
    })
  }

  function submitCurrent() {
    if (!attempt?.attemptId || !current) return
    const response = (responses[current.itemKey] ?? '').trim()
    if (!response) {
      setError('Add a response before continuing.')
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        await submitReadyCheckResponse({
          attemptId: attempt.attemptId!,
          itemKey: current.itemKey,
          response,
        })
        const refreshed = await getReadyCheckAttempt(attempt.attemptId!)
        setAttempt(refreshed)

        if (currentIndex < items.length - 1) {
          setCurrentIndex(currentIndex + 1)
          return
        }

        const result = await finalizeReadyCheck(attempt.attemptId!)
        setAttempt({ ...refreshed, ...result })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save that response.')
      }
    })
  }

  async function prepareAudio(itemKey: string, assetId: string) {
    setError(null)
    setAudioLoading(itemKey)
    try {
      const response = await fetch(`/api/media/${assetId}`)
      if (!response.ok) throw new Error('Listening audio is not available right now.')
      const data = await response.json()
      if (!data?.url) throw new Error('Listening audio is not available right now.')
      setAudioUrls(prev => ({ ...prev, [itemKey]: data.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not prepare listening audio.')
    } finally {
      setAudioLoading(null)
    }
  }

  function retest() {
    if (!attempt?.attemptId) return
    setError(null)
    startTransition(async () => {
      try {
        const next = await startReadyCheckRetest(props.checkpointSlug, attempt.attemptId!)
        setAttempt(next)
        setResponses({})
        setCurrentIndex(0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'A fresh retest is not available yet.')
      }
    })
  }

  if (props.initialStatus === 'ready' && !attempt) {
    return (
      <section className="card ready-check-card ready-check-result">
        <p className="eyebrow">READY</p>
        <h2>You already showed it.</h2>
        <p>Borao found enough fresh evidence in your recent work, so there is nothing extra to test right now.</p>
      </section>
    )
  }

  if (!props.canRunNow && !attempt) {
    return (
      <section className="card ready-check-card">
        <p className="eyebrow">NOT COUNTED AGAINST YOU</p>
        <h2>We need one more piece before this can run.</h2>
        <p>{props.unavailableReason ?? 'Reviewed prompts or audio are still being prepared.'}</p>
      </section>
    )
  }

  if (!attempt) {
    return (
      <section className="card ready-check-card">
        <p className="eyebrow">{props.selectedCount} ADAPTIVE PROMPTS MAX</p>
        <h2>Show what you can do.</h2>
        <p>The questions are chosen from the evidence you still need. Once you start, this attempt is frozen so it cannot change underneath you.</p>
        <button className="primary" type="button" onClick={begin} disabled={isPending}>
          {isPending ? 'Opening…' : 'Start Ready Check'}
        </button>
        {error && <p className="ready-check-error">{error}</p>}
      </section>
    )
  }

  if (isFinished) {
    const boosterNeeded = attempt.status === 'booster_recommended'
    return (
      <section className="card ready-check-card ready-check-result">
        <p className="eyebrow">
          {attempt.status === 'ready' ? 'READY' : attempt.status === 'technical_issue' ? 'NOT SCORED' : 'ALMOST THERE'}
        </p>
        <h2>
          {attempt.status === 'ready'
            ? 'You’re ready to move on.'
            : attempt.status === 'technical_issue'
              ? 'One part needs a clean retry.'
              : 'A short booster is the fastest next move.'}
        </h2>
        <p>{attempt.learnerMessage}</p>

        {boosterNeeded && (
          <div className="ready-check-booster">
            <strong>Targeted Booster</strong>
            <span>
              About {attempt.boosterPlan?.recommendedMinutes ?? 4} minutes, focused only on the missing evidence.
            </span>
            <button className="primary" type="button" onClick={retest} disabled={isPending}>
              {isPending ? 'Preparing…' : 'Retest the missing pieces'}
            </button>
          </div>
        )}

        {attempt.status === 'technical_issue' && (
          <button className="secondary" type="button" onClick={retest} disabled={isPending}>
            Retry unscored pieces
          </button>
        )}
        {error && <p className="ready-check-error">{error}</p>}
      </section>
    )
  }

  if (!current) {
    return (
      <section className="card ready-check-card">
        <p>Loading your frozen Ready Check…</p>
      </section>
    )
  }

  const payload = current.payload ?? {}
  const progress = items.length ? Math.round(((currentIndex + 1) / items.length) * 100) : 0

  return (
    <section className="card ready-check-card">
      <div className="ready-check-progress-row">
        <span>{currentIndex + 1} of {items.length}</span>
        <span>{answeredCount} saved</span>
      </div>
      <div className="ready-check-progress"><span style={{ width: `${progress}%` }} /></div>

      <p className="eyebrow">{current.dimension.replaceAll('_', ' ')}</p>
      {payload.source && <div className="ready-check-source">{payload.source}</div>}
      <h2>{payload.prompt ?? 'Respond when you are ready.'}</h2>

      {payload.audioAssetId && (
        <div className="ready-check-audio">
          {audioUrls[current.itemKey] ? (
            <audio controls preload="metadata" src={audioUrls[current.itemKey]} />
          ) : (
            <button
              className="secondary"
              type="button"
              onClick={() => prepareAudio(current.itemKey, payload.audioAssetId!)}
              disabled={audioLoading === current.itemKey}
            >
              {audioLoading === current.itemKey ? 'Preparing audio…' : 'Play listening prompt'}
            </button>
          )}
        </div>
      )}

      <textarea
        className="ready-check-response"
        value={responses[current.itemKey] ?? ''}
        onChange={event => setResponses(prev => ({ ...prev, [current.itemKey]: event.target.value }))}
        placeholder="Type what you would say…"
        rows={4}
      />

      <button className="primary" type="button" onClick={submitCurrent} disabled={isPending}>
        {isPending ? 'Saving…' : currentIndex === items.length - 1 ? 'Finish check' : 'Save & continue'}
      </button>
      {error && <p className="ready-check-error">{error}</p>}
    </section>
  )
}
