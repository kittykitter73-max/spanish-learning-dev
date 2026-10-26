'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { assessSongPackage, nextDraftVersion, type SongPackage, type ReviewDimension, type StudioReview } from '@/lib/studio/pipeline'
import './studio.css'

type CatalogItem = { id: string; title: string; content_type: string; status: string }
type CurriculumConcept = { id: string; canonical_spanish: string; canonical_english: string | null; communicative_function: string | null; status: string }
const initial: SongPackage = {
  id: 'arc-1-song-candidate', version: 1, status: 'drafting',
  conceptIds: [], objective: 'Ask for what you want in an everyday conversation',
  lyrics: '', hooks: ['', ''], musicPrompt: '',
  exercises: [{ kind: 'production', prompt: 'Without reading the lyrics, ask for something you want in Spanish.', expectedConceptIds: [] }],
  reviews: []
}
const dimensions: ReviewDimension[] = ['language', 'pedagogy', 'creative']
const labels: Record<ReviewDimension, string> = {
  language: 'Spanish & naturalness', pedagogy: 'Learning & retrieval', creative: 'Hook & replay value'
}

export default function StudioWorkbench({ catalog, catalogError, concepts, conceptError }: { catalog: CatalogItem[]; catalogError: string | null; concepts: CurriculumConcept[]; conceptError: string | null }) {
  const [song, setSong] = useState<SongPackage>(initial)
  const [feedback, setFeedback] = useState('')
  const [persisted, setPersisted] = useState<{ id: string; version: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [view, setView] = useState<'draft'|'review'|'catalog'>('draft')
  const problems = assessSongPackage(song)
  const saveDraft = async () => {
    if (saving) return
    setSaving(true)
    setSaveMessage('')
    const supabase = createClient()
    const payload = {
      p_title: song.objective.slice(0, 160),
      p_objective: song.objective,
      p_concept_ids: song.conceptIds,
      p_lyrics: song.lyrics,
      p_hooks: song.hooks,
      p_music_prompt: song.musicPrompt,
      p_exercises: song.exercises,
    }
    try {
      const result = persisted
        ? await supabase.rpc('studio_revise_song', {
            ...payload, p_job_id: persisted.id, p_expected_version: persisted.version,
          })
        : await supabase.rpc('studio_create_song', payload)
      if (result.error) {
        setSaveMessage(result.error.message.includes('studio_version_conflict')
          ? 'Version conflict: this draft has changed elsewhere. Reload the latest version before saving again.'
          : 'Save failed: ' + result.error.message)
        return
      }
      const record = Array.isArray(result.data) ? result.data[0] : null
      if (!record?.job_id || typeof record.version !== 'number') {
        setSaveMessage('The server returned an unexpected save result.')
        return
      }
      setPersisted({ id: record.job_id, version: record.version })
      setSong(prev => ({ ...prev, id: record.job_id, version: record.version, status: 'drafting', reviews: [], founderApprovedVersion: undefined }))
      setSaveMessage('Draft saved to Borao Studio as version ' + record.version + '.')
    } catch {
      setSaveMessage('Unable to save the draft. Check connectivity and try again.')
    } finally {
      setSaving(false)
    }
  }
  const toggleConcept = (id: string) => {
    const conceptIds = song.conceptIds.includes(id) ? song.conceptIds.filter(x => x !== id) : [...song.conceptIds, id]
    updateDraft({ conceptIds, exercises: song.exercises.map(e => ({...e, expectedConceptIds: conceptIds})) })
  }
  const updateDraft = (changes: Partial<SongPackage>) => {
    setSong(prev => {
      const next = prev.reviews.length || prev.founderApprovedVersion !== undefined || prev.status === 'approved' ? nextDraftVersion(prev) : prev
      return { ...next, ...changes }
    })
    setFeedback('Saved in this browser session only. Review approvals were reset after the edit.')
  }
  const recordReview = (dimension: ReviewDimension, verdict: 'pass'|'revise') => {
    const review: StudioReview = { dimension, verdict, reasonCodes: verdict === 'revise' ? ['REVIEWER_REVISION'] : [], notes: feedback.trim() || (verdict === 'pass' ? 'Prototype reviewer sign-off' : 'Revision requested'), reviewedVersion: song.version }
    setSong(prev => ({ ...prev, status: verdict === 'revise' ? 'needs_revision' : 'creative_review', founderApprovedVersion: undefined,
      reviews: [...prev.reviews.filter(r => !(r.dimension === dimension && r.reviewedVersion === prev.version)), review] }))
    setFeedback('')
  }
  const approve = () => {
    if (problems.length) return
    setSong(prev => ({ ...prev, status: 'approved', founderApprovedVersion: prev.version }))
    setFeedback('Prototype approval recorded locally. No database record or publication was created.')
  }
  return (
    <div className="studio-content">
      <aside className="studio-side">
        <div className="studio-side-title">PRODUCTION</div>
        <button className={view === 'draft' ? 'studio-side-active' : ''} onClick={() => setView('draft')}>01 <span>Song editor</span></button>
        <button className={view === 'review' ? 'studio-side-active' : ''} onClick={() => setView('review')}>02 <span>Quality review</span></button>
        <button className={view === 'catalog' ? 'studio-side-active' : ''} onClick={() => setView('catalog')}>03 <span>Existing content</span></button>
        <div className="studio-side-note">Prototype only. Refreshing will clear changes. Persistent agent jobs and publishing come in the next milestone.</div>
      </aside>
      <section className="studio-main">
        <div className="studio-step">
          <span>ARC 01 / STUDIO PILOT</span>
          <span className="studio-status">{song.status.replaceAll('_', ' ')} · V{song.version}</span>
        </div>
        {view === 'draft' && <div className="studio-panel">
          <h2>The next track starts here.</h2>
          <p className="studio-muted">Build around a real-world speaking goal, not a random vocabulary list. Choose from the published curriculum concepts below. The learning system remains authoritative.</p>
          <label>Communication goal<input value={song.objective} onChange={e => updateDraft({ objective: e.target.value })}/></label>
          <fieldset className="studio-concepts"><legend>Target curriculum concepts ({song.conceptIds.length} selected)</legend>
            {conceptError ? <p role="alert">Concept catalog unavailable: {conceptError}</p> : concepts.length === 0 ? <p>No published concepts available to select.</p> :
              <div className="studio-concept-list">{concepts.map(concept =>
                <label key={concept.id} className="studio-concept-choice">
                  <input type="checkbox" checked={song.conceptIds.includes(concept.id)} onChange={() => toggleConcept(concept.id)}/>
                  <span><strong>{concept.canonical_spanish}</strong><small>{concept.canonical_english ?? concept.communicative_function ?? concept.id}</small></span>
                </label>
              )}</div>}
          </fieldset>
          <label>Original song lyrics<textarea rows={9} placeholder="Verse, hook, and bridge..." value={song.lyrics} onChange={e => updateDraft({lyrics:e.target.value})}/></label>
          <div className="studio-two">
            {[0,1].map(i => <label key={i}>Alternate hook {i + 1}<textarea rows={3} value={song.hooks[i]} onChange={e => updateDraft({hooks:song.hooks.map((h,j)=>i===j?e.target.value:h)})}/></label>)}
          </div>
          <label>Music production prompt <small>({song.musicPrompt.length}/900 characters)</small><textarea rows={4} maxLength={950} value={song.musicPrompt} onChange={e => updateDraft({musicPrompt:e.target.value})}/></label>
          <div className="studio-info">One production exercise is preloaded. Before release, exercises must be tied to the exact curriculum concepts and independently reviewed.</div>
          <button className="studio-primary" onClick={saveDraft} disabled={saving || !song.conceptIds.length || !song.objective.trim() || song.musicPrompt.length > 900}>{saving ? 'Saving…' : persisted ? 'Save revised version' : 'Save first draft'}</button>
          {saveMessage && <p role="status" className="studio-muted">{saveMessage}</p>}
          <button onClick={() => setView('review')}>Go to quality review →</button>
        </div>}
        {view === 'review' && <div className="studio-panel">
          <h2>Quality before quantity.</h2>
          <p className="studio-muted">The three reviewer controls below are manual placeholders. They are not automated AI or native-speaker certifications.</p>
          <div className="studio-reviews">
            {dimensions.map(d => {
              const review = song.reviews.find(r=>r.dimension===d && r.reviewedVersion===song.version)
              return <div className="studio-review" key={d}>
                <div><strong>{labels[d]}</strong><span>{review ? review.verdict : 'Needs review'}</span></div>
                <div className="studio-actions">
                  <button onClick={() => recordReview(d,'pass')}>Mark pass</button>
                  <button onClick={() => recordReview(d,'revise')}>Request revision</button>
                </div>
              </div>
            })}
          </div>
          <label>Reviewer notes<textarea rows={3} placeholder="Explain any changes or reasons..." value={feedback} onChange={e=>setFeedback(e.target.value)}/></label>
          <h3>Release readiness</h3>
          {problems.length ? <ul className="studio-issues">{problems.map(p => <li key={p}>{p.replaceAll('_',' ').toLowerCase()}</li>)}</ul> : <p className="studio-good">All prototype quality-gate checks passed.</p>}
          <button className="studio-primary" disabled={problems.length > 0 || song.status==='approved'} onClick={approve}>Approve this version (local preview)</button>
          <p className="studio-muted">Approval cannot publish content. Live permissions, verification and audit logging are not connected yet.</p>
        </div>}
        {view === 'catalog' && <div className="studio-panel">
          <h2>Existing Borao catalog</h2>
          <p className="studio-muted">Read-only snapshot of the actual content_items table. These are not yet Studio agent jobs.</p>
          {catalogError ? <div className="studio-info">Catalog unavailable: {catalogError}</div> : catalog.length ? <div className="studio-catalog">
            {catalog.map(item => <div key={item.id}><strong>{item.title}</strong><span>{item.content_type.replaceAll('_',' ')} · {item.status}</span></div>)}
          </div> : <div className="studio-info">No content items returned for this account.</div>}
        </div>}
        {feedback && view !== 'review' && <p className="studio-muted" role="status">{feedback}</p>}
      </section>
    </div>
  )
}
