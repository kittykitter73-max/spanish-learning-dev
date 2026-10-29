'use client'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { assessSongPackage, nextDraftVersion, type SongPackage, type ReviewDimension, type StudioReview } from '@/lib/studio/pipeline'
import './studio.css'

type CatalogItem = { id: string; title: string; content_type: string; status: string }
type SavedJob = { id: string; title: string; objective: string; current_version: number; status: string; updated_at: string }
type SavedVersion = { job_id: string; version: number; lyrics: string; hooks: string[]; music_prompt: string; exercises: SongPackage['exercises'] }
type StudioExercise = SongPackage['exercises'][number]
const exerciseTypes: StudioExercise['kind'][] = ['dialogue','listening','recall','production','transfer']
const exerciseLabels: Record<StudioExercise['kind'],string> = {
  dialogue: 'Spoken companion dialogue', listening: 'Listening comprehension',
  recall: 'Unprompted recall', production: 'Speaking practice', transfer: 'Novel situation transfer'
}
type CurriculumConcept = { id: string; canonical_spanish: string; canonical_english: string | null; communicative_function: string | null; status: string }
const initial: SongPackage = {
  id: 'arc-1-song-candidate', version: 1, status: 'drafting',
  conceptIds: [], objective: 'Ask for what you want in an everyday conversation',
  lyrics: '', hooks: ['', ''], musicPrompt: '',
  exercises: [
    { kind: 'dialogue', prompt: '', expectedConceptIds: [] },
    { kind: 'listening', prompt: '', expectedConceptIds: [] },
    { kind: 'recall', prompt: '', expectedConceptIds: [] },
    { kind: 'transfer', prompt: '', expectedConceptIds: [] },
  ],
  reviews: []
}
const dimensions: ReviewDimension[] = ['language', 'pedagogy', 'creative']
const labels: Record<ReviewDimension, string> = {
  language: 'Spanish & naturalness', pedagogy: 'Learning & retrieval', creative: 'Hook & replay value'
}

export default function StudioWorkbench({ studioRole, catalog, catalogError, concepts, conceptError }: { studioRole: string; catalog: CatalogItem[]; catalogError: string | null; concepts: CurriculumConcept[]; conceptError: string | null }) {
  const [song, setSong] = useState<SongPackage>(initial)
  const editCounter = useRef(0)
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [jobFilter, setJobFilter] = useState<'all'|'blocked'|'ready'>('all')
  const [jobsError, setJobsError] = useState('')
  const [jobSummaries, setJobSummaries] = useState<Record<string,string[]>>({})
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [loadingJob, setLoadingJob] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [reviewBusy, setReviewBusy] = useState(false)
  const [reviewNotice, setReviewNotice] = useState('')
  const [persisted, setPersisted] = useState<{ id: string; version: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [view, setView] = useState<'draft'|'review'|'catalog'>('draft')
  const problems = assessSongPackage(song)
  const loadJobs = async () => {
    setLoadingJobs(true)
    setJobsError('')
    const { data, error } = await createClient().from('studio_song_jobs')
      .select('id,title,objective,current_version,status,updated_at')
      .order('updated_at', { ascending: false }).limit(40)
    setLoadingJobs(false)
    if (error) setJobsError('Could not load saved jobs: ' + error.message)
    else {
      const jobs = (data ?? []) as SavedJob[]
      setSavedJobs(jobs)
      const client = createClient()
      const versions = await Promise.all(jobs.map(j => client.from('studio_song_versions').select('lyrics,hooks,music_prompt,exercises').eq('job_id',j.id).eq('version',j.current_version).maybeSingle()))
      const summaries: Record<string,string[]> = {}
      jobs.forEach((j,i) => {
        const v = versions[i]?.data
        if (!v) { summaries[j.id]=['Version unavailable or access denied']; return }
        const ex = Array.isArray(v.exercises) ? v.exercises as SongPackage['exercises'] : []
        const gaps = []
        if (!String(v.lyrics??'').trim()) gaps.push('Lyrics missing')
        if (!Array.isArray(v.hooks) || v.hooks.length<2) gaps.push('Alternative hooks missing')
        if (!String(v.music_prompt??'').trim()) gaps.push('Production direction missing')
        if (!ex.some(x=>x.kind==='dialogue' && x.prompt?.trim())) gaps.push('Dialogue missing')
        if (!ex.some(x=>x.kind==='listening' && x.prompt?.trim())) gaps.push('Listening task missing')
        if (!ex.some(x=>x.kind==='transfer' && x.prompt?.trim())) gaps.push('Transfer task missing')
        summaries[j.id]=gaps
      })
      setJobSummaries(summaries)
    }
  }
  const openJob = async (job: SavedJob) => {
    if (saving || loadingJob) return
    if (dirty && !window.confirm('Discard unsaved changes and open this saved version?')) return
    setLoadingJob(true)
    setSaveMessage('')
    const client = createClient()
    const [versionResult, targetsResult] = await Promise.all([
      client.from('studio_song_versions').select('job_id,version,lyrics,hooks,music_prompt,exercises')
        .eq('job_id', job.id).eq('version', job.current_version).single(),
      client.from('studio_song_job_concepts').select('concept_id').eq('job_id', job.id),
    ])
    setLoadingJob(false)
    if (versionResult.error || targetsResult.error || !versionResult.data) {
      setSaveMessage('Unable to open saved job. Your draft was not changed.')
      return
    }
    const record = versionResult.data as SavedVersion
    const conceptIds = (targetsResult.data ?? []).map(x => x.concept_id)
    setSong({
      id: job.id, version: record.version, status: 'drafting',
      conceptIds, objective: job.objective, lyrics: record.lyrics,
      hooks: Array.isArray(record.hooks) ? record.hooks : ['', ''],
      musicPrompt: record.music_prompt,
      exercises: Array.isArray(record.exercises) ? record.exercises : [],
      reviews: [],
    })
    setPersisted({ id: job.id, version: record.version })
    editCounter.current += 1
    setDirty(false)
    setView('draft')
    setSaveMessage('Opened saved version ' + record.version + '.')
    void refreshReviews(job.id, record.version)
  }
  const saveDraft = async () => {
    if (saving || loadingJob) return
    setSaving(true)
    const startingEdit = editCounter.current
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
      const editedDuringSave = startingEdit !== editCounter.current
      setDirty(editedDuringSave)
      setSaveMessage(editedDuringSave
        ? 'Version ' + record.version + ' saved, but you edited during the request. Save again to retain your newest edits.'
        : 'Draft saved to Borao Studio as version ' + record.version + '.')
      void loadJobs()
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
    editCounter.current += 1
    setDirty(true)
    setSong(prev => {
      const next = prev.reviews.length || prev.founderApprovedVersion !== undefined || prev.status === 'approved' ? nextDraftVersion(prev) : prev
      return { ...next, ...changes }
    })
    setFeedback('Unsaved changes. Any previous local review approvals were reset.')
  }
  const recordReview = async (dimension: ReviewDimension, verdict: 'pass'|'revise') => {
    if (studioRole === 'founder' && persisted) {
      setReviewNotice('Solo founder mode: self-reviews cannot count as independent approval. Record editorial notes; independent checks require separate authorized reviewers.')
      return
    }
    if (!persisted || dirty || reviewBusy) {
      setReviewNotice('Save the latest draft to the database before recording a review.')
      return
    }
    const notes = feedback.trim()
    if (notes.length < 3) { setReviewNotice('Add reviewer notes (at least 3 characters).'); return }
    setReviewBusy(true)
    const result = await createClient().rpc('studio_record_review', {
      p_job_id: persisted.id, p_expected_version: persisted.version,
      p_dimension: dimension, p_verdict: verdict, p_notes: notes,
    })
    setReviewBusy(false)
    if (result.error) { setReviewNotice('Review not saved: ' + result.error.message); return }
    setReviewNotice('Review recorded for version ' + persisted.version + '.')
    setFeedback('')
    await refreshReviews(persisted.id, persisted.version)
  }
  const refreshReviews = async (jobId: string, version: number) => {
    const client = createClient()
    const [reviewResult, approvalResult, jobResult] = await Promise.all([
      client.from('studio_song_reviews').select('dimension,verdict,notes,version').eq('job_id',jobId).eq('version',version),
      client.from('studio_song_approvals').select('version').eq('job_id',jobId).eq('version',version).maybeSingle(),
      client.from('studio_song_jobs').select('status').eq('id',jobId).single(),
    ])
    if (reviewResult.error || approvalResult.error || jobResult.error) {
      setReviewNotice('Review refresh failed; verify this version before continuing.')
      return
    }
    const reviews: StudioReview[] = (reviewResult.data ?? []).map(r=>({
      dimension: r.dimension as ReviewDimension, verdict: r.verdict as 'pass'|'revise',
      reasonCodes: [], notes: r.notes, reviewedVersion: r.version,
    }))
    setSong(prev=>prev.id===jobId && prev.version===version
      ? {...prev, reviews, status: (jobResult.data?.status ?? 'drafting') as SongPackage['status'],
         founderApprovedVersion: approvalResult.data?.version}
      : prev)
  }
  const approve = async () => {
    if (!persisted || dirty || problems.length || reviewBusy) {
      setReviewNotice('Save and complete three current independent reviewer passes before approval.')
      return
    }
    setReviewBusy(true)
    const result = await createClient().rpc('studio_approve_song', {
      p_job_id: persisted.id, p_expected_version: persisted.version,
    })
    setReviewBusy(false)
    if (result.error) { setReviewNotice('Approval rejected: ' + result.error.message); return }
    setReviewNotice('Founder approval saved for version '+persisted.version+'. Nothing was published.')
    await refreshReviews(persisted.id,persisted.version)
  }
  return (
    <div className="studio-content">
      <aside className="studio-side">
        <div className="studio-side-title">PRODUCTION</div>
        <button className={view === 'draft' ? 'studio-side-active' : ''} onClick={() => setView('draft')}>01 <span>Song editor</span></button>
        <button className={view === 'review' ? 'studio-side-active' : ''} onClick={() => setView('review')}>02 <span>Quality review</span></button>
        <button className={view === 'catalog' ? 'studio-side-active' : ''} onClick={() => setView('catalog')}>03 <span>Saved jobs & catalog</span></button>
        <div className="studio-side-note">Drafts can be saved and reopened by authorized Studio accounts. Reviews use server-side records. Publication remains disabled.</div>
      </aside>
      <section className="studio-main">
        <div className="studio-step">
          <span>ARC 01 / STUDIO PILOT</span>
          <span className="studio-status">{song.status.replaceAll('_', ' ')} · V{song.version}</span>
        </div>
        {view === 'draft' && <div className="studio-panel">
          <div className="studio-save-state" role="status">{persisted ? 'Saved job ' + persisted.id.slice(0,8) + ' · v' + persisted.version : 'New unsaved job'}{dirty ? ' · Unsaved edits' : ''}</div>
          <button disabled={saving || loadingJob} onClick={() => {
            if (dirty && !window.confirm('Discard unsaved changes and start a new song?')) return
            setSong({...initial, conceptIds:[], reviews:[]})
            setPersisted(null)
            setDirty(false)
            editCounter.current += 1
            setSaveMessage('')
          }}>+ New song</button>
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
          <div className="studio-info">Build the whole learning package around the selected concepts. The spoken dialogue is a script, not validated audio. The final transfer challenge must work without lyrics or a word bank.</div>
          <div className="studio-learning-pack">
            <h3>Companion learning content</h3>
            {song.exercises.map((exercise, i) => <div className="studio-exercise" key={i}>
              <label>{exerciseLabels[exercise.kind]}
                <select value={exercise.kind} onChange={e => {
                  const kind = e.target.value as StudioExercise['kind']
                  updateDraft({ exercises: song.exercises.map((item, j) => j === i ? { ...item, kind } : item) })
                }}>
                  {exerciseTypes.map(kind => <option value={kind} key={kind}>{exerciseLabels[kind]}</option>)}
                </select>
              </label>
              <label>{exercise.kind === 'dialogue' ? 'Conversation script' : 'Exercise and learner instructions'}
                <textarea rows={exercise.kind === 'dialogue' ? 7 : 3}
                  placeholder={exercise.kind === 'dialogue' ? 'Vale: ¿Ya bajas?\nNico: Ya voy...' : 'Enter the exact learner-facing task...'}
                  value={exercise.prompt}
                  onChange={e => updateDraft({ exercises: song.exercises.map((item,j) => j === i ? { ...item,prompt:e.target.value } : item) })}/>
              </label>
              <button type="button" onClick={() => updateDraft({ exercises: song.exercises.filter((_,j) => j!==i) })}>Remove activity</button>
            </div>)}
            <button type="button" onClick={() => updateDraft({ exercises: [...song.exercises, {
              kind: 'production', prompt: '', expectedConceptIds: [...song.conceptIds]
            }] })}>+ Add activity</button>
          </div>
          <button className="studio-primary" onClick={saveDraft} disabled={saving || loadingJob || !song.conceptIds.length || !song.objective.trim() || song.musicPrompt.length > 900}>{saving ? 'Saving…' : persisted ? 'Save revised version' : 'Save first draft'}</button>
          {saveMessage && <p role="status" className="studio-muted">{saveMessage}</p>}
          <button onClick={() => setView('review')}>Go to quality review →</button>
        </div>}
        {view === 'review' && <div className="studio-panel">
          {reviewNotice && <p role="status" className="studio-info">{reviewNotice}</p>}
          <h2>Quality before quantity.</h2>
          {studioRole === 'founder' && <p className="studio-info">Solo founder pilot: you can draft, but cannot self-certify three independent reviews. Approval stays blocked until separate qualified reviewers assess the exact version.</p>}
          <p className="studio-muted">Reviews now submit to the database and are bound to the saved version. Each dimension requires a distinct human reviewer. A creator cannot sign off on their own draft.</p>
          <div className="studio-reviews">
            {dimensions.map(d => {
              const review = song.reviews.find(r=>r.dimension===d && r.reviewedVersion===song.version)
              return <div className="studio-review" key={d}>
                <div><strong>{labels[d]}</strong><span>{review ? review.verdict : 'Needs review'}</span></div>
                <div className="studio-actions">
                  <button disabled={reviewBusy || dirty || !persisted || studioRole === 'founder'} onClick={() => void recordReview(d,'pass')}>Mark pass</button>
                  <button disabled={reviewBusy || dirty || !persisted} onClick={() => void recordReview(d,'revise')}>Request revision</button>
                </div>
              </div>
            })}
          </div>
          <label>Reviewer notes<textarea rows={3} placeholder="Explain any changes or reasons..." value={feedback} onChange={e=>setFeedback(e.target.value)}/></label>
          <h3>Release readiness</h3>
          {problems.length ? <ul className="studio-issues">{problems.map(p => <li key={p}>{p.replaceAll('_',' ').toLowerCase()}</li>)}</ul> : <p className="studio-good">All prototype quality-gate checks passed.</p>}
          <button className="studio-primary" disabled={problems.length > 0 || song.status==='approved'} onClick={() => void approve()}>Approve this version (founder only)</button>
          <p className="studio-muted">Approval is persisted but does not publish content. A distinct founder account and independent reviewers are required.</p>
        </div>}
        {view === 'catalog' && <div className="studio-panel">
          <h2>Saved Studio jobs</h2>
          <p className="studio-muted">Open the latest saved draft. Edits and reviews not saved to Supabase will not return after refresh.</p>
          <button disabled={loadingJobs} onClick={loadJobs}>{loadingJobs ? 'Loading…' : 'Refresh saved jobs'}</button>
          {jobsError && <p role="alert" className="studio-info">{jobsError}</p>}
          <div className="studio-job-summary"><strong>{savedJobs.length} projects</strong><span>{savedJobs.filter(j => (jobSummaries[j.id] ?? ['Not checked']).length > 0).length} content-blocked</span><span>{savedJobs.filter(j => (jobSummaries[j.id] ?? ['Not checked']).length === 0).length} content-complete (review not verified)</span></div>
          <label>Production filter <select value={jobFilter} onChange={e=>setJobFilter(e.target.value as typeof jobFilter)}><option value="all">All jobs</option><option value="blocked">Missing learning content</option><option value="ready">Content complete (not necessarily approved)</option></select></label>
          <div className="studio-saved-list">{savedJobs.length ? savedJobs.filter(j => jobFilter==='all' || (jobSummaries[j.id]??['Not checked']).length === (jobFilter==='ready'?0:(jobSummaries[j.id]??['Not checked']).length) && (jobFilter!=='blocked' || (jobSummaries[j.id]??['Not checked']).length>0)).map(job =>
            <button key={job.id} disabled={loadingJob || saving} onClick={() => openJob(job)}>
              <strong>{job.title}</strong><span>v{job.current_version} · {job.status} · {new Date(job.updated_at).toLocaleDateString()} · {(jobSummaries[job.id]??[]).length ? (jobSummaries[job.id]??[]).join(', ') : 'Content checklist complete (reviews not verified)'}</span>
            </button>) : <p className="studio-muted">Click Refresh saved jobs to view persisted drafts.</p>}</div>
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
