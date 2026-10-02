'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const allowedGoals = new Set(['daily_life','conversation','travel','family_household','work','music_media'])
const allowedGenres = new Set(['pop','hip_hop','reggaeton_latin_pop','rnb','indie_alt','rock','country_pop','electronic','acoustic','throwback','workout','chill'])
const allowedModes = new Set(['drive','energy','zone_out','talk','play','wind_down'])

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (claimsError || !userId) redirect('/login')

  const goal = String(formData.get('goal') ?? '')
  const genres = formData.getAll('genres').map(String).filter(value => allowedGenres.has(value)).slice(0, 6)
  const modes = formData.getAll('modes').map(String).filter(value => allowedModes.has(value)).slice(0, 4)
  const englishSupport = Number(formData.get('english_support') ?? 2)

  if (!allowedGoals.has(goal)) redirect('/onboarding?error=Choose+a+main+goal.')
  if (genres.length === 0) redirect('/onboarding?error=Choose+at+least+one+music+lane.')
  if (!Number.isInteger(englishSupport) || englishSupport < 0 || englishSupport > 3) redirect('/onboarding?error=Choose+a+support+level.')

  const { error } = await supabase
    .from('learner_profiles')
    .update({
      goal,
      preferred_genres: genres,
      preferred_modes: modes,
      english_support_level: englishSupport,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) redirect(`/onboarding?error=${encodeURIComponent(error.message)}`)
  redirect('/today')
}
