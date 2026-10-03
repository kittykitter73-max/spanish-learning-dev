export type PublicSupabaseEnv = {
  url: string
  publishableKey: string
}

function requirePublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Configure the Borao Supabase development values before starting or deploying the app.`
    )
  }
  return value
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  return {
    url: requirePublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    publishableKey: requirePublicEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
  }
}
