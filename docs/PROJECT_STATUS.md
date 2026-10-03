# Borao — Development Checkpoint

**Stage:** Prototype  
**Release:** v0.8 — build-verified + regression-test hardened  
**Environment:** GitHub `main` + live `spanish-learning-dev` Supabase; Vercel preview not yet created  
**Working brand:** Borao (replaceable)

## Proven now
- Full Next.js source is authoritative in GitHub.
- Reproducible `package-lock.json` is committed and CI uses `npm ci`.
- TypeScript typecheck and Next.js production build pass in GitHub Actions.
- Automated learning-engine regression tests cover scoring normalization, choice scoring, prefix/infinitive production scoring, empty responses, evidence weighting, hint penalties, strengthened production evidence, and recommendation ranking.
- Email confirmation redirects are constrained to internal application paths; external/protocol-relative redirect attempts fall back safely.
- Required public Supabase environment variables are validated explicitly before client creation.
- Manual deployed-preview smoke workflow can verify health, root rendering, and login rendering against any preview URL.
- Live Supabase schema has RLS and least-privilege table grants.
- 100 governed Beginner 1 concepts exist in the live development database; 3 published, 97 draft.
- Lesson 001 is published with 11 spoken segments and 4 assessments.
- Lesson 002 (`Wait — say that again.`) is authored with 11 spoken segments and 4 assessments; held at language-QA status.
- Server/database owns correctness scoring, evidence creation, derived mastery state, and reason-coded recommendations.
- Signed-in Today reads real evidence/mastery/recommendation data.
- Onboarding captures goal, preferred genres, usage modes, and English-support level.
- Learner content progress supports lesson resume without inventing mastery evidence.
- Completion closes open recommendations for completed content.
- `/api/health` exists for deployment checks.

## Current product path
`signup → confirm → onboarding → Today → recommended/resumed lesson → assessment → evidence → concept state → recommendation → completion`

## Security posture
Authenticated learners have direct table writes only where intentionally allowed: their own profile update and favorites. Evidence, mastery state, recommendations, billing/entitlements, and content progress are not directly client-writable.

Three Supabase advisor warnings remain for intentionally authenticated `SECURITY DEFINER` RPCs: exposure recording, assessment submission, and content-progress save. Each validates `auth.uid()` and eligible published content before writing. Before Staging, either formally test/accept this API boundary or move privileged writes behind a private server-only service path.

## Current blockers
- No personal-team Vercel preview exists yet.
- Supabase Auth preview redirect/site URL is not yet configured against a deployed origin.
- Authenticated browser E2E has not yet been executed against a deployed preview; the development project currently has zero auth users, so the first real signup is the next test-enabling event.
- Content Block 02 remains language/pedagogical QA-only.
- Privileged RPC live audit is documented in `docs/STAGING_SECURITY_GATE.md`; current controls are strong enough to justify tamper-testing before any redesign. Staging acceptance still requires authenticated tamper tests.
- GitHub currently reports the repository as public; it should be changed to Private before broader work continues.

## Next gate — Prototype → Staging
- Personal Vercel preview outside Marked Matter.
- Preview smoke workflow passes.
- Real signup/email-confirm/onboarding browser test.
- Resume test across interrupted lesson.
- Assessment-tampering test.
- Evidence → concept state → recommendation E2E verification.
- Clean replay of migrations on a fresh database.
- Explicit decision on privileged write functions.

## Next 3 actions
1. Create/import the personal Vercel preview and configure the two public Supabase environment values.
2. Run preview smoke + authenticated E2E and fix runtime defects.
3. Test the privileged RPC boundary and complete Content Block 02 QA before promotion to Staging.
