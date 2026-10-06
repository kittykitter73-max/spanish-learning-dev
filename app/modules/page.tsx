import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/app/AppNav'

export default async function ModulesPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const [
    { data: paths },
    { data: corePath },
  ] = await Promise.all([
    supabase
      .from('learning_paths')
      .select('id,slug,title,description,sort_order')
      .eq('path_kind', 'elective')
      .eq('status', 'published')
      .order('sort_order', { ascending: true }),
    supabase
      .from('learning_paths')
      .select('id,title')
      .eq('path_kind', 'core')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  let coreComplete = false
  if (corePath?.id) {
    const { data: coreState } = await supabase
      .from('learner_path_state')
      .select('status')
      .eq('learner_id', userId)
      .eq('path_id', corePath.id)
      .maybeSingle()

    coreComplete = coreState?.status === 'completed'
  }

  return (
    <main className="product-shell app-surface">
      <AppNav active="library" />

      <section className="surface-hero compact">
        <div>
          <p className="eyebrow">MODULES</p>
          <h1>Choose what your Spanish becomes useful for.</h1>
          <p className="lede">
            Core builds the shared foundation. After that, Borao opens into focused paths
            for the parts of life you actually care about.
          </p>
        </div>
      </section>

      <section className="module-unlock-banner">
        <div>
          <span>{coreComplete ? 'CORE COMPLETE' : 'AFTER CORE'}</span>
          <strong>{coreComplete ? 'Your elective paths are open.' : 'Finish Core, then choose your direction.'}</strong>
        </div>
        <Link href="/today">{coreComplete ? 'Back home' : 'Continue Core'}</Link>
      </section>

      {(paths ?? []).length > 0 ? (
        <section className="module-grid">
          {paths!.map(path => (
            <article className={`module-card ${coreComplete ? 'available' : 'locked'}`} key={path.id}>
              <span>{coreComplete ? 'AVAILABLE' : 'LOCKED UNTIL CORE'}</span>
              <h2>{path.title}</h2>
              <p>{path.description ?? 'A focused Spanish path built on your Core foundation.'}</p>
              <button type="button" disabled={!coreComplete}>
                {coreComplete ? 'Choose module' : 'Finish Core first'}
              </button>
            </article>
          ))}
        </section>
      ) : (
        <section className="card module-empty">
          <p className="eyebrow">CHOICE LAYER READY</p>
          <h2>The module shelf is built. The first elective paths are waiting on curriculum approval.</h2>
          <p>
            When Travel, Social Spanish, Family & Home, Work, Slang, regional packs, and
            other electives are published, they will appear here automatically without
            changing the app architecture.
          </p>
        </section>
      )}
    </main>
  )
}
