import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  collectionAccessSummary,
  type AccessContext,
  type AccessRule,
  type PathState,
  type UnitState,
} from '@/lib/progression/access'
import AppNav from '@/components/app/AppNav'
import { createPlaylist } from './actions'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const [
    { data: playlists },
    { data: favorites },
    { data: collections },
    { data: unitStates },
    { data: pathStates },
    { data: unlocks },
  ] = await Promise.all([
    supabase
      .from('playlists')
      .select('id,name,playlist_type,playback_mode,updated_at')
      .order('updated_at', { ascending: false }),
    supabase
      .from('favorites')
      .select('content_item_id,content_item:content_items(title,content_type)')
      .eq('learner_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('content_collections')
      .select('id,slug,title,collection_type,description,release_order')
      .eq('status', 'published')
      .order('release_order', { ascending: true }),
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

  const collectionIds = (collections ?? []).map(collection => collection.id)
  const { data: collectionItems } = collectionIds.length
    ? await supabase
        .from('collection_items')
        .select('collection_id,content_item_id,position,item_role,access_rule,required_unit_id,required_path_id')
        .in('collection_id', collectionIds)
        .order('position', { ascending: true })
    : { data: [] }

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

  const collectionCards = (collections ?? []).map(collection => {
    const items = (collectionItems ?? [])
      .filter(item => item.collection_id === collection.id)
      .map(item => ({
        accessRule: item.access_rule as AccessRule,
        requiredUnitId: item.required_unit_id,
        requiredPathId: item.required_path_id,
        contentItemId: item.content_item_id,
        collectionId: collection.id,
      }))

    return {
      ...collection,
      summary: collectionAccessSummary(items, accessContext),
    }
  })

  return (
    <main className="product-shell app-surface">
      <AppNav active="library" />

      <section className="surface-hero compact">
        <div>
          <p className="eyebrow">LIBRARY</p>
          <h1>Your Spanish collection.</h1>
          <p className="lede">Albums open as your Spanish grows. Save the tracks you love, build your own mixes, and keep the music without turning your library into a scoreboard.</p>
        </div>
      </section>

      <section className="library-module-callout">
        <div>
          <p className="eyebrow">AFTER CORE</p>
          <h2>Choose your Spanish.</h2>
          <p>Travel, social life, work, family, slang, regions and other focused paths live in Modules once the shared foundation is ready.</p>
        </div>
        <Link className="secondary" href="/modules">Explore modules</Link>
      </section>

      <section className="record-shelf-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">RECORD SHELF</p>
            <h2>Albums & series</h2>
          </div>
          <span>{collectionCards.length} release{collectionCards.length === 1 ? '' : 's'}</span>
        </div>

        {collectionCards.length > 0 ? (
          <div className="record-shelf">
            {collectionCards.map(collection => {
              const { total, unlocked, complete } = collection.summary
              const status = complete
                ? 'Full release unlocked'
                : unlocked > 0
                  ? `${unlocked} of ${total} unlocked`
                  : 'Coming up'

              return (
                <Link
                  className={`record-card ${complete ? 'complete' : unlocked > 0 ? 'partial' : 'locked'}`}
                  href={`/library/collection/${collection.slug}`}
                  key={collection.id}
                >
                  <div className="record-art" aria-hidden="true">
                    <span>{String(collection.release_order + 1).padStart(2, '0')}</span>
                    <b>{collection.collection_type === 'album' ? 'ALBUM' : 'SERIES'}</b>
                  </div>
                  <div className="record-copy">
                    <span>{status}</span>
                    <h3>{collection.title}</h3>
                    {collection.description && <p>{collection.description}</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="record-shelf-empty">
            <div className="record-art ghost" aria-hidden="true"><span>01</span><b>ALBUM</b></div>
            <div>
              <strong>Your first album will live here.</strong>
              <p>Tracks can open one by one, then the full release becomes yours to play straight through.</p>
            </div>
          </div>
        )}
      </section>

      <section className="library-grid">
        <article className="card library-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">MY PLAYLISTS</p><h2>Build a mix.</h2></div>
            <span>{playlists?.filter(p => p.playlist_type !== 'system').length ?? 0}</span>
          </div>

          <form action={createPlaylist} className="playlist-create">
            <input name="name" maxLength={80} placeholder="Gym Spanish, Drive 20, Favorites…" required />
            <button className="primary" type="submit">Create playlist</button>
          </form>

          <div className="library-list">
            {(playlists ?? []).length > 0 ? playlists!.map(p => (
              <Link className="library-row library-row-link" key={p.id} href={`/library/${p.id}`}>
                <div>
                  <strong>{p.name}</strong>
                  <span>{p.playlist_type} · {p.playback_mode}</span>
                </div>
                <span>›</span>
              </Link>
            )) : (
              <p className="muted">No playlists yet. Create the first one above.</p>
            )}
          </div>
        </article>

        <article className="card library-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">SAVED</p><h2>Favorites.</h2></div>
            <span>{favorites?.length ?? 0}</span>
          </div>
          <div className="library-list">
            {(favorites ?? []).length > 0 ? favorites!.map((favorite: any) => (
              <div className="library-row" key={favorite.content_item_id}>
                <div>
                  <strong>{favorite.content_item?.title ?? 'Saved content'}</strong>
                  <span>{favorite.content_item?.content_type?.replaceAll('_', ' ')}</span>
                </div>
              </div>
            )) : (
              <p className="muted">Favorite songs and episodes will appear here.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  )
}
