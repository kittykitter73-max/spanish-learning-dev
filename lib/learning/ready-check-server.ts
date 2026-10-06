import 'server-only'

import assessmentPackage from '@/content/core/arc-01/assessment.server.json'
import { planReadyCheck, type ReadyCheckPlan } from '@/lib/learning/ready-check-planner'
import type { CheckCandidate, CheckUse } from '@/lib/learning/checkpoint-selector'
import type { CheckpointRequirement } from '@/lib/learning/readiness'
import type { EvidenceEventForReadiness } from '@/lib/learning/readiness-evidence'

type SupabaseLike = any

type ServerItem = {
  item_id: string
  item_family: string
  concept_ids: string[]
  dimension: 'listening_comprehension' | 'elicited_production' | 'manipulation' | 'practical_adjustment'
  prompt?: string
  source?: string
  pool?: string | null
  context_id?: string | null
  status?: string
  human_review_complete?: boolean
  audio_asset_id?: string | null
  audio_text?: string
  model_after_response?: string
}

export type LearnerReadyCheckItem = {
  itemId: string
  itemFamily: string
  dimension: ServerItem['dimension']
  prompt: string
  source?: string
  audioAssetId?: string
}

export type ReadyCheckRuntime = {
  checkpoint: {
    id: string
    slug: string
    title: string
    description: string | null
    estimatedSeconds: number | null
  }
  attemptId: string | null
  plan: ReadyCheckPlan
  items: LearnerReadyCheckItem[]
  canRunNow: boolean
  unavailableReason: string | null
}

function normalizeSemanticKey(value: string | undefined | null) {
  if (!value) return null
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function arc01Requirements(): CheckpointRequirement[] {
  const frames = ['C001', 'C002', 'C004', 'C006', 'C007', 'C008']
  const paired = frames.flatMap(conceptId => ([
    {
      key: `${conceptId}-listening`,
      conceptId,
      dimension: 'listening' as const,
      minSuccesses: 1,
      maxHintLevel: 0,
      requireFresh: true,
    },
    {
      key: `${conceptId}-generated`,
      conceptId,
      dimension: 'generated_use' as const,
      minSuccesses: 1,
      maxHintLevel: 0,
      requireSelfGenerated: true,
      requireFresh: true,
    },
  ]))

  return [
    ...paired,
    {
      key: 'C090-manipulation',
      conceptId: 'C090',
      dimension: 'manipulation',
      minSuccesses: 3,
      maxHintLevel: 0,
      requireSelfGenerated: true,
      requireFresh: true,
      distinctContextCount: 3,
    },
    {
      key: 'held-out-adjustment',
      conceptId: null,
      dimension: 'practical_adjustment',
      minSuccesses: 1,
      maxHintLevel: 0,
      requireSelfGenerated: true,
      requireFresh: true,
    },
  ]
}

function eligiblePackageItems(): ServerItem[] {
  const items = (assessmentPackage.items ?? []) as ServerItem[]
  return items.filter(item =>
    item.human_review_complete === true &&
    (item.status === 'approved' || item.status === 'published')
  )
}

function priorUsesFromEvidence(events: EvidenceEventForReadiness[]): CheckUse[] {
  return events.flatMap(event => {
    const metadata = event.metadata ?? {}
    const itemId = typeof metadata.item_key === 'string' ? metadata.item_key : null
    if (!itemId) return []

    return [{
      itemId,
      itemFamily: typeof metadata.item_family === 'string' ? metadata.item_family : null,
      semanticAnswerKey: typeof metadata.semantic_answer_key === 'string'
        ? normalizeSemanticKey(metadata.semantic_answer_key)
        : null,
      contextId: typeof metadata.context_id === 'string' ? metadata.context_id : null,
      answerRevealed: metadata.answer_revealed === true || metadata.model_played_before_response === true,
    }]
  })
}

export async function buildReadyCheckRuntime(
  supabase: SupabaseLike,
  learnerId: string,
  checkpointSlug: string,
): Promise<ReadyCheckRuntime | null> {
  const { data: checkpoint, error: checkpointError } = await supabase
    .from('checkpoints')
    .select('id,slug,title,description,estimated_seconds,unit_id')
    .eq('slug', checkpointSlug)
    .maybeSingle()

  if (checkpointError) throw new Error(checkpointError.message)
  if (!checkpoint) return null

  const { data: unitState } = await supabase
    .from('learner_unit_state')
    .select('status')
    .eq('learner_id', learnerId)
    .eq('unit_id', checkpoint.unit_id)
    .maybeSingle()

  const unitEligible = Boolean(
    unitState && ['active', 'checkpoint_ready', 'completed'].includes(unitState.status)
  )

  if (!unitEligible) {
    return {
      checkpoint: {
        id: checkpoint.id,
        slug: checkpoint.slug,
        title: checkpoint.title,
        description: checkpoint.description,
        estimatedSeconds: checkpoint.estimated_seconds,
      },
      attemptId: null,
      plan: {
        currentStatus: 'needs_more_evidence',
        satisfiedRequirementKeys: [],
        unresolvedRequirementKeys: [],
        technicalIssueKeys: [],
        selectedItems: [],
        remainingAfterSelection: [],
      },
      items: [],
      canRunNow: false,
      unavailableReason: 'This Ready Check is not available for the current Core chapter yet.',
    }
  }

  const requirements = arc01Requirements()
  const conceptIds = [...new Set(requirements.flatMap(r => r.conceptId ? [r.conceptId] : []))]

  const [
    { data: evidenceRows, error: evidenceError },
    { data: attemptRows, error: attemptError },
  ] = await Promise.all([
    supabase
      .from('learner_evidence_events')
      .select('concept_id,evidence_type,success,hint_level,self_generated,context_novelty,occurred_at,metadata')
      .eq('learner_id', learnerId)
      .in('concept_id', conceptIds)
      .order('occurred_at', { ascending: false })
      .limit(250),
    supabase
      .from('checkpoint_attempts')
      .select('id,status,started_at')
      .eq('learner_id', learnerId)
      .eq('checkpoint_id', checkpoint.id)
      .order('started_at', { ascending: false })
      .limit(1),
  ])

  if (evidenceError) throw new Error(evidenceError.message)
  if (attemptError) throw new Error(attemptError.message)

  const evidenceEvents = (evidenceRows ?? []) as EvidenceEventForReadiness[]
  const packageItems = eligiblePackageItems()

  const audioIds = packageItems.flatMap(item =>
    item.dimension === 'listening_comprehension' && item.audio_asset_id
      ? [item.audio_asset_id]
      : []
  )

  const readyAudioIds = new Set<string>()
  if (audioIds.length > 0) {
    const { data: audioRows, error: audioError } = await supabase
      .from('media_assets')
      .select('id')
      .in('id', audioIds)
      .eq('status', 'ready')

    if (audioError) throw new Error(audioError.message)
    for (const row of audioRows ?? []) readyAudioIds.add(row.id)
  }

  const candidates: CheckCandidate[] = packageItems.map(item => ({
    itemId: item.item_id,
    itemFamily: item.item_family,
    conceptIds: item.concept_ids,
    dimension: item.dimension,
    pool: item.pool ?? null,
    contextId: item.context_id ?? null,
    approvalStatus: item.status === 'published' ? 'published' : 'approved',
    audioReady: item.dimension === 'listening_comprehension'
      ? Boolean(item.audio_asset_id && readyAudioIds.has(item.audio_asset_id))
      : undefined,
    semanticAnswerKey: normalizeSemanticKey(item.model_after_response ?? item.audio_text),
  }))

  const plan = planReadyCheck({
    requirements,
    evidenceEvents,
    candidates,
    priorUses: priorUsesFromEvidence(evidenceEvents),
    maxItems: 6,
  })

  const itemById = new Map(packageItems.map(item => [item.item_id, item]))
  const safeItems = plan.selectedItems.flatMap(selected => {
    const source = itemById.get(selected.itemId)
    if (!source) return []

    return [{
      itemId: source.item_id,
      itemFamily: source.item_family,
      dimension: source.dimension,
      prompt: source.prompt ?? 'Respond when you are ready.',
      source: source.dimension === 'manipulation' ? source.source : undefined,
      audioAssetId:
        source.dimension === 'listening_comprehension' &&
        source.audio_asset_id &&
        readyAudioIds.has(source.audio_asset_id)
          ? source.audio_asset_id
          : undefined,
    }]
  })

  const currentAttempt = (attemptRows ?? [])[0] ?? null
  const noApprovedItems = packageItems.length === 0
  const missingRuntimeItems = plan.currentStatus !== 'ready' && safeItems.length === 0

  return {
    checkpoint: {
      id: checkpoint.id,
      slug: checkpoint.slug,
      title: checkpoint.title,
      description: checkpoint.description,
      estimatedSeconds: checkpoint.estimated_seconds,
    },
    attemptId: currentAttempt?.status === 'in_progress' ? currentAttempt.id : null,
    plan,
    items: safeItems,
    canRunNow: plan.currentStatus === 'ready' || (!noApprovedItems && !missingRuntimeItems),
    unavailableReason: noApprovedItems
      ? 'This Ready Check is waiting for reviewed learner-facing items.'
      : missingRuntimeItems
        ? 'The remaining Ready Check items are waiting for approved audio or a fresh unused prompt.'
        : null,
  }
}
