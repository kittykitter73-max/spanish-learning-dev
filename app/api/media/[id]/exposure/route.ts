import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { data: asset, error: assetError } = await supabase
    .from('media_assets')
    .select('id,content_item_id,status')
    .eq('id', id)
    .eq('status', 'ready')
    .maybeSingle()

  if (assetError || !asset) {
    return NextResponse.json({ error: 'Audio is not available.' }, { status: 404 })
  }

  const { error: exposureError } = await supabase.rpc('record_content_exposure', {
    p_content_item_id: asset.content_item_id,
  })

  if (exposureError) {
    return NextResponse.json({ error: 'Exposure could not be recorded.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
