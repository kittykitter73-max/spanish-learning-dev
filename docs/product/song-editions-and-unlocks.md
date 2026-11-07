# Song Editions & Musical Unlocks — Canonical Product Specification

Status: **Approved concept for roadmap / not yet implemented**  
Product: Borao (working brand); repository is the source of truth.  
Added: 2026-11-07  
Scope: Music catalog, Studio production pipeline, learner rewards, app/library UX, and assessment integrations.

## Product intent

Offer alternate-language performances of a learner's favorite Spanish songs as **earned musical rewards**, not as a paywall on language comprehension. The primary reward is an **English Edition** that sounds recognizably like the same song: preserve arrangement, instrumental, melodic identity, and energy as closely as feasible. Optional **Bilingual Remix**, karaoke/instrumental, and genre editions can be added later.

The lesson must always permit access to meaning, line-by-line explanations, translations, and song breakdowns independent of earning an alternate recording. Mastery must NEVER depend on acquiring or replaying an English edition.

## Learner experience

1. A published Spanish original is available through the normal licensed catalog/lesson path.
2. Eligible songs show a clearly marked locked **English Edition** in the music library and song detail.
3. A contextual **Song Challenge** (listening meaning, expression matching, constrained retrieval, lyric interpretation) unlocks the full English recording. Do not require repetitive grinding.
4. On qualifying completion, server-authoritative entitlement is granted once and the library immediately reveals the English track.
5. A short celebratory reveal encourages comparison/replay, without falsely implying fluency or mastery.
6. The Spanish and English editions are navigable as linked versions of a single composition. Crossfade or synchronized switching is a future experiment, **not** a promise of perfect alignment.
7. A bilingual edition and album-level bonuses may be separate reward definitions. The learner can still access core instructional translations and help without an unlock.

## Curriculum and reward principles

- Rewards recognize progress and exploration; the existing append-only learning evidence and derived concept mastery remain distinct.
- Game success may grant a reward, but skill advancement requires the existing valid evidence dimensions, including delayed, unaided recall/novel production and transfer.
- Challenge prompts must use published, reviewed material and real ready audio for audio-dependent items. Hidden answers and evaluation remain server-side.
- Offer alternate access paths for users with hearing, motor, language-processing, or accessibility needs. Avoid punishing learners who need support.
- For a first-album pilot: **two English Editions, one Bilingual Remix, one optional album bonus track**. These are planning targets, not already-produced assets.
- Measure unlock rate, replay, Spanish-original replay after unlock, comprehension, and delayed transfer. Do not infer learning benefit from engagement alone.

## Audio/lyric production constraints

- One composition, multiple language editions. Store each edition as a distinct audio asset with a shared composition ID.
- English lyrics are **singable meaning-preserving adaptations**, not mandatory word-for-word translations; keep a separate accurate Spanish lyric translation/explanation in the lesson.
- Start from an approved Spanish recording; draft meter/stress-compatible English; test controlled cover/lyric replacement and, if needed, instrumental/stem reuse with new vocals. Suno or another provider may **not** reproduce an identical backing track or exact melody: verify by actual listening and production QA.
- No claim of perfect matching or provider functionality without a validated pilot.
- Capture original + edition audio/stem provenance, licenses, usage rights, model/provider, version, lyric copyright, rights to derivative versions, production prompts/configuration, and QA outcomes.
- Paid generation and publication require explicit human approval. Production changes remain gated.

## Proposed domain objects (design contract; NOT a migration)

- `composition`: canonical composition identity, album, curriculum focus, rights metadata.
- `song_edition`: stable ID, composition_id, language_mode (es_original/en_edition/bilingual_remix/instrumental/other), lyric_version, audio_asset_id, timing/arrangement provenance, editorial_state, publication_state, accessibility metadata.
- `edition_alignment`: optional mapping from Spanish line/section to meaning, singable English adaptation, and musical timing markers; no assumption of word-for-word equivalence.
- `unlock_rule`: reward key, qualifying challenge/version, eligibility policy, bonus/album association, accessibility alternatives.
- `learner_reward_grant`: idempotent, server-authored grant keyed by learner + reward; retains earned-at, rule/version and qualifying evidence reference; RLS prevents forged grants.
- `song_challenge`: review-gated, published assessment specification compatible with existing score/evidence authority.

Fit these to current schema after inspection; avoid duplicate entities when existing catalog, assessment, rewards or library tables can support them. All client surfaces consume server-authorized entitlement state.

## Studio workflow

1. Select reviewed Spanish original with viable instrumental/melody and curriculum breakdown.
2. Produce faithful meaning map and singable English adaptation; review bilingual version independently where applicable.
3. Run language/naturalness, curriculum/transfer, and creative/audio QA against the **same version**. Native-speaker and actual audio listening reviews cannot be simulated.
4. Verify lyric alignment, audio resemblance, vocal clarity, rights, playback assets and accessible challenge alternatives.
5. Attach challenge + unlock rule; test authorized grant and library visibility.
6. Founder signs off on content/audio and any paid generation; publish through existing gates.

## Engineering acceptance criteria

- [ ] Original remains playable with ordinary lesson access even when English edition locked.
- [ ] Song breakdown and accurate translation remain accessible before unlock.
- [ ] Locked/unlocked UI derives from server-verified grants, never client toggles.
- [ ] Repeated qualifying submissions grant a reward exactly once; concurrent attempts are safe.
- [ ] Unpublished editions are inaccessible even if a reward record exists.
- [ ] Logged-out / cross-user requests cannot access entitlements or private assets.
- [ ] Existing score RPCs, RLS, append-only evidence, ready-audio and draft-content gates remain intact.
- [ ] A challenge unlock cannot directly assert mastery.
- [ ] Accessibility alternate route and reset/versioning rules are defined and tested.
- [ ] Track-level analytics exclude unnecessary personal data; compare pilot learning metrics with baseline.
- [ ] Automated tests cover locked, earned, unauthorized, unpublished, duplicate grants and regression cases.

## Delivery sequence

**Phase 0 — audio feasibility spike:** use one approved Spanish song to trial matched English performance, assess backing/melody similarity, intelligibility, meter and production cost. No paid generation without approval.

**Phase 1 — catalog/data contract:** inspect actual source-of-truth schema and content workflows; define composition/edition relationship and entitlement model with migration review.

**Phase 2 — assessment/rewards:** integrate Song Challenges with existing validated scoring/evidence, idempotent grants and RLS.

**Phase 3 — user experience:** library locked/earned cards, song detail edition switcher, earned collection, explanations available independently, accessibility.

**Phase 4 — first-album pilot:** two English editions, one bilingual remix, one optional bonus track after native/audio QA; measure learning and engagement, decide whether to scale.

## Non-goals / open questions

Not in MVP: guaranteed beat-perfect A/B transitions, automatic bulk translation, generating English for all songs, granting proficiency for an unlock, or monetizing access to explanations. Confirm whether providers allow desired commercial use and derivative reuse, what storage/CDN/playback pattern fits existing deployment, and whether different genre choices change reward eligibility.

## Implementation status

**Specification only.** No Supabase schema, deployed UI, audio generation, published content or learner entitlements are created by this document.
