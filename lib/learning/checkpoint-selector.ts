import type { ReadinessDimension } from './readiness'

export type ServerCheckDimension =
  | 'listening_comprehension'
  | 'elicited_production'
  | 'manipulation'
  | 'practical_adjustment'

export type CheckCandidate = {
  itemId: string
  itemFamily: string
  conceptIds: string[]
  dimension: ServerCheckDimension
  pool?: string | null
  contextId?: string | null
  approvalStatus: 'draft' | 'qa' | 'approved' | 'published' | 'retired'
  audioReady?: boolean
  semanticAnswerKey?: string | null
}

export type CheckUse = {
  itemId: string
  itemFamily?: string | null
  semanticAnswerKey?: string | null
  contextId?: string | null
  answerRevealed?: boolean
}

export type MissingRequirement = {
  key: string
  conceptId?: string | null
  dimension: ReadinessDimension
}

export type CheckSelection = {
  selected: CheckCandidate[]
  unresolvedRequirementKeys: string[]
}

const dimensionMap: Record<ReadinessDimension, ServerCheckDimension> = {
  listening: 'listening_comprehension',
  generated_use: 'elicited_production',
  manipulation: 'manipulation',
  practical_adjustment: 'practical_adjustment',
}

const executionOrder: ServerCheckDimension[] = [
  'elicited_production',
  'listening_comprehension',
  'manipulation',
  'practical_adjustment',
]

function approved(candidate: CheckCandidate) {
  return candidate.approvalStatus === 'approved' || candidate.approvalStatus === 'published'
}

function candidateMatches(candidate: CheckCandidate, requirement: MissingRequirement) {
  if (candidate.dimension !== dimensionMap[requirement.dimension]) return false
  if (requirement.conceptId && !candidate.conceptIds.includes(requirement.conceptId)) return false
  if (requirement.dimension === 'listening' && candidate.audioReady !== true) return false
  return true
}

function isPrimed(candidate: CheckCandidate, uses: CheckUse[], chosen: CheckCandidate[]) {
  const combinedUses: CheckUse[] = [
    ...uses,
    ...chosen.map(item => ({
      itemId: item.itemId,
      itemFamily: item.itemFamily,
      semanticAnswerKey: item.semanticAnswerKey,
      contextId: item.contextId,
      answerRevealed: false,
    })),
  ]

  return combinedUses.some(use => {
    if (use.itemId === candidate.itemId) return true

    if (
      use.answerRevealed &&
      use.semanticAnswerKey &&
      candidate.semanticAnswerKey &&
      use.semanticAnswerKey === candidate.semanticAnswerKey
    ) return true

    return false
  })
}

function createsSameAttemptAnswerPriming(
  candidate: CheckCandidate,
  chosen: CheckCandidate[],
) {
  if (!candidate.semanticAnswerKey) return false

  return chosen.some(existing => {
    if (!existing.semanticAnswerKey) return false
    if (existing.semanticAnswerKey !== candidate.semanticAnswerKey) return false

    const productionListeningPair =
      (existing.dimension === 'elicited_production' && candidate.dimension === 'listening_comprehension') ||
      (existing.dimension === 'listening_comprehension' && candidate.dimension === 'elicited_production')

    return productionListeningPair
  })
}

export function selectCheckpointItems(input: {
  requirements: MissingRequirement[]
  candidates: CheckCandidate[]
  priorUses?: CheckUse[]
  maxItems?: number
}): CheckSelection {
  const priorUses = input.priorUses ?? []
  const maxItems = Math.max(1, input.maxItems ?? 6)
  const selected: CheckCandidate[] = []
  const unresolved = new Set(input.requirements.map(r => r.key))

  const requirements = [...input.requirements].sort((a, b) => {
    return executionOrder.indexOf(dimensionMap[a.dimension]) -
      executionOrder.indexOf(dimensionMap[b.dimension])
  })

  for (const requirement of requirements) {
    if (selected.length >= maxItems) break

    const candidate = input.candidates.find(item => {
      if (!approved(item)) return false
      if (!candidateMatches(item, requirement)) return false
      if (selected.some(chosen => chosen.itemId === item.itemId)) return false
      if (isPrimed(item, priorUses, selected)) return false
      if (createsSameAttemptAnswerPriming(item, selected)) return false
      return true
    })

    if (!candidate) continue

    selected.push(candidate)
    unresolved.delete(requirement.key)
  }

  return {
    selected,
    unresolvedRequirementKeys: [...unresolved],
  }
}
