'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createPlaylist(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return

  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const { error } = await supabase.from('playlists').insert({
    learner_id: userId,
    name: name.slice(0, 80),
    playlist_type: 'manual',
    playback_mode: 'mixed',
  })

  if (error) throw new Error(error.message)
  revalidatePath('/library')
}
