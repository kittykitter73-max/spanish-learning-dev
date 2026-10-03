import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LearnClient from '@/components/learn/LearnClient'
import AppNav from '@/components/app/AppNav'
import type { AssessmentItem } from '@/lib/learning/assessment'

type SearchParams = Promise<{ content?: string }>

export default async function LearnPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  let contentId = params.content ?? null

  if (!contentId) {
    const { data: recommendation } = await supabase
      .from('recommendations')
      .select('content_item_id')
      .eq('learner_id', userId)
      .is('consumed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    contentId = recommendation?.content_item_id ?? null
  }

  let contentQuery = supabase
    .from('content_items')
    .select('id,slug,title,content_type')
    .eq('status', 'published')
    .in('rights_status', ['internal', 'licensed', 'cleared'])

  contentQuery = contentId
    ? contentQuery.eq('id', contentId)
    : contentQuery.eq('slug', 'audio-lesson-001-quiero-tengo-que-voy-a')

  const { data: item, error: itemError } = await contentQuery.single()
  if (itemError || !item) throw new Error(itemError?.message ?? 'Recommended lesson not found')

  const [{ data: segmentRows, error: segmentError }, { data: assessmentRows, error: assessmentError }] =
    await Promise.all([
      supabase
        .from('spoken_lesson_segments')
        .select(`
          id,sequence_number,segment_type,text_es,text_en,
          speaker:speakers(slug,character:characters(display_name))
        `)
        .eq('content_item_id', item.id)
        .order('sequence_number', { ascending: true }),
      supabase
        .from('assessment_items')
        .select(`
          id,slug,concept_id,prompt,item_type,evidence_type,options,
          scoring_strategy,scoring_rules,hint_level,sequence_number,
          stage_label,support_text,success_feedback,failure_feedback
        `)
        .eq('content_item_id', item.id)
        .eq('status', 'published')
        .order('sequence_number', { ascending: true }),
    ])

  if (segmentError) throw new Error(segmentError.message)
  if (assessmentError) throw new Error(assessmentError.message)

  const segments = segmentRows ?? []
  const assessments = (assessmentRows ?? []) as AssessmentItem[]

  if (segments.length === 0) throw new Error('Published lesson is missing spoken segments')
  if (assessments.length < 4) throw new Error('Published lesson is missing required assessment steps')

  const { data: progress } = await supabase
    .from('learner_content_progress')
    .select('current_stage,completed_at')
    .eq('learner_id', userId)
    .eq('content_item_id', item.id)
    .maybeSingle()

  const initialStage = progress?.completed_at ? 'scene' : (progress?.current_stage ?? 'scene')

  return (
    <main className="product-shell">
      <AppNav active="learn" />
      <LearnClient lesson={{ id: item.id, title: item.title, segments: segments as any, assessments }} initialStage={initialStage as any} />
    </main>
  )
}
