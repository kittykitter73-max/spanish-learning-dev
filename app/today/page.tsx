import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/app/AppNav'
import UnlockReveal from '@/components/progression/UnlockReveal'

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

  const [
    { data: profile },
    { data: recommendation },
    { data: inProgress },
    { data: corePath },
    { data: unseenUnlock },
  ] = await Promise.all([
    supabase
      .from('learner_profiles')
      .select('display_name,goal,onboarding_completed_at')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('recommendations')
      .select('recommendation_type,reason_codes,content_item_id,content_item:content_items(title,content_type)')
      .is('consumed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('learner_content_progress')
      .select('content_item_id,current_stage,last_interaction_at,content_item:content_items(title,content_type)')
      .is('completed_at', null)
      .order('last_interaction_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('learning_paths')
      .select('id,title')
      .eq('path_kind', 'core')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('learner_unlocks')
      .select('id,unlock_kind,feature_key,content:content_items(title),collection:content_collections(title,slug),game:game_mechanics(title,slug)')
      .eq('learner_id', userId)
      .is('seen_at', null)
      .order('unlocked_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (!profile?.onboarding_completed_at) redirect('/onboarding')

  let coreUnits: Array<{ id: string; title: string; sequence_number: number }> = []
  let unitStates: Array<{ unit_id: string; status: string }> = []

  if (corePath?.id) {
    const [{ data: units }, { data: states }] = await Promise.all([
      supabase
        .from('learning_units')
        .select('id,title,sequence_number')
        .eq('path_id', corePath.id)
        .eq('status', 'published')
        .order('sequence_number', { ascending: true }),
      supabase
        .from('learner_unit_state')
        .select('unit_id,status')
        .eq('learner_id', userId),
    ])

    coreUnits = units ?? []
    unitStates = states ?? []
  }

  const completedUnitIds = new Set(
    unitStates.filter(state => state.status === 'completed').map(state => state.unit_id)
  )
  const activeUnitState = unitStates.find(state =>
    ['available', 'active', 'checkpoint_ready'].includes(state.status)
  )
  const activeUnit =
    coreUnits.find(unit => unit.id === activeUnitState?.unit_id)
    ?? coreUnits.find(unit => !completedUnitIds.has(unit.id))
    ?? null

  const firstName = profile?.display_name?.trim()?.split(/\s+/)[0]
  const activeContent = inProgress?.content_item_id ? inProgress : recommendation
  const activeTitle = (activeContent as any)?.content_item?.title ?? 'Want. Have to. Going to.'
  const activeContentId = (activeContent as any)?.content_item_id as string | undefined
  const isResume = Boolean(inProgress?.content_item_id)
  const coreProgress = coreUnits.length
    ? Math.round((completedUnitIds.size / coreUnits.length) * 100)
    : 0

  const unlock = unseenUnlock as any
  const unlockTitle =
    unlock?.collection?.title
    ?? unlock?.game?.title
    ?? unlock?.content?.title
    ?? unlock?.feature_key
    ?? 'Something new'
  const unlockHref =
    unlock?.collection?.slug
      ? `/library/collection/${unlock.collection.slug}`
      : unlock?.game
        ? '/play'
        : unlock?.content
          ? '/listen'
          : undefined
  const unlockSubtitle =
    unlock?.unlock_kind === 'collection'
      ? 'The full release is now part of your Library.'
      : unlock?.unlock_kind === 'game'
        ? 'A new way to practice just opened.'
        : unlock?.unlock_kind === 'content'
          ? 'A new track is ready to play.'
          : 'Borao opened something new for you.'

  return (
    <main className="product-shell home-surface">
      <AppNav active="home" />

      <section className="home-greeting">
        <p className="eyebrow">HOME</p>
        <h1>{firstName ? `Hey, ${firstName}.` : 'Hey.'}</h1>
        <p>Keep the Spanish moving. Borao will handle what comes back and when.</p>
      </section>

      {unlock?.id && (
        <UnlockReveal
          id={unlock.id}
          kind={unlock.unlock_kind}
          title={unlockTitle}
          subtitle={unlockSubtitle}
          href={unlockHref}
        />
      )}

      <section className="home-primary-grid">
        <article className="card continue-card">
          <div className="card-topline">
            <span>{isResume ? 'PICK UP WHERE YOU LEFT OFF' : 'UP NEXT'}</span>
            <span>{(activeContent as any)?.content_item?.content_type?.replaceAll('_', ' ') ?? 'practice'}</span>
          </div>
          <h2>{activeTitle}</h2>
          <p>{learnerReason((recommendation as any)?.reason_codes) ?? 'A short step chosen from what you are ready for now.'}</p>
          <Link className="primary" href={activeContentId ? `/learn?content=${activeContentId}` : '/learn'}>
            {isResume ? 'Continue' : 'Start'}
          </Link>
        </article>

        <article className="card core-card">
          <p className="eyebrow">CORE</p>
          {coreUnits.length > 0 ? (
            <>
              <h2>{activeUnit?.title ?? 'Core complete'}</h2>
              <p>{completedUnitIds.size} of {coreUnits.length} arcs complete</p>
              <div className="core-progress" aria-label={`${coreProgress}% of Core complete`}>
                <span style={{ width: `${coreProgress}%` }} />
              </div>
              <small>{coreProgress}% complete</small>
            </>
          ) : (
            <>
              <h2>Your foundation.</h2>
              <p>The Core path will appear here as curriculum Arcs are published. Your current learning flow keeps working in the meantime.</p>
              <div className="core-progress"><span style={{ width: '4%' }} /></div>
            </>
          )}
        </article>
      </section>

      <section className="home-shortcuts">
        <Link href="/listen" className="home-shortcut listen-shortcut">
          <span>LISTEN</span>
          <strong>Put Spanish on.</strong>
          <small>Music, episodes, mixes and Drive.</small>
        </Link>
        <Link href="/play" className="home-shortcut">
          <span>PLAY</span>
          <strong>Make it stick.</strong>
          <small>Fast games chosen from what you need.</small>
        </Link>
        <Link href="/speak" className="home-shortcut">
          <span>SPEAK</span>
          <strong>Use it out loud.</strong>
          <small>Prompts, scenes and conversation missions.</small>
        </Link>
      </section>

      <section className="home-footer-note">
        <p>Listening can make Spanish familiar. Borao only moves mastery when you show that you can recognize, retrieve, change, or use it.</p>
      </section>
    </main>
  )
}
