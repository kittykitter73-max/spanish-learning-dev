import {
  evaluateCheckpointReadiness,
  type CheckpointRequirement,
} from './readiness'
import {
  evidenceEventsToReadinessObservations,
  type EvidenceEventForReadiness,
} from './readiness-evidence'
import {
  selectCheckpointItems,
  type CheckCandidate,
  type CheckUse,
} from './checkpoint-selector'

export type ReadyCheckPlan = {
  currentStatus: 'ready' | 'needs_more_evidence' | 'technical_issue'
  satisfiedRequirementKeys: string[]
  unresolvedRequirementKeys: string[]
  technicalIssueKeys: string[]
  selectedItems: CheckCandidate[]
  remainingAfterSelection: string[]
}

export function planReadyCheck(input: {
  requirements: CheckpointRequirement[]
  evidenceEvents: EvidenceEventForReadiness[]
  candidates: CheckCandidate[]
  priorUses?: CheckUse[]
  maxItems?: number
}): ReadyCheckPlan {
  const observations = evidenceEventsToReadinessObservations(input.evidenceEvents)
  const readiness = evaluateCheckpointReadiness(input.requirements, observations)

  if (readiness.status === 'ready') {
    return {
      currentStatus: readiness.status,
      satisfiedRequirementKeys: readiness.satisfiedKeys,
      unresolvedRequirementKeys: [],
      technicalIssueKeys: readiness.technicalIssueKeys,
      selectedItems: [],
      remainingAfterSelection: [],
    }
  }

  const requirementByKey = new Map(input.requirements.map(requirement => [requirement.key, requirement]))
  const missing = readiness.unresolvedKeys.flatMap(key => {
    const requirement = requirementByKey.get(key)
    if (!requirement) return []

    return [{
      key,
      conceptId: requirement.conceptId,
      dimension: requirement.dimension,
    }]
  })

  const selection = selectCheckpointItems({
    requirements: missing,
    candidates: input.candidates,
    priorUses: input.priorUses,
    maxItems: input.maxItems,
  })

  return {
    currentStatus: readiness.status,
    satisfiedRequirementKeys: readiness.satisfiedKeys,
    unresolvedRequirementKeys: readiness.unresolvedKeys,
    technicalIssueKeys: readiness.technicalIssueKeys,
    selectedItems: selection.selected,
    remainingAfterSelection: selection.unresolvedRequirementKeys,
  }
}
