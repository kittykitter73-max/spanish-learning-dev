'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function markUnlockSeen(formData: FormData) {
  const unlockId = String(formData.get('unlockId') ?? '')
  if (!unlockId) return

  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const { error } = await supabase
    .from('learner_unlocks')
    .update({ seen_at: new Date().toISOString() })
    .eq('id', unlockId)
    .eq('learner_id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/today')
}
