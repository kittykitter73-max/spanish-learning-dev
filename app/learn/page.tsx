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

  let query = supabase
    .from('content_items')
    .select(`
      id,
      slug,
      title,
      content_type,
      spoken_lesson_segments(
        id,sequence_number,segment_type,text_es,text_en,
        speaker:speakers(slug,character:characters(display_name))
      ),
      assessment_items(
        id,slug,concept_id,prompt,item_type,evidence_type,options,
        scoring_strategy,scoring_rules,hint_level,sequence_number,stage_label,support_text,success_feedback,failure_feedback
      )
    `)
    .eq('status', 'published')

  query = contentId ? query.eq('id', contentId) : query.eq('slug', 'audio-lesson-001-quiero-tengo-que-voy-a')
  const { data: item, error } = await query.single()

  if (error || !item) throw new Error(error?.message ?? 'Recommended lesson not found')

  const segments = [...(item.spoken_lesson_segments ?? [])]
    .sort((a: any, b: any) => a.sequence_number - b.sequence_number)
  const assessments = [...(item.assessment_items ?? [])]
    .sort((a: any, b: any) => a.sequence_number - b.sequence_number) as AssessmentItem[]

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
