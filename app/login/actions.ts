'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function requestOrigin() {
  const h = await headers()
  const forwardedHost = h.get('x-forwarded-host')
  const host = forwardedHost ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https')

  if (!host) {
    throw new Error('Unable to determine application origin for authentication redirect.')
  }

  return `${proto}://${host}`
}

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)
  redirect('/today')
}

export async function signup(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const supabase = await createClient()
  const origin = await requestOrigin()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
    },
  })

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)
  redirect('/login?message=Check your email to confirm your account, then continue onboarding.')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}


export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const supabase = await createClient()
  const origin = await requestOrigin()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
      shouldCreateUser: false,
    },
  })

  if (error) redirect(`/magic-login?error=${encodeURIComponent(error.message)}`)
  redirect('/magic-login?message=Check your email for a secure sign-in link.')
}
