'use client'

import { useMemo, useState, useTransition } from 'react'
import { recordExposure, submitAssessment, saveLessonProgress } from '@/app/learn/actions'
import type { AssessmentItem } from '@/lib/learning/assessment'

type Stage = 'scene' | 'recognition' | 'retrieve' | 'manipulate' | 'produce' | 'done'

type Segment = {
  id: string
  sequence_number: number
  segment_type: string
  text_es: string | null
  text_en: string | null
  speaker?: { slug: string; character?: { display_name: string } | null } | null
}

type Lesson = { id: string; title: string; segments: Segment[]; assessments: AssessmentItem[] }

const stageAssessmentIndex: Partial<Record<Stage, number>> = {
  recognition: 0,
  retrieve: 1,
  manipulate: 2,
  produce: 3,
}

export default function LearnClient({ lesson, initialStage = 'scene' }: { lesson: Lesson; initialStage?: Stage }) {
  const [stage, setStage] = useState<Stage>(initialStage)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [passed, setPassed] = useState(false)
  const [recommendationReasons, setRecommendationReasons] = useState<string[]>([])
  const [pending, startTransition] = useTransition()
  const progress = useMemo(
    () => ({ scene: 10, recognition: 30, retrieve: 50, manipulate: 70, produce: 88, done: 100 }[stage]),
    [stage]
  )
  const dialogue = lesson.segments.filter(s => s.segment_type === 'dialogue').slice(0, 4)
  const assessmentIndex = stageAssessmentIndex[stage]
  const assessment = assessmentIndex === undefined ? undefined : lesson.assessments[assessmentIndex]

  function next(nextStage: Stage) {
    setAnswer('')
    setFeedback('')
    setPassed(false)
    setStage(nextStage)
    startTransition(async () => {
      try { await saveLessonProgress({ contentItemId: lesson.id, stage: nextStage, completed: nextStage === 'done' }) }
      catch { /* evidence remains authoritative even if resume position fails */ }
    })
  }

  function submit(response: string, onSuccess: () => void) {
    if (!assessment) return
    setFeedback('')
    setPassed(false)
    startTransition(async () => {
      try {
        const result = await submitAssessment({
          assessmentItemId: assessment.id,
          contentItemId: lesson.id,
          response,
        })
        setRecommendationReasons(result.reasonCodes)
        setPassed(result.success)
        if (result.success) onSuccess()
        else setFeedback(assessment.failure_feedback || 'Not yet. Try the pattern once more.')
      } catch {
        setFeedback('That did not save. Try once more.')
      }
    })
  }

  return (
    <main className="shell">
      <header className="app-head">
        <span className="brand">BORAO</span>
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        <span className="tiny">Development build</span>
      </header>

      {stage === 'scene' && <section className="card lesson">
        <p className="eyebrow">TODAY · FIRST CONTACT</p>
        <h1>{lesson.title}</h1>
        <p className="lede">Don’t translate everything. Just listen for what repeats.</p>
        <div className="dialogue">
          {dialogue.map(s => <p key={s.id}>
            <b>{s.speaker?.character?.display_name ?? 'Narrator'}</b>
            <span>{s.text_es}</span>
          </p>)}
        </div>
        <button className="primary" disabled={pending} onClick={() => startTransition(async () => {
          try { await recordExposure(lesson.id); next('recognition') }
          catch { setFeedback('Your progress did not save. Try again.') }
        })}>I heard it</button>
        {feedback && <p className="feedback">{feedback}</p>}
      </section>}

      {stage === 'recognition' && assessment && <section className="card lesson">
        <p className="eyebrow">{assessment.stage_label || 'CATCH IT'}</p>
        <h2>{assessment.prompt}</h2>
        <div className="choices">
          {assessment.options.map(option => (
            <button key={option.key} disabled={pending} onClick={() => submit(option.key, () => {
              setFeedback(assessment.success_feedback || 'Yes — you caught it.')
            })}>{option.label}</button>
          ))}
        </div>
        {feedback && <p className="feedback">{feedback}</p>}
        {passed && <button className="primary" onClick={() => next('retrieve')}>Keep going</button>}
      </section>}

      {stage === 'retrieve' && assessment && <section className="card lesson">
        <p className="eyebrow">{assessment.stage_label || 'SAY IT BEFORE WE SHOW IT'}</p>
        <h2>{assessment.prompt}</h2>
        <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type it in Spanish" autoComplete="off" />
        <button className="primary" disabled={pending || !answer.trim()} onClick={() => submit(answer, () => {
          setFeedback(assessment.success_feedback || 'Exactly.')
        })}>Check</button>
        {feedback && <p className="feedback">{feedback}</p>}
        {passed && <button className="secondary" onClick={() => next('manipulate')}>Next pattern</button>}
      </section>}

      {stage === 'manipulate' && assessment && <section className="card lesson">
        <p className="eyebrow">{assessment.stage_label || 'BEND IT'}</p>
        <h2>{assessment.prompt}</h2>
        {assessment.support_text && <p className="support-copy">{assessment.support_text}</p>}
        <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Change the intention…" autoComplete="off" />
        <button className="primary" disabled={pending || !answer.trim()} onClick={() => submit(answer, () => {
          setFeedback(assessment.success_feedback || 'Yes. Same idea, new shape.')
        })}>Check the switch</button>
        {feedback && <p className="feedback">{feedback}</p>}
        {passed && <button className="secondary" onClick={() => next('produce')}>Make it mine</button>}
      </section>}

      {stage === 'produce' && assessment && <section className="card lesson">
        <p className="eyebrow">{assessment.stage_label || 'YOUR LIFE NOW'}</p>
        <h2>{assessment.prompt}</h2>
        {assessment.support_text && <p className="muted">{assessment.support_text}</p>}
        <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer in Spanish" autoComplete="off" />
        <button className="primary" disabled={!answer.trim() || pending} onClick={() => submit(answer, () => { setFeedback(assessment.success_feedback || 'That counts as real production.'); setTimeout(() => next('done'), 500) })}>Save my answer</button>
        {feedback && <p className="feedback">{feedback}</p>}
      </section>}

      {stage === 'done' && <section className="card lesson success">
        <p className="eyebrow">NICE. THAT WAS REAL SPANISH.</p>
        <h1>You retrieved, changed, and used the pattern.</h1>
        <p className="lede">The system now has separate evidence for what you recognized versus what you actually produced.</p>
        {recommendationReasons.length > 0 && <p className="muted">Next-step signals: {recommendationReasons.join(' · ')}</p>}
        <button className="secondary" onClick={() => next('scene')}>Replay prototype</button>
      </section>}
    </main>
  )
}
