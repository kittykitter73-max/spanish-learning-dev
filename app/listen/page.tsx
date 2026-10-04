import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/app/AppNav'

export default async function ListenPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const [{ data: media }, { data: publishedContent }] = await Promise.all([
    supabase
      .from('media_assets')
      .select('id,media_kind,duration_ms,content_item_id,content_item:content_items(title,content_type)')
      .eq('status', 'ready')
      .order('created_at', { ascending: false }),
    supabase
      .from('content_items')
      .select('id,title,content_type')
      .eq('status', 'published')
      .in('rights_status', ['internal','licensed','cleared'])
      .order('published_at', { ascending: false }),
  ])

  const readyMedia = media ?? []
  const content = publishedContent ?? []

  return (
    <main className="product-shell app-surface">
      <AppNav active="listen" />

      <section className="surface-hero">
        <div>
          <p className="eyebrow">LISTEN</p>
          <h1>Your Spanish, on play.</h1>
          <p className="lede">Music, spoken episodes, and mixed listening sessions will live here. Borao can teach in the background without turning every minute into a screen exercise.</p>
        </div>
      </section>

      <section className="media-tabs" aria-label="Listen categories">
        <span className="active">For You</span>
        <span>Music</span>
        <span>Episodes</span>
        <span>Mixes</span>
        <span>Drive</span>
      </section>

      {readyMedia.length > 0 ? (
        <section className="media-grid">
          {readyMedia.map((asset: any) => (
            <article className="media-card" key={asset.id}>
              <div className="media-art" aria-hidden="true"><span>▶</span></div>
              <p className="media-type">{asset.media_kind.replaceAll('_', ' ')}</p>
              <h2>{asset.content_item?.title ?? 'Borao audio'}</h2>
              <p>{asset.content_item?.content_type?.replaceAll('_', ' ')}</p>
            </article>
          ))}
        </section>
      ) : (
        <section className="card media-empty">
          <p className="eyebrow">PLAYER FOUNDATION READY</p>
          <h2>The library is waiting for its first real audio.</h2>
          <p>We have published curriculum content, but no learner-safe audio asset has been marked ready yet. This is intentional: Borao will not pretend text is listening practice.</p>
          <div className="media-preview-row">
            {content.slice(0, 3).map(item => (
              <div className="media-preview" key={item.id}>
                <span>{item.content_type.replaceAll('_', ' ')}</span>
                <strong>{item.title}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="now-playing-placeholder">
        <div>
          <span className="tiny">NOW PLAYING</span>
          <strong>Nothing queued yet</strong>
        </div>
        <button disabled aria-disabled="true">Play</button>
      </section>
    </main>
  )
}
