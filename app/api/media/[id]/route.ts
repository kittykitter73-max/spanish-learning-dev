import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
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

  const { data: asset, error } = await supabase
    .from('media_assets')
    .select('id,storage_bucket,storage_path,status,media_kind,content_item:content_items(title)')
    .eq('id', id)
    .eq('status', 'ready')
    .maybeSingle()

  if (error || !asset) {
    return NextResponse.json({ error: 'Audio is not available.' }, { status: 404 })
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(asset.storage_bucket)
    .createSignedUrl(asset.storage_path, 60 * 15)

  if (signError || !signed?.signedUrl) {
    return NextResponse.json({ error: 'Could not prepare audio playback.' }, { status: 502 })
  }

  return NextResponse.json({
    id: asset.id,
    url: signed.signedUrl,
    expiresIn: 60 * 15,
    mediaKind: asset.media_kind,
    title: (asset.content_item as any)?.title ?? 'Borao audio',
  })
}
