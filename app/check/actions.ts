'use server'

import { createClient } from '@/lib/supabase/server'
import { buildReadyCheckRuntime } from '@/lib/learning/ready-check-server'

async function authenticatedClient() {
  const supabase = await createClient()
  const { data: claimsData, error } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (error || !userId) throw new Error('Not authenticated')
  return { supabase, userId }
}

export async function startReadyCheck(checkpointSlug: string, input?: {
  attemptKind?: 'check' | 'retest'
  parentAttemptId?: string | null
}) {
  const { supabase, userId } = await authenticatedClient()
  const runtime = await buildReadyCheckRuntime(supabase, userId, checkpointSlug)
  if (!runtime) throw new Error('Ready Check not available')
  if (!runtime.canRunNow) throw new Error(runtime.unavailableReason ?? 'Ready Check not available yet')

  if (runtime.attemptId) {
    const { data, error } = await supabase.rpc('get_checkpoint_attempt_v2', {
      p_attempt_id: runtime.attemptId,
    })
    if (error) throw new Error(error.message)
    return data
  }

  if (runtime.plan.currentStatus === 'ready') {
    return {
      attemptId: null,
      checkpointId: runtime.checkpoint.id,
      status: 'ready',
      learnerResultCode: 'ready',
      learnerMessage: 'You already have enough fresh evidence to move on.',
      items: [],
      boosterPlan: {},
    }
  }

  const itemKeys = runtime.items.map(item => item.itemId)
  if (itemKeys.length === 0) {
    throw new Error(runtime.unavailableReason ?? 'No fresh Ready Check prompts are available.')
  }

  const { data: attemptId, error: startError } = await supabase.rpc('start_checkpoint_attempt_v2', {
    p_checkpoint_id: runtime.checkpoint.id,
    p_item_keys: itemKeys,
    p_attempt_kind: input?.attemptKind ?? 'check',
    p_parent_attempt_id: input?.parentAttemptId ?? null,
  })
  if (startError) throw new Error(startError.message)

  const { data, error } = await supabase.rpc('get_checkpoint_attempt_v2', {
    p_attempt_id: attemptId,
  })
  if (error) throw new Error(error.message)
  return data
}

export async function getReadyCheckAttempt(attemptId: string) {
  const { supabase } = await authenticatedClient()
  const { data, error } = await supabase.rpc('get_checkpoint_attempt_v2', {
    p_attempt_id: attemptId,
  })
  if (error) throw new Error(error.message)
  return data
}

export async function submitReadyCheckResponse(input: {
  attemptId: string
  itemKey: string
  response: string
}) {
  const { supabase } = await authenticatedClient()
  const { data, error } = await supabase.rpc('submit_checkpoint_attempt_response_v2', {
    p_attempt_id: input.attemptId,
    p_item_key: input.itemKey,
    p_response: input.response,
  })
  if (error) throw new Error(error.message)
  return data
}

export async function finalizeReadyCheck(attemptId: string) {
  const { supabase } = await authenticatedClient()
  const { data, error } = await supabase.rpc('finalize_checkpoint_attempt_v2', {
    p_attempt_id: attemptId,
  })
  if (error) throw new Error(error.message)
  return data
}

export async function startReadyCheckRetest(checkpointSlug: string, parentAttemptId: string) {
  return startReadyCheck(checkpointSlug, {
    attemptKind: 'retest',
    parentAttemptId,
  })
}
