import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/app/AppNav'
import { createPlaylist } from './actions'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const [{ data: playlists }, { data: favorites }] = await Promise.all([
    supabase
      .from('playlists')
      .select('id,name,playlist_type,playback_mode,updated_at')
      .order('updated_at', { ascending: false }),
    supabase
      .from('favorites')
      .select('content_item_id,content_item:content_items(title,content_type)')
      .eq('learner_id', userId)
      .order('created_at', { ascending: false }),
  ])

  return (
    <main className="product-shell app-surface">
      <AppNav active="library" />

      <section className="surface-hero compact">
        <div>
          <p className="eyebrow">LIBRARY</p>
          <h1>Keep what you want to hear again.</h1>
          <p className="lede">Albums, episodes, saved items, and your own mixes live here. Listening choices are yours; mastery still comes from what you can actually retrieve and use.</p>
        </div>
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
              <div className="library-row" key={p.id}>
                <div>
                  <strong>{p.name}</strong>
                  <span>{p.playlist_type} · {p.playback_mode}</span>
                </div>
                <span>›</span>
              </div>
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
            {(favorites ?? []).length > 0 ? favorites!.map((f: any) => (
              <div className="library-row" key={f.content_item_id}>
                <div>
                  <strong>{f.content_item?.title ?? 'Saved content'}</strong>
                  <span>{f.content_item?.content_type?.replaceAll('_', ' ')}</span>
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
