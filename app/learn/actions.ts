'use server'

import { createClient } from '@/lib/supabase/server'

async function authenticatedClient() {
  const supabase = await createClient()
  const { data: claimsData, error } = await supabase.auth.getClaims()
  if (error || !claimsData?.claims?.sub) throw new Error('Not authenticated')
  return supabase
}

export async function recordExposure(contentItemId: string) {
  const supabase = await authenticatedClient()
  const { data, error } = await supabase.rpc('record_content_exposure', {
    p_content_item_id: contentItemId,
  })
  if (error) throw new Error(error.message)
  return { recordedConcepts: Number(data ?? 0) }
}

export async function submitAssessment(input: {
  assessmentItemId: string
  contentItemId: string
  response: string
}) {
  const supabase = await authenticatedClient()

  const { data, error } = await supabase.rpc('submit_assessment_response', {
    p_assessment_item_id: input.assessmentItemId,
    p_content_item_id: input.contentItemId,
    p_response: input.response,
  })
  if (error) throw new Error(error.message)

  const result = Array.isArray(data) ? data[0] : data
  if (!result) throw new Error('Assessment did not return a result')

  const { data: recommendation } = await supabase
    .from('recommendations')
    .select('reason_codes')
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return {
    success: Boolean(result.success),
    evidenceType: String(result.evidence_type),
    reasonCodes: (recommendation?.reason_codes ?? []) as string[],
  }
}

export async function saveLessonProgress(input: { contentItemId: string; stage: string; completed?: boolean }) {
  const supabase = await authenticatedClient()
  const { error } = await supabase.rpc('save_content_progress', {
    p_content_item_id: input.contentItemId,
    p_stage: input.stage,
    p_completed: Boolean(input.completed),
  })
  if (error) throw new Error(error.message)
}
