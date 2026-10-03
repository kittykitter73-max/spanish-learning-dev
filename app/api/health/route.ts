export const runtime = 'nodejs'

export async function GET() {
  return Response.json({
    ok: true,
    service: 'spanish-learning-web',
    version: '0.5',
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
  })
}
