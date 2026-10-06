export type AccessRule =
  | 'immediate'
  | 'unit_ready'
  | 'unit_complete'
  | 'path_complete'
  | 'manual'

export type UnitState = 'locked' | 'available' | 'active' | 'checkpoint_ready' | 'completed'
export type PathState = 'locked' | 'available' | 'active' | 'completed'

export type AccessContext = {
  unitStates: Map<string, UnitState>
  pathStates: Map<string, PathState>
  directUnlockedContentIds: Set<string>
  unlockedCollectionIds: Set<string>
  unlockedGameIds: Set<string>
}

export type AccessSubject = {
  accessRule: AccessRule
  requiredUnitId?: string | null
  requiredPathId?: string | null
  contentItemId?: string | null
  collectionId?: string | null
  gameId?: string | null
}

export function isAccessSatisfied(subject: AccessSubject, context: AccessContext) {
  if (
    (subject.contentItemId && context.directUnlockedContentIds.has(subject.contentItemId)) ||
    (subject.collectionId && context.unlockedCollectionIds.has(subject.collectionId)) ||
    (subject.gameId && context.unlockedGameIds.has(subject.gameId))
  ) {
    return true
  }

  switch (subject.accessRule) {
    case 'immediate':
      return true
    case 'unit_ready': {
      if (!subject.requiredUnitId) return false
      const state = context.unitStates.get(subject.requiredUnitId)
      return state === 'available' || state === 'active' || state === 'checkpoint_ready' || state === 'completed'
    }
    case 'unit_complete':
      return Boolean(
        subject.requiredUnitId &&
        context.unitStates.get(subject.requiredUnitId) === 'completed'
      )
    case 'path_complete':
      return Boolean(
        subject.requiredPathId &&
        context.pathStates.get(subject.requiredPathId) === 'completed'
      )
    case 'manual':
      return false
  }
}

export function collectionAccessSummary(
  items: AccessSubject[],
  context: AccessContext,
) {
  const total = items.length
  const unlocked = items.filter(item => isAccessSatisfied(item, context)).length
  return {
    total,
    unlocked,
    complete: total > 0 && unlocked === total,
    empty: total === 0,
  }
}
