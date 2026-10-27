import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StudioWorkbench from '@/components/studio/StudioWorkbench'

export const dynamic = 'force-dynamic'

export default async function StudioPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  const studioRole = (claimsData?.claims?.app_metadata as { borao_studio_role?: string } | undefined)?.borao_studio_role ?? 'none'
  if (!userId) redirect('/login')
  const allowed = (process.env.BORAO_STUDIO_ADMIN_USER_IDS ?? '')
    .split(',').map(value => value.trim()).filter(Boolean)
  // Fail closed when not configured. Do not permit ordinary learners to see drafts.
  if (!allowed.includes(userId)) notFound()

  const [{ data: catalog, error }, { data: concepts, error: conceptError }] = await Promise.all([
    supabase.from('content_items')
      .select('id,title,content_type,status')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(30),
    supabase.from('concepts')
      .select('id,canonical_spanish,canonical_english,communicative_function,status')
      .eq('status', 'published')
      .order('id', { ascending: true })
      .limit(150),
  ])

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <div>
          <Link href="/today" className="studio-back">← Back to Borao</Link>
          <p className="studio-eyebrow">INTERNAL CREATIVE WORKSPACE · PILOT</p>
          <h1>Borao Studio<span className="studio-star">✳</span></h1>
          <p className="studio-subtitle">Create the next song with purpose. Check the learning. Keep the magic.</p>
        </div>
        <span className="studio-pill">Studio pilot · Nothing published</span>
      </header>
      <StudioWorkbench studioRole={studioRole} catalog={error ? [] : (catalog ?? [])} catalogError={error?.message ?? null} concepts={conceptError ? [] : (concepts ?? [])} conceptError={conceptError?.message ?? null} />
    </main>
  )
}
