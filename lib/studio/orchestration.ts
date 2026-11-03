/** Provider-neutral orchestration contract. This module makes no network calls. */
export type StudioStage = 'song_draft' | 'language_review' | 'pedagogy_review' | 'creative_review' | 'companion_dialogue' | 'exercise_pack'
export type GenerationStatus = 'queued' | 'running' | 'completed' | 'failed' | 'canceled'
export type ProviderAdapter = {
  provider: string
  generate(input: Readonly<{ stage: StudioStage; objective: string; conceptIds: string[]; version: number }>): Promise<{ text: string; tokensUsed?: number }>
}
export type WorkItem = { jobId: string; version: number; stage: StudioStage; idempotencyKey: string }
export type GenerationGate = { enabled: boolean; maximumCalls: number; permittedStages: readonly StudioStage[] }
/** Never run a paid adapter unless an authorized server-side gate explicitly enables it. */
export function canDispatch(item: WorkItem, gate: GenerationGate, callsAlreadyMade: number): boolean {
  return gate.enabled === true && Number.isInteger(item.version) && item.version > 0 &&
    Boolean(item.jobId) && Boolean(item.idempotencyKey) &&
    Number.isInteger(gate.maximumCalls) && callsAlreadyMade >= 0 &&
    callsAlreadyMade < gate.maximumCalls && gate.permittedStages.includes(item.stage)
}
export const DEFAULT_GENERATION_GATE: GenerationGate = Object.freeze({
  enabled: false, maximumCalls: 0, permittedStages: [],
})
