# Borao Studio Pilot — architecture checkpoint
Date: 2026-10-23
Stage: Prototype | Next gate: authenticated draft -> review -> founder approval vertical slice

## Source of truth
- Curriculum concepts and prerequisites: existing Supabase migrations / canonical concept records.
- Published lesson blocks: existing content model; inspect its schema before any migration.
- Learner evidence and mastery: existing secure RPCs. Studio MUST NOT write learner mastery.
- This branch: a pure TypeScript quality gate under `lib/studio/pipeline.ts`.

## Implemented in this branch
- Typed candidate packages: concept IDs, lyrics, hooks, music prompt, exercises, reviews, version, status.
- Independent language, pedagogy and creative review must all pass for the same version.
- Reject packages without an active retrieval or production exercise.
- Founder approval is version-scoped and required separately before publish.
- New versions clear stale reviews and approval.

## Not implemented — do not present as operational
- Agent runtime/orchestrator and paid audio generation.
- Native speaker or audio-based pronunciation QA.
- Database persistence, permissions, audit trails and Studio UI.
- Publishing and authorized transition RPCs.
- Integration of the scheduled ChatGPT song brief with the application.

## Proposed next vertical slice
1. Inspect existing schema, RLS, content block workflow, deployments and internal roles.
2. Create a draft job table only if no existing governed content workflow can be extended.
3. Add authenticated server-only job transitions, idempotency, ownership and immutable review versions.
4. Implement deterministic curriculum-planner inputs and bounded LLM producer/reviewer adapters.
5. Build an internal-only Studio queue with draft comparison, revise/reject, and approval; no public publishing.
6. Run unit tests, RLS tests, accessibility check and staging smoke test before requesting production promotion.

## Acceptance criteria
- Draft linked to real concept IDs; unknown IDs rejected by server.
- Reviewer notes show reason codes and reviewed version; revision clears approvals.
- Failed review returns content to revision; no silent auto-approval.
- A founder must explicitly approve the exact final version.
- Learner-facing content and evidence unchanged throughout pilot.
- Daily/weekly generation bounded by cost/rate limits with manual override.
- Each generated asset records model, version, prompt, timestamp and human edit provenance.
- Audio production quality remains unverified unless audio is actually available for listening QA.

## Repository boundary
This is the personal Borao development repository (`kittykitter73-max/spanish-learning-dev`), NOT the Marked Matter organization or LCOA clinical systems.

## Studio UI scaffold (2026-10-23)
- Internal-only `/studio` server route requires authenticated user + allowlisted UUID via `BORAO_STUDIO_ADMIN_USER_IDS` (comma-separated auth user UUIDs). Missing variable fails closed with 404. Never use email-domain or browser-only checks.
- Reads up to 30 existing `content_items` for a read-only catalog (subject to current Supabase RLS).
- Browser-only demo workbench supports lyric drafts, hooks, music prompts, and manually recorded review decisions. Edits reset review state and all founder signoffs.
- **No draft persistence, no automated reviewers, no publishing, and no app-sent approval write.** All current review buttons are placeholders operated by a human. Refresh clears the local draft.
- Before any real agent pipeline: provision explicitly approved studio roles with governed RLS/RPCs, persisted versioned song jobs and immutable reviews, and curriculum IDs validated server-side against the canonical schema. Remove prototype local approvals or clearly distinguish them from authoritative approvals.
- QA gate: run `npm run typecheck`, `npm test`, and `npm run build` in an environment with dependencies; test unauthorized `/studio` access and both allowed/disallowed sessions. Confirm missing allowlist results in 404.

## Persistence proposal — October 26, 2026
- Added `supabase/proposals/studio_song_persistence_draft.sql`, **not** a deployable migration.
- Tables proposed: `studio_song_jobs`, immutable-intent `studio_song_versions`, and `studio_song_reviews`.
- Proposed row access: SELECT only for authenticated accounts with a trusted `app_metadata.borao_studio_role=admin` claim; no browser write grants. This role is **not provisioned**, and current `/studio` also requires `BORAO_STUDIO_ADMIN_USER_IDS`.
- SQL is **draft/unapplied**, not tested against running DB. Supabase project `spanish-learning-dev` reported INACTIVE on October 26.
- Before adoption, compare to actual schema, replace arbitrary concept IDs with validated curriculum links, define authorized RPC state transitions, ensure signed-off approval trail, verify RLS against negative test accounts, and align the route's allowlist with the governed role.
- GitHub work is on branch `feature/borao-studio-pilot`. Do not merge or deploy without tests.

## Live development schema verification — October 26, 2026
- Project `spanish-learning-dev` now reports `ACTIVE_HEALTHY`; read-only SQL confirmed **100 concepts** and **2 content items**. Existing Studio tables: **0** (not deployed).
- Canonical curriculum key is `public.concepts.id TEXT`; content mapping uses `public.content_concepts(content_item_id,concept_id,role)`. The Studio draft proposal now includes `studio_song_job_concepts` with a foreign key to canonical concepts and a role constraint, rather than trusting arbitrary text arrays.
- Current `/studio` UI remains ephemeral and uses local manual review actions; do not imply saved approvals. Existing creator allowlist and proposed trusted claim still need a unified authorization design.
- Next gate: inspect actual authorization policies and migration conventions; build versioned server transactions and negative authorization tests against a disposable development branch, then migrate dev after review. No database mutation was made during this verification.

## Curriculum selector — October 26, 2026
- Verified read-only: 100 concepts in `public.concepts`; 3 `published`, 97 `draft`. Existing public read policy only exposes published concepts to the normal authenticated browser client.
- `/studio` now fetches published concepts alongside the read-only catalog; prototype UI selects actual IDs and maps them to its practice exercise.
- Unpublished concepts need a separate, governed curriculum editorial review workflow. Do not broaden public concept visibility for convenience.
- This is not persisted: drafts remain in memory, manual review buttons are not AI reviewers, and no new Studio schema has been applied.
- Next: secure service-side draft/version RPCs, authorization and negative tests, and staging verification before any database migration or deployment.

## Database implementation checkpoint — 2026-10-26
- `studio_song_transactions_v1` was successfully applied to the dedicated Borao development Supabase project `gleeflbezorzonulikcj`.
- All four Studio tables exist with row-level security enabled. Introspection confirmed anonymous EXECUTE denied on `studio_create_song` and `studio_revise_song`; authenticated EXECUTE granted, with an in-function trusted JWT app_metadata admin check. History trigger is not callable by anon/authenticated.
- The database currently has **0 Studio jobs**. No user content was published.
- Create operation inserts the job, concept associations, initial version and audit record in one transaction. Revise serializes via `FOR UPDATE`, requires `expected_version`, creates an immutable version and audit record, and increments current_version.
- **Unverified:** live authenticated admin create/revise; stale concurrent write; anonymous/learner PostgREST denial; unauthorized JWT negative case; event immutability test; app build and browser UI. Do not claim these tests passed.
- **Next gate:** provision a designated Studio admin in trusted app_metadata with an audited admin action; run transaction and negative-role tests with test identities; then wire app editor save/revise to RPCs, show conflict UI, and remove local-only approval claims.
- The old SQL file `supabase/proposals/studio_song_transactions_v1.sql` is obsolete and should not be applied; the migration file is canonical.

## Studio save integration — October 26, 2026
- Client Studio editor now invokes `studio_create_song` on first save, then `studio_revise_song` with a saved expected_version for subsequent saves.
- The API remains restricted to trusted `app_metadata.borao_studio_role=admin`. The route's existing `BORAO_STUDIO_ADMIN_USER_IDS` allowlist is separate; both gates must pass. Provision the trusted role via authorized admin workflow before an editor save will succeed.
- Save reports version-conflict distinctly, and updates the committed version after an RPC success. Local approval/reviews are placeholders, **not** persisted or published.
- **Unverified:** npm/typecheck, test admin write, stale-version conflict, listener role access, route browser workflow, persisted reload. Do not promote PR before these checks.
- Next: add load/resume existing draft with server-side auth, guard concurrent in-flight edits, separate edit-version from saved-version, add negative authorization tests and CI.
