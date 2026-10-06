import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  isAccessSatisfied,
  type AccessContext,
  type AccessRule,
  type PathState,
  type UnitState,
} from '@/lib/progression/access'
import AppNav from '@/components/app/AppNav'

export default async function PlayPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const [
    { data: recommendation },
    { data: games },
    { data: rules },
    { data: unitStates },
    { data: pathStates },
    { data: unlocks },
  ] = await Promise.all([
    supabase
      .from('recommendations')
      .select('content_item_id,content_item:content_items(title)')
      .eq('learner_id', userId)
      .is('consumed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('game_mechanics')
      .select('id,slug,title,description,evidence_type,sort_order,metadata')
      .eq('status', 'published')
      .order('sort_order', { ascending: true }),
    supabase
      .from('game_unlock_rules')
      .select('game_id,access_rule,required_unit_id,required_path_id'),
    supabase
      .from('learner_unit_state')
      .select('unit_id,status')
      .eq('learner_id', userId),
    supabase
      .from('learner_path_state')
      .select('path_id,status')
      .eq('learner_id', userId),
    supabase
      .from('learner_unlocks')
      .select('content_item_id,collection_id,game_id')
      .eq('learner_id', userId),
  ])

  const accessContext: AccessContext = {
    unitStates: new Map(
      (unitStates ?? []).map(row => [row.unit_id, row.status as UnitState])
    ),
    pathStates: new Map(
      (pathStates ?? []).map(row => [row.path_id, row.status as PathState])
    ),
    directUnlockedContentIds: new Set(
      (unlocks ?? []).flatMap(row => row.content_item_id ? [row.content_item_id] : [])
    ),
    unlockedCollectionIds: new Set(
      (unlocks ?? []).flatMap(row => row.collection_id ? [row.collection_id] : [])
    ),
    unlockedGameIds: new Set(
      (unlocks ?? []).flatMap(row => row.game_id ? [row.game_id] : [])
    ),
  }

  const ruleByGame = new Map((rules ?? []).map(rule => [rule.game_id, rule]))
  const gameCards = (games ?? []).map((game: any) => {
    const rule = ruleByGame.get(game.id)
    const unlocked = rule
      ? isAccessSatisfied({
          accessRule: rule.access_rule as AccessRule,
          requiredUnitId: rule.required_unit_id,
          requiredPathId: rule.required_path_id,
          gameId: game.id,
        }, accessContext)
      : false

    return {
      ...game,
      unlocked,
      routePath: game.metadata?.route_path as string | undefined,
    }
  })

  const activeId = recommendation?.content_item_id

  return (
    <main className="product-shell app-surface">
      <AppNav active="play" />

      <section className="surface-hero compact">
        <div>
          <p className="eyebrow">PLAY</p>
          <h1>Pick a way to make it stick.</h1>
          <p className="lede">New game styles open as your Spanish gets more flexible. No coins, no lives—just different ways to use what you know.</p>
        </div>
      </section>

      {gameCards.length > 0 ? (
        <section className="activity-grid">
          {gameCards.map(game => (
            <article
              className={`activity-card ${game.unlocked ? 'available' : 'game-locked'}`}
              key={game.id}
            >
              <span className="activity-status">{game.unlocked ? 'UNLOCKED' : 'COMING UP'}</span>
              <h2>{game.title}</h2>
              <p>{game.description ?? 'A different way to practice the Spanish you are building.'}</p>

              {game.unlocked && game.routePath ? (
                <Link className="primary" href={game.routePath}>Play</Link>
              ) : game.unlocked ? (
                <span className="game-state-pill">Ready for its first round</span>
              ) : (
                <span className="game-state-pill locked">Unlocks as Core opens up</span>
              )}
            </article>
          ))}
        </section>
      ) : (
        <section className="activity-grid">
          <article className="activity-card available">
            <span className="activity-status">AVAILABLE NOW</span>
            <h2>Pattern Switch</h2>
            <p>Change the intention while keeping the action. It is our current bridge into the live assessment engine.</p>
            <Link className="primary" href={activeId ? `/learn?content=${activeId}` : '/learn'}>Play current pattern</Link>
          </article>

          <article className="activity-card game-locked">
            <span className="activity-status">COMING UP</span>
            <h2>Hook Hunt</h2>
            <p>Pull a missing phrase back from a song or spoken hook.</p>
            <span className="game-state-pill locked">Unlockable game</span>
          </article>

          <article className="activity-card game-locked">
            <span className="activity-status">COMING UP</span>
            <h2>Scene Rescue</h2>
            <p>Help a character handle a situation with useful Spanish.</p>
            <span className="game-state-pill locked">Unlockable game</span>
          </article>
        </section>
      )}
    </main>
  )
}
