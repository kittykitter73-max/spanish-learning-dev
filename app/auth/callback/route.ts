import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeInternalPath } from '@/lib/navigation'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = safeInternalPath(url.searchParams.get('next'), '/onboarding')

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=Missing authentication code.', request.url)
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      new URL('/login?error=Could not complete account confirmation.', request.url)
    )
  }

  return NextResponse.redirect(new URL(next, request.url))
}
