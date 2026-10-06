import type { ReadinessObservation } from './readiness'

export type EvidenceEventForReadiness = {
  concept_id: string
  evidence_type:
    | 'exposure'
    | 'recognition'
    | 'meaning_recall'
    | 'listening_comprehension'
    | 'manipulation'
    | 'guided_production'
    | 'independent_production'
    | 'spontaneous_transfer'
  success: boolean | null
  hint_level?: number | null
  self_generated?: boolean | null
  prompt_familiarity?: string | null
  context_novelty?: string | null
  occurred_at: string
  metadata?: Record<string, unknown> | null
}

function metadataString(metadata: Record<string, unknown> | null | undefined, key: string) {
  const value = metadata?.[key]
  return typeof value === 'string' ? value : null
}

function metadataBoolean(metadata: Record<string, unknown> | null | undefined, key: string) {
  const value = metadata?.[key]
  return typeof value === 'boolean' ? value : false
}

function dimensionForEvent(event: EvidenceEventForReadiness): ReadinessObservation['dimension'] | null {
  if (event.evidence_type === 'listening_comprehension') return 'listening'
  if (event.evidence_type === 'manipulation') return 'manipulation'
  if (
    event.evidence_type === 'guided_production' ||
    event.evidence_type === 'independent_production'
  ) return 'generated_use'
  if (event.evidence_type === 'spontaneous_transfer') return 'practical_adjustment'
  return null
}

export function evidenceEventsToReadinessObservations(
  events: EvidenceEventForReadiness[],
): ReadinessObservation[] {
  return events.flatMap(event => {
    const dimension = dimensionForEvent(event)
    if (!dimension) return []

    const revealed =
      metadataBoolean(event.metadata, 'answer_revealed') ||
      metadataBoolean(event.metadata, 'model_played_before_response') ||
      metadataBoolean(event.metadata, 'transcript_before_response') ||
      metadataBoolean(event.metadata, 'choices_before_response')

    const explicitlyFresh =
      event.context_novelty === 'novel' ||
      metadataBoolean(event.metadata, 'fresh') ||
      metadataBoolean(event.metadata, 'held_out')

    const technicalIssue =
      metadataBoolean(event.metadata, 'technical_issue') ||
      metadataBoolean(event.metadata, 'playback_failed') ||
      metadataBoolean(event.metadata, 'asr_unscored')

    return [{
      conceptId: event.concept_id,
      dimension,
      success: event.success,
      hintLevel: event.hint_level ?? 0,
      selfGenerated: Boolean(event.self_generated),
      fresh: explicitlyFresh && !revealed,
      contextKey:
        metadataString(event.metadata, 'context_id') ??
        metadataString(event.metadata, 'item_family') ??
        event.evidence_type + ':' + event.occurred_at,
      technicalIssue,
    }]
  })
}
