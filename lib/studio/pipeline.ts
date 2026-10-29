/**
 * Borao Studio pilot: dependency-free content quality gate.
 * No learner writes, AI calls, paid generation or publication side effects.
 * Curriculum IDs must be resolved against canonical concept records by the caller.
 */
export type StudioStatus =
  | 'queued' | 'drafting' | 'language_review' | 'pedagogy_review'
  | 'creative_review' | 'needs_revision' | 'awaiting_founder'
  | 'approved' | 'published'

export type ReviewDimension = 'language' | 'pedagogy' | 'creative'
export type ReviewVerdict = 'pass' | 'revise'

export interface StudioReview {
  dimension: ReviewDimension
  verdict: ReviewVerdict
  reasonCodes: string[]
  notes: string
  reviewedVersion: number
}

export interface SongPackage {
  id: string
  version: number
  status: StudioStatus
  conceptIds: string[]
  objective: string
  lyrics: string
  hooks: string[]
  musicPrompt: string
  exercises: Array<{
    kind: 'dialogue' | 'listening' | 'recall' | 'production' | 'transfer'
    prompt: string
    expectedConceptIds: string[]
  }>
  reviews: StudioReview[]
  founderApprovedVersion?: number
}

const reviewDimensions: ReviewDimension[] = ['language', 'pedagogy', 'creative']

export function assessSongPackage(song: SongPackage): string[] {
  const problems: string[] = []
  if (!song.id.trim()) problems.push('MISSING_ID')
  if (!Number.isSafeInteger(song.version) || song.version < 1) problems.push('INVALID_VERSION')
  if (!song.objective.trim()) problems.push('MISSING_OBJECTIVE')
  if (!song.conceptIds.length || new Set(song.conceptIds).size !== song.conceptIds.length) problems.push('INVALID_CONCEPT_TARGETS')
  if (!song.lyrics.trim()) problems.push('MISSING_LYRICS')
  if (!song.hooks.length || song.hooks.some(h => !h.trim())) problems.push('MISSING_HOOKS')
  if (!song.musicPrompt.trim() || song.musicPrompt.length > 900) problems.push('INVALID_MUSIC_PROMPT')
  if (!song.exercises.some(e => e.kind === 'dialogue' && e.prompt.trim())) problems.push('MISSING_SPOKEN_COMPANION')
  if (!song.exercises.some(e => e.kind === 'listening' && e.prompt.trim())) problems.push('MISSING_LISTENING_ACTIVITY')
  if (!song.exercises.some(e => e.kind === 'transfer' && e.prompt.trim())) problems.push('MISSING_UNAIDED_TRANSFER')
  if (!song.exercises.some(e => e.kind === 'recall' || e.kind === 'production' || e.kind === 'transfer')) {
    problems.push('NO_ACTIVE_RETRIEVAL')
  }
  for (const exercise of song.exercises) {
    if (!exercise.prompt.trim() || exercise.expectedConceptIds.some(id => !song.conceptIds.includes(id))) {
      problems.push('INVALID_EXERCISE_MAPPING')
      break
    }
  }
  for (const dimension of reviewDimensions) {
    const passes = song.reviews.filter(r =>
      r.dimension === dimension &&
      r.reviewedVersion === song.version &&
      r.verdict === 'pass'
    )
    if (!passes.length) problems.push('MISSING_CURRENT_' + dimension.toUpperCase() + '_PASS')
    if (song.reviews.some(r =>
      r.dimension === dimension &&
      r.reviewedVersion === song.version &&
      r.verdict === 'revise'
    )) problems.push('UNRESOLVED_' + dimension.toUpperCase() + '_REVISION')
  }
  return [...new Set(problems)]
}

/** Model reviewers cannot promote content; founder approval is separate. */
export function canMoveToFounderReview(song: SongPackage): boolean {
  return assessSongPackage(song).length === 0
}

/** Publication requires an explicit founder signoff on the exact reviewed version. */
export function canPublish(song: SongPackage): boolean {
  return song.status === 'approved' &&
    song.founderApprovedVersion === song.version &&
    canMoveToFounderReview(song)
}

/**
 * Versions isolate revisions from stale approvals. Callers must persist
 * state changes with server-side authorization + audit and check expected version.
 */
export function nextDraftVersion(song: SongPackage): SongPackage {
  return {
    ...song,
    version: song.version + 1,
    status: 'drafting',
    founderApprovedVersion: undefined,
    reviews: [],
  }
}
