/** Read-only overview of Studio jobs.
 * This derives display status from persisted version-scoped records. It never approves,
 * publishes, generates, or writes data. A visible "complete" package is not a QA pass.
 */
export type ProductionExercise = {
  kind: string
  prompt: string
  expectedConceptIds?: string[]
}
export type ProductionVersion = {
  lyrics: string
  hooks: string[]
  music_prompt: string
  exercises: ProductionExercise[]
}
export type ProductionReview = {
  dimension: string
  verdict: string
  version: number
}
export type ProductionJob = {
  current_version: number
  status: string
}
export interface ProductionOverview {
  phase: 'content_blocked' | 'revision_required' | 'in_review' |
    'founder_queue' | 'approved' | 'data_unavailable'
  blockers: string[]
  passedReviews: number
  missingReviews: string[]
}
const dimensions = ['language','pedagogy','creative'] as const

export function analyzeProductionJob(
  job: ProductionJob,
  version: ProductionVersion | null,
  reviews: ProductionReview[],
  approvedVersion?: number
): ProductionOverview {
  if (!version) return { phase:'data_unavailable', blockers:['Saved version unavailable'], passedReviews:0, missingReviews:[...dimensions] }
  const blockers: string[] = []
  if (!version.lyrics?.trim()) blockers.push('Lyrics missing')
  if (!Array.isArray(version.hooks) || version.hooks.length < 2 ||
    version.hooks.some(h => !h?.trim())) blockers.push('Two completed hooks required')
  if (!version.music_prompt?.trim() || version.music_prompt.length > 900) blockers.push('Production prompt missing or over limit')
  const exercises = Array.isArray(version.exercises) ? version.exercises : []
  for (const [kind, label] of [
    ['dialogue','Spoken dialogue missing'],
    ['listening','Listening activity missing'],
    ['transfer','Unaided transfer activity missing'],
  ] as const) {
    if (!exercises.some(x => x.kind === kind && x.prompt?.trim())) blockers.push(label)
  }
  if (exercises.some(x=>!x.prompt?.trim())) blockers.push('Incomplete exercise instructions')
  const current = reviews.filter(r => r.version === job.current_version)
  const missingReviews = dimensions.filter(d =>
    !current.some(r=>r.dimension===d && r.verdict==='pass'))
  const passedReviews = dimensions.length - missingReviews.length
  const revisionRequired = job.status === 'needs_revision' || current.some(r=>r.verdict==='revise')
  if (job.status === 'approved' && approvedVersion === job.current_version &&
    blockers.length===0 && missingReviews.length===0 && !revisionRequired) {
    return {phase:'approved',blockers,passedReviews,missingReviews}
  }
  if (revisionRequired) return {phase:'revision_required',blockers:[...blockers,'New revision required'],passedReviews,missingReviews}
  if (blockers.length) return {phase:'content_blocked',blockers,passedReviews,missingReviews}
  if (missingReviews.length) return {phase:'in_review',blockers,passedReviews,missingReviews}
  return {phase:'founder_queue',blockers,passedReviews,missingReviews}
}
