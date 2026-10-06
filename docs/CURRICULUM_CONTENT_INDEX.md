# Curriculum and Content — Shared Index

## Read this first
Current master: docs/BORAO_MASTER_CURRICULUM.md — version 1.2, internally revised design baseline.
Current Arc 1 package: docs/CORE_ARC_01_PRODUCTION_PACK.md — version 0.3.
Review log: docs/CURRICULUM_REVIEW_LOG_v1_2.md — findings, changes, scenario checks and pending external validation.
Certification policy: docs/CERTIFICATION_AND_VALIDATION.md — current certification status is none.

## Thread ownership and coordination
Curriculum/content thread owns target scope, sequence, scripts, songs, activities, assessment criteria and content approval state.
UX/app thread owns interaction design, player/queue, playlists, adapters, evidence persistence, readiness implementation and runtime verification.
Read docs/CONTENT_HANDOFF_v1_2.md before dependent app work. Coordination is through shared files; conversation messages are not synchronized and saving a handoff does not prove receipt.

## Complete curriculum sources
- docs/BORAO_MASTER_CURRICULUM.md: eight internal coverage stages, 48 authoring unit cards, 192 targets and 24 strands, with unit-specific scope/support/held-out revisions.
- docs/CORE_ARC_MAP.md: v0.2 written map, including the twelve previously omitted seed concepts.
- content/curriculum/core-coverage.v1.2.json: all 100 existing C001–C100 IDs assigned an authoring home and scoped evidence role.
- content/curriculum/units.v1.2.json: all 48 cards and 192 authoring targets with specific revision notes and new transfer scenarios.
These registers are not migrations. Database memberships and the expanded-target semantic legacy crosswalk still require reconciliation.

## Album music requirement
Every album includes at least one Latin signature track within its planned track count, preserved across personalized editions. Spanish-first lyrics and a specific musical tradition are required; actual language/musical review determines release quality. Album 01 Track 08 is reserved for the role, with a contemporary cumbia direction proposed. See the master’s Required Latin signature track section.

## Arc 01 — Make Something Happen
- docs/CORE_ARC_01_PRODUCTION_PACK.md: current complete authored pack, rewritten lyrics/story, games, speaking, checks and Boosters.
- docs/CORE_ARC_01_RECORDING_REVIEW.md: current actor/assembly/review instructions.
- content/core/arc-01/song.source.json: rewritten Ahora sí lyrics, line/concept map, two style prompts (859/882 characters); no audio.
- content/core/arc-01/episode.source.json: 24 uninterrupted character turns plus three optional practice prompt/model pairs; no media attached.
- content/core/arc-01/assessment.server.json: 30 candidate A/B check items and two practical mission specifications; criteria are server-only.
- content/core/arc-01/boosters.source.json: four repair activities; immediate success does not prove retained mastery.
Status: internally revised draft pending independent teacher/native review, recording, calibration, rights, app verification and pilot evidence.

## Audio and implementation state
An approximately eight-second voice audition was generated earlier; it is preview-only, not validated pronunciation or a full episode.
Full song, story, clear variants and scored check/transfer clips remain absent. No new audio was generated during this revision. Every essential media reference remains null and approval flags remain false.
No UI, database, migration, deployment or media-ready status was changed by the curriculum revision. docs/UX_TIMING_AND_CONTENT_FORMAT_CONTRACT.md still describes earlier v1.1/v0.2 timing; the handoff specifies the needed reconciliation without pretending it is implemented.

## Historical Google Docs — not current authority
Master v1.1: https://docs.google.com/document/d/1-wQQOieN3TG3TnBE2imUOAY_3PjfWBmLxXYT5u8KI4g/edit
Production pack v0.1: https://docs.google.com/document/d/1TRkTW18Qfzk0T3nQaGm2ppB4RB79kT1sgijzo8Lff4I/edit
Recording/review v0.2: https://docs.google.com/document/d/17c82XZKki4GbYE8Zp5ZJvmrS8g7AG_qK7URNce9vB_E/edit
These Docs have not been rewritten this turn. Use the repository v1.2/v0.3 sources for all new work.

## Next concrete release dependency
Qualified human review of exact scripts and criteria; then completed audio, evaluator/media assembly verification and a small exploratory learner pilot with delayed new-context checks. Internal iterations are complete for this revision; external approval and learning outcomes remain unproven.
