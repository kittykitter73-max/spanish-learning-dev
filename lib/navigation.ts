export function safeInternalPath(value: string | null | undefined, fallback = '/today') {
  if (!value) return fallback

  const candidate = value.trim()
  if (!candidate.startsWith('/') || candidate.startsWith('//')) return fallback

  try {
    const parsed = new URL(candidate, 'https://borao.invalid')
    if (parsed.origin !== 'https://borao.invalid') return fallback
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}
