import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/app/AppNav'

export default async function SpeakPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const { data: states } = await supabase
    .from('learner_concept_state')
    .select('concept_id,production_confidence,transfer_confidence')
    .eq('learner_id', userId)
    .order('updated_at', { ascending: false })
    .limit(4)

  return (
    <main className="product-shell app-surface">
      <AppNav active="speak" />

      <section className="surface-hero compact">
        <div>
          <p className="eyebrow">SPEAK</p>
          <h1>Spanish has to leave your mouth.</h1>
          <p className="lede">This will become the voice-first surface for character roleplay, quick oral prompts, missions, and Drive mode. The current build keeps speaking evidence separate from recognition.</p>
        </div>
      </section>

      <section className="speak-stage">
        <article className="card speak-card">
          <span className="activity-status">CURRENT BRIDGE</span>
          <h2>Use the pattern yourself.</h2>
          <p>Until microphone capture is connected, the live lesson flow is our production bridge. Your answers already update production evidence separately from recognition.</p>
          <Link className="primary" href="/learn">Practice a live prompt</Link>
        </article>

        <div className="signal-list">
          {(states ?? []).length > 0 ? states!.map((state: any) => (
            <div className="signal-row" key={state.concept_id}>
              <span>{state.concept_id}</span>
              <div>
                <small>production</small>
                <strong>{Math.round(Number(state.production_confidence ?? 0) * 100)}%</strong>
              </div>
              <div>
                <small>transfer</small>
                <strong>{Math.round(Number(state.transfer_confidence ?? 0) * 100)}%</strong>
              </div>
            </div>
          )) : <p className="muted">Your speaking map will appear after the first production task.</p>}
        </div>
      </section>
    </main>
  )
}
