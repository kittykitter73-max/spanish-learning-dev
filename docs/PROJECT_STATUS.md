# Borao — Development Checkpoint

**Stage:** Prototype  
**Release:** v0.5 — customer journey + resumable learning  
**Environment:** local Next.js source + live `spanish-learning-dev` Supabase  
**Working brand:** Borao (replaceable)

## Proven now
- Live Supabase schema with RLS and least-privilege table grants.
- 100 governed Beginner 1 concepts in the live development database; 3 published, 97 draft.
- Lesson 001 published with 11 spoken segments and 4 assessments.
- Lesson 002 (`Wait — say that again.`) authored with 11 spoken segments and 4 assessments; held at language-QA status.
- Server/database owns correctness scoring, evidence creation, derived mastery state, and reason-coded recommendation records.
- Assessment feedback/support is content-authored rather than hard-coded in the React lesson engine.
- Spanish leading/trailing question/exclamation punctuation is normalized in exact-response scoring.
- Signed-in Today surface reads real evidence/mastery/recommendation data.
- New-user onboarding captures goal, preferred genres, usage modes, and English-support level.
- Learner content progress is separately tracked so lessons can resume without changing learning evidence.
- Completion closes open recommendations for that content.
- `/api/health` exists for deployment checks.

## Current product path
`signup → confirm → onboarding → Today → recommended/resumed lesson → assessment → evidence → concept state → recommendation → completion`

## Security posture
Authenticated learners have direct table writes only where intentionally allowed: their own profile update and favorites. Evidence, mastery state, recommendations, billing/entitlements, and content progress are not directly client-writable.

Three Supabase advisor warnings remain for intentionally authenticated `SECURITY DEFINER` RPCs: exposure recording, assessment submission, and content-progress save. Each validates `auth.uid()` and eligible published content before writing. Before Staging, either formally test/accept this API boundary or move privileged writes behind a private server-only service path.

## Current blockers
- This execution runtime cannot complete `npm install`; registry access times out.
- Therefore the actual Next.js production build/typecheck/browser E2E is not yet verified.
- Connected Vercel tooling currently exposes project/deployment reads but not project creation/deploy writes for a new source tree.
- Connected GitHub tooling can write into an existing repository but does not expose repository creation; no personal Borao repository exists yet.

## Next gate — Prototype → Staging
- Clean dependency install and lockfile.
- `next build` passes.
- Personal Vercel preview outside Marked Matter.
- Real signup/email-confirm/onboarding test.
- Resume test across interrupted lesson.
- Assessment-tampering test.
- Evidence → concept state → recommendation E2E verification.
- Clean replay of migrations on a fresh database.
- Decide production approach for privileged write functions.

## Next 3 actions
1. Get the source into a network-enabled build/deploy path and obtain a real preview URL.
2. Run authenticated end-to-end tests and fix build/runtime defects.
3. Complete language + pedagogical QA for Content Block 02, then publish it and make recommendation selection span more than one lesson.


## v0.6 checkpoint
- Rule-based multi-content recommendation selector is live in development.
- Onboarding now seeds the first recommendation.
- Evidence refreshes the next recommendation automatically.
- Content Block 02 remains QA-only.
- Core learning TypeScript compiles independently with the available compiler.
- Deployment checklist added.
- Full Next install/build is still blocked by registry access in this runtime.
