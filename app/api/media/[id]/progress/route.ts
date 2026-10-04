import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const positionSeconds = Number(body?.positionSeconds)
  const completed = Boolean(body?.completed)

  if (!Number.isFinite(positionSeconds) || positionSeconds < 0) {
    return NextResponse.json({ error: 'Invalid playback position.' }, { status: 400 })
  }

  const { data: asset, error: assetError } = await supabase
    .from('media_assets')
    .select('id')
    .eq('id', id)
    .eq('status', 'ready')
    .maybeSingle()

  if (assetError || !asset) {
    return NextResponse.json({ error: 'Audio is not available.' }, { status: 404 })
  }

  const { error } = await supabase
    .from('learner_media_progress')
    .upsert({
      learner_id: userId,
      media_asset_id: id,
      position_ms: completed ? 0 : Math.round(positionSeconds * 1000),
      completed_at: completed ? new Date().toISOString() : null,
      last_played_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'learner_id,media_asset_id',
    })

  if (error) {
    return NextResponse.json({ error: 'Playback position could not be saved.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
