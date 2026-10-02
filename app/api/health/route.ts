export const runtime = 'nodejs'

export async function GET() {
  return Response.json({ ok: true, service: 'spanish-learning-web', version: '0.5' })
}
