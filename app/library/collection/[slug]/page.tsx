import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  isAccessSatisfied,
  type AccessContext,
  type AccessRule,
  type PathState,
  type UnitState,
} from '@/lib/progression/access'
import AppNav from '@/components/app/AppNav'
import CollectionTrackList from '@/components/library/CollectionTrackList'

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const { data: collection, error: collectionError } = await supabase
    .from('content_collections')
    .select('id,slug,title,collection_type,description,release_order')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (collectionError || !collection) notFound()

  const [
    { data: items, error: itemError },
    { data: unitStates },
    { data: pathStates },
    { data: unlocks },
  ] = await Promise.all([
    supabase
      .from('collection_items')
      .select('content_item_id,position,item_role,access_rule,required_unit_id,required_path_id,content_item:content_items(title,content_type)')
      .eq('collection_id', collection.id)
      .order('position', { ascending: true }),
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

  if (itemError) throw new Error(itemError.message)

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

  const rows = items ?? []
  const contentIds = rows.map(row => row.content_item_id)

  const { data: media } = contentIds.length
    ? await supabase
        .from('media_assets')
        .select('id,content_item_id,media_kind,storage_bucket,storage_path,duration_ms')
        .in('content_item_id', contentIds)
        .eq('status', 'ready')
    : { data: [] }

  const mediaByContent = new Map<string, any>()
  for (const asset of media ?? []) {
    if (mediaByContent.has(asset.content_item_id)) continue
    const { data: signed } = await supabase.storage
      .from(asset.storage_bucket)
      .createSignedUrl(asset.storage_path, 60 * 60)

    mediaByContent.set(asset.content_item_id, {
      ...asset,
      playbackUrl: signed?.signedUrl,
    })
  }

  const trackRows = rows.map((row: any) => {
    const unlocked = isAccessSatisfied({
      accessRule: row.access_rule as AccessRule,
      requiredUnitId: row.required_unit_id,
      requiredPathId: row.required_path_id,
      contentItemId: row.content_item_id,
      collectionId: collection.id,
    }, accessContext)

    const asset = mediaByContent.get(row.content_item_id)

    return {
      contentItemId: row.content_item_id,
      position: row.position,
      title: row.content_item?.title ?? `Track ${row.position}`,
      subtitle: row.content_item?.content_type?.replaceAll('_', ' ') ?? 'audio',
      itemRole: row.item_role,
      unlocked,
      mediaId: asset?.id ?? null,
      playbackUrl: asset?.playbackUrl ?? null,
      durationMs: asset?.duration_ms ?? null,
    }
  })

  const unlockedCount = trackRows.filter(track => track.unlocked).length
  const allUnlocked = trackRows.length > 0 && unlockedCount === trackRows.length

  return (
    <main className="product-shell app-surface">
      <AppNav active="library" />

      <section className="collection-hero">
        <div className="record-art collection-art" aria-hidden="true">
          <span>{String(collection.release_order + 1).padStart(2, '0')}</span>
          <b>{collection.collection_type === 'album' ? 'ALBUM' : 'SERIES'}</b>
        </div>
        <div>
          <p className="eyebrow">{collection.collection_type.toUpperCase()}</p>
          <h1>{collection.title}</h1>
          {collection.description && <p className="lede">{collection.description}</p>}
          <div className="collection-status-row">
            <span>{unlockedCount} of {trackRows.length} unlocked</span>
            {allUnlocked && <b>Full release open</b>}
          </div>
        </div>
      </section>

      <CollectionTrackList items={trackRows} />

      <section className="collection-footnote">
        <p>Unlocking a track gives you access to the music. Core readiness still comes from what you can understand and use.</p>
      </section>
    </main>
  )
}
