'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function signedInUser() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')
  return { supabase, userId }
}

export async function toggleFavorite(formData: FormData) {
  const contentItemId = String(formData.get('contentItemId') ?? '')
  if (!contentItemId) return

  const { supabase, userId } = await signedInUser()

  const { data: existing, error: readError } = await supabase
    .from('favorites')
    .select('content_item_id')
    .eq('learner_id', userId)
    .eq('content_item_id', contentItemId)
    .maybeSingle()

  if (readError) throw new Error(readError.message)

  if (existing) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('learner_id', userId)
      .eq('content_item_id', contentItemId)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('favorites').insert({
      learner_id: userId,
      content_item_id: contentItemId,
    })
    if (error) throw new Error(error.message)
  }

  revalidatePath('/listen')
  revalidatePath('/library')
}

export async function addToPlaylist(formData: FormData) {
  const playlistId = String(formData.get('playlistId') ?? '')
  const contentItemId = String(formData.get('contentItemId') ?? '')
  if (!playlistId || !contentItemId) return

  const { supabase, userId } = await signedInUser()

  const { data: playlist, error: playlistError } = await supabase
    .from('playlists')
    .select('id')
    .eq('id', playlistId)
    .eq('learner_id', userId)
    .in('playlist_type', ['manual', 'smart'])
    .maybeSingle()

  if (playlistError) throw new Error(playlistError.message)
  if (!playlist) throw new Error('Playlist not available.')

  const { data: existing, error: existingError } = await supabase
    .from('playlist_items')
    .select('content_item_id')
    .eq('playlist_id', playlistId)
    .eq('content_item_id', contentItemId)
    .maybeSingle()

  if (existingError) throw new Error(existingError.message)
  if (existing) return

  const { data: last, error: lastError } = await supabase
    .from('playlist_items')
    .select('position')
    .eq('playlist_id', playlistId)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lastError) throw new Error(lastError.message)

  const { error } = await supabase.from('playlist_items').insert({
    playlist_id: playlistId,
    content_item_id: contentItemId,
    position: Number(last?.position ?? 0) + 1,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/listen')
  revalidatePath('/library')
  revalidatePath(`/library/${playlistId}`)
}
