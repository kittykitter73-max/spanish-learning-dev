# Curriculum and Content — Shared Index

## Read this first
Master curriculum design baseline: version 1.1.
Google Doc: https://docs.google.com/document/d/1-wQQOieN3TG3TnBE2imUOAY_3PjfWBmLxXYT5u8KI4g/edit
The master defines outcomes, target coverage and evidence policy. Content-package revisions do not silently rewrite it. Existing production concept IDs stay intact.

## Thread ownership
Curriculum/content thread: target selection, sequence, scripts, songs, lyric maps, activities, assessment criteria, review and asset approval state.
UX/app thread: interaction design, player/queue, playlists, adapters, evidence persistence, readiness implementation and app verification.
Threads read this index and current package sources before dependent work. Shared files provide continuity; conversation messages are not automatically synchronized.

## Core Arc 01 — Make Something Happen
Current authoring package: version 0.2, creator-reviewed draft pending independent linguistic review.
- docs/CORE_ARC_01_PRODUCTION_PACK.md: complete current package; concept reconciliation, revised lyrics and assessments.
- docs/CORE_ARC_01_RECORDING_REVIEW.md: actor/narrator recording sheets, review fixes and two style prompts.
- content/core/arc-01/episode.source.json: 44 segments, nine prompt links; no attached media.
- content/core/arc-01/assessment.server.json: 15 candidate items; server-only criteria; not a client answer bundle.
- content/core/arc-01/boosters.source.json: four scripted repair activities, 42 segments; measured durations pending.
Current studio Google Doc: https://docs.google.com/document/d/17c82XZKki4GbYE8Zp5ZJvmrS8g7AG_qK7URNce9vB_E/edit
Historical production snapshot: version 0.1, https://docs.google.com/document/d/1TRkTW18Qfzk0T3nQaGm2ppB4RB79kT1sgijzo8Lff4I/edit
Read the version 0.2 repository package for current lyrics and assessment rules. The historical Doc has not been rewritten.

## Audio state
An approximately eight-second voice audition has been generated and saved as Borao_Arc01_Voice_Audition.mp3 for creator review.
It contains the six first-person frames, not a complete episode. Playback/file metadata was verified; linguistic/performance review remains pending. It is not a held-out assessment asset and is not attached to the app's media registry.
Song audio: absent. Generation attempt was blocked by the connected music account's paid-plan requirement. Two concise music prompts and revised lyrics are ready; no purchase or account upgrade occurred.
Full spoken episode, clear variants and scored check clips: not recorded.
None of these authoring sources grants publication or ready-media status.

## Review fixes in version 0.2
Listening questions ask neutral meanings rather than revealing want, need or ability in the prompt.
Meaning criteria require intention plus action; bare yes/no is insufficient for secure comprehension.
Production occurs before matching audio/models where possible. Item-use history rejects primed answers as fresh evidence.
Model reveals, hints, transcripts, low-confidence ASR and playback failures change eligibility.
C089 and C090 evidence is scoped to the constructions actually observed, not comprehensive grammar mastery.

## Next dependency for the UX/app thread
Review the candidate source schema against the actual content/media/evaluator schema, then implement an adapter in that thread.
Preserve separate playback exposure, actual captured response evidence and approved readiness decisions.
Use null media references as unavailable; do not simulate audio or claim an answer was heard.
Treat six-frame Arc readiness as provisional until delayed fresh checks; no album-completion or passive-play gate.
If starting with three anchor frames and chapter A, label it a partial Arc pilot.
Return implementation constraints and requested content changes to the shared package; avoid embedding a second curriculum in UI code.

## Next dependency for the curriculum/content thread
Audition the generated voice; arrange qualified Spanish review of exact scripts and eventual audio.
Produce the selected song and chapter A, then final chapter B and separate unused check clips.
After audio and app QA, pilot delayed plain-speech use and adjust the provisional evidence policy explicitly.
