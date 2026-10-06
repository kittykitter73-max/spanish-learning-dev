export type ReadinessDimension =
  | 'listening'
  | 'generated_use'
  | 'manipulation'
  | 'practical_adjustment'

export type CheckpointRequirement = {
  key: string
  conceptId?: string | null
  dimension: ReadinessDimension
  minSuccesses: number
  maxHintLevel?: number | null
  requireSelfGenerated?: boolean
  requireFresh?: boolean
  distinctContextCount?: number
  required?: boolean
}

export type ReadinessObservation = {
  conceptId?: string | null
  dimension: ReadinessDimension
  success?: boolean | null
  hintLevel?: number
  selfGenerated?: boolean
  fresh?: boolean
  contextKey?: string | null
  technicalIssue?: boolean
}

export type CheckpointReadiness = {
  status: 'ready' | 'needs_more_evidence' | 'technical_issue'
  satisfiedKeys: string[]
  unresolvedKeys: string[]
  technicalIssueKeys: string[]
}

function matchesRequirement(
  requirement: CheckpointRequirement,
  observation: ReadinessObservation,
) {
  if (observation.dimension !== requirement.dimension) return false
  if (requirement.conceptId && observation.conceptId !== requirement.conceptId) return false
  return true
}

function observationQualifies(
  requirement: CheckpointRequirement,
  observation: ReadinessObservation,
) {
  if (observation.technicalIssue) return false
  if (observation.success !== true) return false

  const hintLevel = observation.hintLevel ?? 0
  if (requirement.maxHintLevel != null && hintLevel > requirement.maxHintLevel) return false
  if (requirement.requireSelfGenerated && !observation.selfGenerated) return false
  if (requirement.requireFresh && !observation.fresh) return false

  return true
}

export function evaluateCheckpointReadiness(
  requirements: CheckpointRequirement[],
  observations: ReadinessObservation[],
): CheckpointReadiness {
  const satisfiedKeys: string[] = []
  const unresolvedKeys: string[] = []
  const technicalIssueKeys: string[] = []

  for (const requirement of requirements.filter(r => r.required !== false)) {
    const matching = observations.filter(o => matchesRequirement(requirement, o))
    const valid = matching.filter(o => observationQualifies(requirement, o))

    const successCount = valid.length
    const distinctContexts = new Set(
      valid
        .map(o => o.contextKey)
        .filter((value): value is string => Boolean(value)),
    ).size

    const enoughSuccesses = successCount >= Math.max(1, requirement.minSuccesses)
    const enoughContexts =
      !requirement.distinctContextCount ||
      distinctContexts >= requirement.distinctContextCount

    if (enoughSuccesses && enoughContexts) {
      satisfiedKeys.push(requirement.key)
      continue
    }

    unresolvedKeys.push(requirement.key)

    const hadTechnicalIssue = matching.some(o => o.technicalIssue)
    const hadScorableObservation = matching.some(o => !o.technicalIssue)
    if (hadTechnicalIssue && !hadScorableObservation) {
      technicalIssueKeys.push(requirement.key)
    }
  }

  if (unresolvedKeys.length === 0) {
    return {
      status: 'ready',
      satisfiedKeys,
      unresolvedKeys,
      technicalIssueKeys,
    }
  }

  const onlyTechnical =
    technicalIssueKeys.length > 0 &&
    technicalIssueKeys.length === unresolvedKeys.length

  return {
    status: onlyTechnical ? 'technical_issue' : 'needs_more_evidence',
    satisfiedKeys,
    unresolvedKeys,
    technicalIssueKeys,
  }
}
