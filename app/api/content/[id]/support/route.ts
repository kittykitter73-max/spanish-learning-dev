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

  const { data: content, error: contentError } = await supabase
    .from('content_items')
    .select('id,title,content_type,status,rights_status')
    .eq('id', id)
    .eq('status', 'published')
    .in('rights_status', ['internal', 'licensed', 'cleared'])
    .maybeSingle()

  if (contentError || !content) {
    return NextResponse.json({ error: 'Content is not available.' }, { status: 404 })
  }

  if (content.content_type !== 'spoken_lesson') {
    return NextResponse.json({
      kind: 'none',
      title: content.title,
      lines: [],
    })
  }

  const { data: segments, error: segmentError } = await supabase
    .from('spoken_lesson_segments')
    .select('sequence_number,text_es,text_en,speaker:speakers(slug,character:characters(display_name))')
    .eq('content_item_id', id)
    .order('sequence_number', { ascending: true })

  if (segmentError) {
    return NextResponse.json({ error: 'Transcript could not be loaded.' }, { status: 502 })
  }

  return NextResponse.json({
    kind: 'transcript',
    title: content.title,
    lines: (segments ?? []).map((segment: any) => ({
      sequence: segment.sequence_number,
      speaker: segment.speaker?.character?.display_name ?? segment.speaker?.slug ?? null,
      es: segment.text_es,
      en: segment.text_en,
    })),
  })
}
