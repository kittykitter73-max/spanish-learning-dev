import type { EvidenceType } from './evidence'

export type AssessmentOption = { key: string; label: string }

export type AssessmentItem = {
  id: string
  slug: string
  concept_id: string
  prompt: string
  item_type: 'multiple_choice' | 'typed_response'
  evidence_type: Exclude<EvidenceType, 'exposure'>
  options: AssessmentOption[]
  scoring_strategy: 'choice_key' | 'exact_text' | 'prefix_known_infinitive'
  scoring_rules: Record<string, unknown>
  hint_level: number
  sequence_number: number
  stage_label?: string | null
  support_text?: string | null
  success_feedback?: string | null
  failure_feedback?: string | null
}

function normalize(value: string) {
  return value
    .trim()
    .toLocaleLowerCase('es')
    .normalize('NFC')
    .replace(/^[.!?¡¿]+|[.!?¡¿]+$/g, '')
    .replace(/\s+/g, ' ')
}

export function scoreAssessment(item: AssessmentItem, rawResponse: string) {
  const response = normalize(rawResponse)
  if (!response) return { success: false, normalizedResponse: response }

  if (item.scoring_strategy === 'choice_key') {
    const accepted = Array.isArray(item.scoring_rules.accepted_keys)
      ? item.scoring_rules.accepted_keys.map(String)
      : []
    return { success: accepted.includes(response), normalizedResponse: response }
  }

  if (item.scoring_strategy === 'exact_text') {
    const accepted = Array.isArray(item.scoring_rules.accepted_answers)
      ? item.scoring_rules.accepted_answers.map(value => normalize(String(value)))
      : []
    return { success: accepted.includes(response), normalizedResponse: response }
  }

  const prefix = normalize(String(item.scoring_rules.prefix ?? ''))
  const infinitives = Array.isArray(item.scoring_rules.known_infinitives)
    ? item.scoring_rules.known_infinitives.map(value => normalize(String(value)))
    : []
  const remainder = response.startsWith(`${prefix} `) ? response.slice(prefix.length + 1) : ''
  const firstWord = remainder.split(' ')[0]
  return {
    success: Boolean(prefix && firstWord && infinitives.includes(firstWord)),
    normalizedResponse: response,
  }
}


export type LearnerAssessmentItem = Pick<
  AssessmentItem,
  | 'id'
  | 'prompt'
  | 'item_type'
  | 'evidence_type'
  | 'options'
  | 'hint_level'
  | 'sequence_number'
  | 'stage_label'
  | 'support_text'
  | 'success_feedback'
  | 'failure_feedback'
>
