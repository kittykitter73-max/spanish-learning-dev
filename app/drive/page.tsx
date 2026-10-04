import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DriveMode from '@/components/player/DriveMode'

export default async function DrivePage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  return <DriveMode />
}
