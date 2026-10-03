import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/app/AppNav'

type StateRow = {
  concept_id: string
  recognition_confidence: number | string
  recall_confidence: number | string
  listening_confidence: number | string
  manipulation_confidence: number | string
  production_confidence: number | string
  transfer_confidence: number | string
  due_at: string | null
}

function pct(value: number | string | null | undefined) {
  return Math.round(Number(value ?? 0) * 100)
}

function learnerReason(reasons: string[] | null | undefined) {
  const set = new Set(reasons ?? [])
  if (set.has('due_review')) return 'A quick return now will make this easier to recall later.'
  if (set.has('recent_error')) return 'One part is still a little sticky, so we’re bringing it back while it’s useful.'
  if (set.has('production_gap')) return 'This is familiar already. The next step is making it easier to say yourself.'
  if (set.has('new_target')) return 'You’re ready to add one new piece without losing the old ones.'
  return null
}

export default async function TodayPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const [{ data: profile }, { data: states }, { data: recommendation }, { data: inProgress }, { count: evidenceCount }] = await Promise.all([
    supabase.from('learner_profiles').select('display_name,goal,onboarding_completed_at').eq('id', userId).maybeSingle(),
    supabase.from('learner_concept_state').select('concept_id,recognition_confidence,recall_confidence,listening_confidence,manipulation_confidence,production_confidence,transfer_confidence,due_at').order('updated_at', { ascending: false }).limit(6),
    supabase.from('recommendations').select('recommendation_type,reason_codes,content_item_id,content_item:content_items(title)').is('consumed_at', null).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('learner_content_progress').select('content_item_id,current_stage,last_interaction_at,content_item:content_items(title)').is('completed_at', null).order('last_interaction_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('learner_evidence_events').select('*', { count: 'exact', head: true }),
  ])

  if (!profile?.onboarding_completed_at) redirect('/onboarding')

  const rows = (states ?? []) as StateRow[]
  const touched = rows.length
  const avgProduction = touched ? Math.round(rows.reduce((sum, row) => sum + pct(row.production_confidence), 0) / touched) : 0
  const dueNow = rows.filter(row => row.due_at && new Date(row.due_at) <= new Date()).length
  const firstName = profile?.display_name?.trim()?.split(/\s+/)[0]
  const activeContent = inProgress?.content_item_id ? inProgress : recommendation
  const activeTitle = (activeContent as any)?.content_item?.title ?? 'Want. Have to. Going to.'
  const activeContentId = (activeContent as any)?.content_item_id as string | undefined
  const isResume = Boolean(inProgress?.content_item_id)

  return (
    <main className="product-shell">
      <AppNav active="today" />

      <section className="today-hero">
        <div>
          <p className="eyebrow">TODAY</p>
          <h1>{firstName ? `${firstName}, keep the Spanish moving.` : 'Keep the Spanish moving.'}</h1>
          <p className="lede">A short mix chosen from what you’ve encountered, what you can retrieve, and what still needs real use.</p>
        </div>
        <div className="streak-orbit" aria-label={`${evidenceCount ?? 0} learning evidence events`}>
          <strong>{evidenceCount ?? 0}</strong>
          <span>evidence<br/>moments</span>
        </div>
      </section>

      <section className="today-grid">
        <article className="card focus-card">
          <div className="card-topline"><span>{isResume ? 'CONTINUE YOUR MIX' : 'YOUR NEXT MIX'}</span><span>~3 MIN</span></div>
          <p className="mix-kicker">First Contact · Spoken pattern</p>
          <h2>{activeTitle}</h2>
          <p>Catch the pattern, retrieve it, switch the intention, then use it in your own life.</p>
          {learnerReason((recommendation as any)?.reason_codes) && (
            <p className="support-copy">{learnerReason((recommendation as any)?.reason_codes)}</p>
          )}
          <Link className="primary" href={activeContentId ? `/learn?content=${activeContentId}` : '/learn'}>{isResume ? 'Continue where I left off' : 'Start today’s mix'}</Link>
        </article>

        <article className="card pulse-card">
          <div className="card-topline"><span>LEARNING PULSE</span><span>LIVE</span></div>
          <div className="metric"><strong>{touched}</strong><span>concepts with evidence</span></div>
          <div className="metric"><strong>{avgProduction}%</strong><span>avg production signal</span></div>
          <div className="metric"><strong>{dueNow}</strong><span>due for retrieval now</span></div>
          <p className="tiny-note">Completion is not mastery. These numbers only move when the evidence type warrants it.</p>
        </article>
      </section>

      <section className="concept-strip">
        <div className="section-heading">
          <div><p className="eyebrow">WHAT YOUR BRAIN IS DOING</p><h2>Same Spanish, different strengths.</h2></div>
          <p>Recognition can be high while production is still weak. Borao keeps those separate.</p>
        </div>
        <div className="concept-grid">
          {rows.length > 0 ? rows.slice(0, 3).map(row => (
            <article className="concept-card" key={row.concept_id}>
              <span className="concept-id">{row.concept_id}</span>
              <div className="mini-row"><span>Recognize</span><b>{pct(row.recognition_confidence)}%</b></div>
              <div className="mini-bar"><span style={{ width: `${pct(row.recognition_confidence)}%` }} /></div>
              <div className="mini-row"><span>Produce</span><b>{pct(row.production_confidence)}%</b></div>
              <div className="mini-bar warm"><span style={{ width: `${pct(row.production_confidence)}%` }} /></div>
            </article>
          )) : (
            <article className="empty-learning">
              <h3>Your learning map starts with your first answer.</h3>
              <p>See it once, retrieve it once, and Borao will begin separating what feels familiar from what you can actually use.</p>
              <Link className="secondary" href="/learn">Create my first evidence</Link>
            </article>
          )}
        </div>
      </section>
    </main>
  )
}
