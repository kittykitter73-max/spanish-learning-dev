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
