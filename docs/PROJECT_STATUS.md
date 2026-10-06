# Borao — Development Checkpoint

**Stage:** Prototype  
**Release:** v0.13 — curriculum reconciliation + Ready Check foundation  
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
Authenticated learners have direct table writes only where intentionally allowed: their own profile update, favorites, playlists/playlist items, media-resume state, and the `seen_at` acknowledgement column on their own unlock rows. They cannot insert unlocks or retarget an existing unlock. Evidence, mastery state, recommendations, billing/entitlements, and governed content progress remain outside arbitrary client control.

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
- Static database security-boundary assertions pass, and a simulated second authenticated JWT cannot read or mutate the real learner's private rows. A second real browser account is still required for full Auth + cookie + RLS E2E before Staging.
- Clean replay of the full migration history on a fresh database remains outstanding.
- Curriculum v1.2 and Arc 01 v0.3 remain internally revised drafts pending external teacher/native review and approved audio.
- No learner-safe audio asset is marked `ready` yet, so the player infrastructure is build-verified but the real sound loop is not yet proven with an approved file.
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
1. Finish the server-side Ready Check adapter against approved item/audio records; keep the v0.3 draft bank unpublishable until external review.
2. Attach the first approved Arc 01 song/episode assets and prove real playback, listening evidence, resume, and adaptive check flow.
3. Create a second disposable learner for cross-user isolation, replay migrations on a fresh database, then make the Prototype → Staging decision.


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


## Audio app capabilities — v0.11
- Persistent player now supports queue order, previous/next, auto-advance, seek/progress, duration display, and Media Session controls where the browser supports them.
- Visible audio is pre-signed on the server so mobile browsers can start playback immediately from a user gesture; authenticated signed-URL fallback remains available.
- Meaningful listening—not a Play tap—records low-strength exposure through the existing governed evidence RPC.
- Learner audio position is stored separately from mastery and can resume interrupted listening.
- Spoken episodes can expose an on-demand transcript/support drawer; Spanish remains primary and English support stays optional.
- Listen supports favorites and adding playable content to learner-owned playlists.
- Playlist detail pages resolve approved media into a playable shared queue.
- Drive mode provides a low-distraction large-control listening surface and is protected by authentication.
- Vercel project Node runtime is aligned to the repo's Node 22 requirement.
- Player queue and exposure-threshold primitives are regression tested.
- Deployed smoke coverage now includes protected app/audio-state routes and unauthenticated media boundaries.

## Audio data boundaries
- `learner_media_progress` owns playback position/completion only; it does not contribute mastery evidence.
- `learner_evidence_events` remains the learning-evidence history.
- `media_assets` remains the approved media registry.
- `learning-media` remains a private Storage bucket protected by RLS and signed playback URLs.


## Progression & rewards — v0.12
- Canon now includes `docs/UX_TIMING_AND_CONTENT_FORMAT_CONTRACT.md` and `docs/PROGRESSION_REWARDS_AND_UNLOCKS.md`.
- Motivation model is music-native: content/game/capability unlocks, not XP, coins, hearts, streak punishment, or leaderboards.
- `content_collections` represents albums and spoken series without making collections the source of mastery.
- `collection_items` supports starter, core, bonus, alternate, and preview content with explicit access rules.
- `game_mechanics` + `game_unlock_rules` support progressive Play-surface reveals.
- `learner_unlocks` records durable content/collection/game/feature rewards separately from mastery.
- Library now has a Record Shelf surface and generic album/series detail route with locked/unlocked track states.
- Home can surface one restrained unseen unlock moment at a time.
- Play reads progressive game-unlock state when approved game definitions exist.
- Progression helpers are regression-tested separately from learning/mastery logic.

## Progression security boundary
- Album/game unlocks do not create learning evidence.
- Unlock rows cannot be inserted directly by learners.
- Learners may update only `learner_unlocks.seen_at`; they cannot alter the rewarded content/game/collection target.
- Ready media belonging to a published collection is gated by the same access rules at both `media_assets` RLS and private Storage RLS.
- Starter content can use `immediate`; later tracks can use unit/path readiness rules or explicit reward grants.
- Existing published content that is not assigned to a collection remains accessible so the current prototype flow is not broken.

## UX thread boundary
- This thread owns app UX, progression presentation, player/library/game surfaces, access enforcement, tests, deployment, and release quality.
- Curriculum/content authoring remains upstream in the curriculum thread.
- App code consumes the Master Curriculum and `docs/CORE_ARC_01_PRODUCTION_PACK.md` as read-only product inputs and flags upstream gaps rather than rewriting them here.


## Curriculum reconciliation + Ready Check — v0.13
- The live development database now has one QA-only Core path with ten learner-facing chapters aligned to curriculum v1.2.
- All existing C001–C100 concepts are assigned exactly once to a Core chapter through `unit_concepts`; existing concept IDs and learner evidence were preserved.
- Core/chapter structure is QA-only and is not learner-published merely because the internal curriculum revision exists.
- The stale UX timing contract is reconciled to Master Curriculum v1.2 / Arc 01 v0.3: one coherent 24-turn story, optional active-practice prompts, adaptive Ready Check, no artificial Chapter A/B split.
- Learner-visible assessment payloads no longer include `scoring_strategy` or `scoring_rules`; answer keys remain server-side.
- Static security-boundary assertions cover evidence/mastery/recommendation writes, unlock retargeting, assessment keys, and Ready Check evaluator tables.
- Arc 01 has a QA-only `Ready Check` definition with 14 explicit evidence requirements: paired listening + generated use for six critical frames, three-context manipulation evidence for C090, and one held-out practical adjustment.
- Ready Check result storage, internal evaluator snapshots, and item-use novelty history are separated so learners can eventually see their own result summary without seeing hidden scoring criteria.
- A deterministic readiness evaluator distinguishes `ready`, `needs_more_evidence`, and `technical_issue`; technical failures are not language failures.
- An approval-gated adaptive selector chooses the smallest useful fresh probe set, prioritizes production before matching listening, respects prior reveals/priming, and caps the initial probe set.
- Ready Check evidence can now reuse valid prior learner evidence instead of retesting everything; exposure/recognition alone do not satisfy stronger readiness dimensions.
- The combined Ready Check planner turns existing evidence + unresolved requirements + approved candidates into the smallest next probe set, and selects nothing when readiness is already established.
- Learners may safely start one open attempt for their own published checkpoint using only learner_id + checkpoint_id; they cannot choose status/result fields, update results, or start QA-only checkpoints.
- A live publication-guard regression confirms the current Arc 01 QA checkpoint cannot be started by the authenticated learner.
- A repeatable RLS isolation simulation confirms a different authenticated JWT subject cannot see or mutate the existing learner's evidence, mastery, recommendations, progress, media progress, or playlists.
- The selector refuses draft/QA content, so the current internally revised Arc 01 item bank cannot accidentally become a live assessment.
- New Ready Check foreign keys have covering indexes; existing unused-index notices remain informational and are not being removed prematurely.

## Remaining v0.13 release blockers
- No externally approved learner audio is marked `ready`; the real sound → prompt → evidence loop is still unproven.
- Arc 01 scripts/item bank require external teacher/native review and final audio/rights checks before publication.
- The Ready Check persistence/evaluator/planner and safe attempt-start boundary exist, but the production server adapter that records approved item uses, scores responses, and writes server-owned attempt results is not yet connected.
- True cross-user RLS isolation still requires a second disposable auth learner.
- Interrupted lesson/audio resume should be re-proven in the real browser after the current changes.
- Full migration history still needs a clean replay on a fresh database before Staging.
