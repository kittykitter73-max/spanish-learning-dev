'use server'

import { createClient } from '@/lib/supabase/server'

async function authenticatedClient() {
  const supabase = await createClient()
  const { data: claimsData, error } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub

  if (error || !userId) throw new Error('Not authenticated')
  return { supabase, userId }
}

export async function startReadyCheck(checkpointId: string) {
  const { supabase, userId } = await authenticatedClient()

  const { data: existing, error: existingError } = await supabase
    .from('checkpoint_attempts')
    .select('id,status,started_at')
    .eq('learner_id', userId)
    .eq('checkpoint_id', checkpointId)
    .eq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existingError) throw new Error(existingError.message)
  if (existing) return existing

  const { data, error } = await supabase
    .from('checkpoint_attempts')
    .insert({
      learner_id: userId,
      checkpoint_id: checkpointId,
    })
    .select('id,status,started_at')
    .single()

  if (error) throw new Error(error.message)
  return data
}
