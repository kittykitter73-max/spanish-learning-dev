import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/app/AppNav'

export default async function PlayPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const [{ data: recommendation }, { data: states }] = await Promise.all([
    supabase
      .from('recommendations')
      .select('content_item_id,content_item:content_items(title)')
      .eq('learner_id', userId)
      .is('consumed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('learner_concept_state')
      .select('concept_id,recall_confidence,manipulation_confidence,production_confidence')
      .eq('learner_id', userId)
      .order('updated_at', { ascending: false })
      .limit(6),
  ])

  const activeId = recommendation?.content_item_id
  const touched = states?.length ?? 0

  return (
    <main className="product-shell app-surface">
      <AppNav active="play" />

      <section className="surface-hero compact">
        <div>
          <p className="eyebrow">PLAY</p>
          <h1>Practice without worksheets.</h1>
          <p className="lede">Games will pull from the Spanish you actually need next. Different mechanics will produce different evidence instead of pretending every tap proves fluency.</p>
        </div>
      </section>

      <section className="activity-grid">
        <article className="activity-card available">
          <span className="activity-status">AVAILABLE NOW</span>
          <h2>Pattern Switch</h2>
          <p>Retrieve a familiar frame, change the intention, then make it yours. This uses the live assessment flow already connected to your learner state.</p>
          <Link className="primary" href={activeId ? `/learn?content=${activeId}` : '/learn'}>Play current pattern</Link>
        </article>

        <article className="activity-card">
          <span className="activity-status">NEXT</span>
          <h2>Hook Hunt</h2>
          <p>Finish a lyric or spoken hook from memory. Audio-based recall once our first real track is attached.</p>
        </article>

        <article className="activity-card">
          <span className="activity-status">NEXT</span>
          <h2>Scene Rescue</h2>
          <p>Help a character handle a real situation with the most useful Spanish response.</p>
        </article>

        <article className="activity-card">
          <span className="activity-status">LEARNER SIGNAL</span>
          <h2>{touched} concepts are ready to drive practice.</h2>
          <p>The game selector will use weak recall, manipulation, and production signals rather than random repetition.</p>
        </article>
      </section>
    </main>
  )
}
