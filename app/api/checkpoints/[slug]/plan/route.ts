import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildReadyCheckRuntime } from '@/lib/learning/ready-check-server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const runtime = await buildReadyCheckRuntime(supabase, userId, slug)
  if (!runtime) {
    return NextResponse.json({ error: 'Ready Check not available.' }, { status: 404 })
  }

  return NextResponse.json({
    checkpoint: runtime.checkpoint,
    attemptId: runtime.attemptId,
    status: runtime.plan.currentStatus,
    satisfiedCount: runtime.plan.satisfiedRequirementKeys.length,
    unresolvedCount: runtime.plan.unresolvedRequirementKeys.length,
    technicalIssueCount: runtime.plan.technicalIssueKeys.length,
    canRunNow: runtime.canRunNow,
    unavailableReason: runtime.unavailableReason,
    items: runtime.items,
  })
}
