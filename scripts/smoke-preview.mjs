const base = (process.env.BASE_URL ?? '').replace(/\/$/, '')
if (!base) {
  console.error('BASE_URL is required, for example https://example.vercel.app')
  process.exit(2)
}

async function expect(path, check, options = {}) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual', ...options })
  const body = await response.text()
  const result = check(response, body)
  if (!result.ok) {
    console.error(`FAIL ${path}: ${result.message}`)
    process.exitCode = 1
    return
  }
  console.log(`PASS ${path}: ${result.message}`)
}

await expect('/api/health', (response, body) => {
  let payload
  try { payload = JSON.parse(body) } catch {}
  return response.ok && payload?.ok === true
    ? { ok: true, message: `HTTP ${response.status}, health ok` }
    : { ok: false, message: `HTTP ${response.status}, body=${body.slice(0, 200)}` }
})

await expect('/', (response, body) =>
  response.ok && body.trim().length > 0
    ? { ok: true, message: `HTTP ${response.status}, rendered content` }
    : { ok: false, message: `HTTP ${response.status}, empty or failed response` }
)

await expect('/login', (response, body) =>
  response.ok && /sign|login|email/i.test(body)
    ? { ok: true, message: `HTTP ${response.status}, login surface rendered` }
    : { ok: false, message: `HTTP ${response.status}, login markers missing` }
)

await expect('/signup', (response, body) =>
  response.ok && /create account|start learning|email/i.test(body)
    ? { ok: true, message: `HTTP ${response.status}, signup surface rendered` }
    : { ok: false, message: `HTTP ${response.status}, signup markers missing` }
)

await expect('/magic-login', (response, body) =>
  response.ok && /sign-in link|without a password|email/i.test(body)
    ? { ok: true, message: `HTTP ${response.status}, passwordless login surface rendered` }
    : { ok: false, message: `HTTP ${response.status}, passwordless markers missing` }
)

await expect('/today', (response) => {
  const location = response.headers.get('location') ?? ''
  return [301, 302, 303, 307, 308].includes(response.status) && location.includes('/login')
    ? { ok: true, message: `HTTP ${response.status}, unauthenticated user redirected to login` }
    : { ok: false, message: `HTTP ${response.status}, location=${location || '(none)'}` }
})

await expect('/manifest.webmanifest', (response, body) => {
  let payload
  try { payload = JSON.parse(body) } catch {}
  return response.ok && payload?.name === 'Borao' && payload?.display === 'standalone'
    ? { ok: true, message: `HTTP ${response.status}, install manifest rendered` }
    : { ok: false, message: `HTTP ${response.status}, invalid manifest` }
})

for (const path of ['/listen', '/play', '/speak', '/library', '/drive']) {
  await expect(path, (response) => {
    const location = response.headers.get('location') ?? ''
    return [301, 302, 303, 307, 308].includes(response.status) && location.includes('/login')
      ? { ok: true, message: `HTTP ${response.status}, protected app surface redirects to login` }
      : { ok: false, message: `HTTP ${response.status}, location=${location || '(none)'}` }
  })
}

await expect('/api/media/00000000-0000-0000-0000-000000000000', (response, body) => {
  return response.status === 401 && /authentication required/i.test(body)
    ? { ok: true, message: `HTTP ${response.status}, media signing requires authentication` }
    : { ok: false, message: `HTTP ${response.status}, body=${body.slice(0, 120)}` }
})

await expect('/api/media/00000000-0000-0000-0000-000000000000/exposure', (response, body) => {
  return response.status === 401 && /authentication required/i.test(body)
    ? { ok: true, message: `HTTP ${response.status}, listening exposure requires authentication` }
    : { ok: false, message: `HTTP ${response.status}, body=${body.slice(0, 120)}` }
}, { method: 'POST' })

await expect('/api/media/00000000-0000-0000-0000-000000000000/progress', (response, body) => {
  return response.status === 401 && /authentication required/i.test(body)
    ? { ok: true, message: `HTTP ${response.status}, media progress requires authentication` }
    : { ok: false, message: `HTTP ${response.status}, body=${body.slice(0, 120)}` }
}, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ positionSeconds: 0, completed: false }),
})

await expect('/api/content/00000000-0000-0000-0000-000000000000/support', (response, body) => {
  return response.status === 401 && /authentication required/i.test(body)
    ? { ok: true, message: `HTTP ${response.status}, support text requires authentication` }
    : { ok: false, message: `HTTP ${response.status}, body=${body.slice(0, 120)}` }
})

await expect('/auth/callback', (response) => {
  const location = response.headers.get('location') ?? ''
  return [301, 302, 303, 307, 308].includes(response.status) && location.includes('/login?error=')
    ? { ok: true, message: `HTTP ${response.status}, missing auth code fails safely` }
    : { ok: false, message: `HTTP ${response.status}, location=${location || '(none)'}` }
})

if (process.exitCode) process.exit(process.exitCode)
