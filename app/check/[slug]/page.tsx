import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildReadyCheckRuntime } from '@/lib/learning/ready-check-server'
import AppNav from '@/components/app/AppNav'
import ReadyCheckClient from './ReadyCheckClient'

export default async function ReadyCheckPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const runtime = await buildReadyCheckRuntime(supabase, userId, slug)

  return (
    <main className="product-shell app-surface ready-check-shell">
      <AppNav active="play" />

      <section className="surface-hero compact">
        <div>
          <p className="eyebrow">READY CHECK</p>
          <h1>{runtime?.checkpoint.title ?? 'Ready Check'}</h1>
          <p className="lede">
            A short adaptive check. Borao only asks for evidence you have not already shown.
          </p>
        </div>
      </section>

      {!runtime ? (
        <section className="card ready-check-card">
          <p className="eyebrow">NOT AVAILABLE YET</p>
          <h2>This check is still being prepared.</h2>
          <p>Nothing is counted against you while the reviewed prompts or audio are not ready.</p>
        </section>
      ) : (
        <ReadyCheckClient
          checkpointSlug={runtime.checkpoint.slug}
          initialAttemptId={runtime.attemptId}
          initialStatus={runtime.plan.currentStatus}
          canRunNow={runtime.canRunNow}
          unavailableReason={runtime.unavailableReason}
          selectedCount={runtime.items.length}
        />
      )}
    </main>
  )
}
