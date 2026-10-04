# Borao — Development Checkpoint

**Stage:** Prototype  
**Release:** v0.10 — mobile app shell + audio-first foundation  
**Environment:** GitHub `main` + live `spanish-learning-dev` Supabase + live Vercel project `spanish-learning-dev-soqq`  
**Working brand:** Borao (replaceable)

## Proven now
- Full Next.js source is authoritative in GitHub.
- Reproducible `package-lock.json` is committed and CI uses `npm ci`.
- TypeScript typecheck and Next.js production build pass in GitHub Actions.
- Automated learning-engine regression tests cover scoring normalization, choice scoring, prefix/infinitive production scoring, empty responses, evidence weighting, hint penalties, strengthened production evidence, and recommendation ranking.
- Email confirmation redirects are constrained to internal application paths; external/protocol-relative redirect attempts fall back safely.
- Required public Supabase environment variables are validated explicitly before client creation.
- Exact-commit deployed smoke workflow verifies health, auth surfaces, protected app routes, and install manifest.
- Live Supabase schema has RLS and least-privilege table grants.
- 100 governed Beginner 1 concepts exist in the live development database; 3 published, 97 draft.
- Lesson 001 is published with 11 spoken segments and 4 assessments.
- Lesson 002 (`Wait — say that again.`) is authored with 11 spoken segments and 4 assessments; held at language-QA status.
- Server/database owns correctness scoring, evidence creation, derived mastery state, and reason-coded recommendations.
- Signed-in Today reads real evidence/mastery/recommendation data.
- Onboarding captures goal, preferred genres, usage modes, and English-support level.
- Learner content progress supports lesson resume without inventing mastery evidence.
- Completion refreshes the learner's next recommendation instead of leaving the journey stranded.
- `/api/health` exists for deployment checks.

## Current product path
`signup → confirm → onboarding → Home → Listen / Play / Speak / Library → recommended content → assessment → evidence → concept state → recommendation → completion`

## Security posture
Authenticated learners have direct table writes only where intentionally allowed: their own profile update and favorites. Evidence, mastery state, recommendations, billing/entitlements, and content progress are not directly client-writable.

Three Supabase advisor warnings remain for intentionally authenticated `SECURITY DEFINER` RPCs: exposure recording, assessment submission, and content-progress save. Each validates `auth.uid()` and eligible published content before writing. Before Staging, either formally test/accept this API boundary or move privileged writes behind a private server-only service path.

## Deployment status
- Production alias: `https://spanish-learning-dev-soqq.vercel.app`.
- Environment variables are present; the initial missing-Supabase-env runtime failure is resolved.
- Automated deployed smoke tests pass against the exact Git commit under test.
- Verified live routes:
  - `/api/health` → HTTP 200
  - `/` → HTTP 200
  - `/login` → HTTP 200
  - unauthenticated `/today` → redirects to login
  - `/auth/callback` without a code → fails safely back to login
- Health now reports the deployed Vercel Git SHA so CI cannot accidentally smoke-test a stale release.
- Current Vercel runtime error check reports no new errors on the healthy deployment.

## Current blockers
- Resume-across-interruption has not yet been proven in the real browser flow.
- Authenticated tamper / cross-user isolation tests remain outstanding before Staging promotion.
- Clean replay of the full migration history on a fresh database remains outstanding.
- Content Block 02 remains language/pedagogical QA-only.
- No learner-safe audio asset is marked `ready` yet, so the real player/audio loop is not proven end-to-end with actual sound.
- GitHub currently reports the repository as public; it should be changed to Private before broader work continues.

## Next gate — Prototype → Staging
- Personal Vercel deployment outside Marked Matter. ✅
- Exact-commit deployed smoke workflow passes. ✅
- Real signup/email-confirm/onboarding browser test. ✅
- First real learner completed Lesson 001 end-to-end. ✅
- Evidence → concept state → recommendation E2E verification. ✅
- Resume test across interrupted lesson.
- Assessment-tampering / cross-user isolation tests.
- Clean replay of migrations on a fresh database.
- Explicit decision on privileged write functions.

## Next 3 actions
1. Attach one real learner-safe spoken or music asset and prove the player/queue loop.
2. Run resume + authenticated tamper/isolation tests against the deployed app.
3. Replay migrations on a fresh database, then make the Prototype → Staging decision.


## Audio-first product direction
- Product priority is now music + spoken episodic ("podcast-style") learning + app-native retrieval/speaking interactions.
- The web experience is primarily a development, QA, account, and fallback shell rather than the final center of gravity.
- `media_assets` is now the shared media layer for songs and spoken content.
- Learner-facing copy is media-aware: the app must not claim the learner "heard" or "listened" unless a ready playable audio asset exists.
- Internal recommendation codes remain internal; learner copy translates them into natural next-step language.

## First real learner journey findings
- Real learner signup/auth/onboarding/lesson completion succeeded end-to-end.
- Fixed lesson-load bug caused by an invalid direct PostgREST relationship assumption between `content_items` and `spoken_lesson_segments`.
- Fixed completion sequencing so completing content refreshes the next recommendation instead of leaving no open recommendation.
- Passwordless email sign-in is available as a resilient fallback for development testing.
- Lesson 002 remains in QA; do not publish merely to create more surface area.


## Mobile app shell
- The current Next.js app is now mobile-first and installable as a standalone PWA shell.
- Primary navigation is `Home / Listen / Play / Speak / Library`.
- Listen reads the real `media_assets` readiness state and does not fake playback when audio is absent.
- Library can create real learner-owned playlists in Supabase.
- Play uses the live recommendation/assessment bridge while dedicated game mechanics are built.
- Speak surfaces production/transfer evidence and will become the voice-first interaction area.
- Mobile bottom navigation and safe-area spacing are implemented.
- Native iOS/Android remains deferred until background audio, offline downloads, lock-screen controls, and microphone-heavy use justify a separate native layer.


## Playback security / player contract
- Supabase Storage now has a private `learning-media` bucket.
- Learners can only read storage objects that correspond to a `media_assets` row marked `ready` and attached to published, rights-cleared content.
- The app exposes short-lived signed playback URLs through an authenticated server route.
- A persistent React audio player is mounted at the root layout so playback can survive navigation between app surfaces.
- Listen cards call the signed-playback route; once the first approved media row/file exists, the player path is ready for real audio.
- Deployed smoke coverage verifies the media signing endpoint rejects unauthenticated callers.
