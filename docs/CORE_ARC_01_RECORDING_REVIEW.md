# Borao Arc 01 — Recording and Review v0.2

## Current status
Creator-reviewed draft. The Spanish has received an internal language/meaning check, not independent native-speaker sign-off. The master curriculum v1.1 remains unchanged. This bundle revises the Arc 1 production package to v0.2 and supplies structured authoring sources.
One eight-second speech audition exists. It is a voice/pacing sample, not a complete episode, an approved accent model or scored assessment clip. The music request was blocked by the connected account's paid-plan requirement. No song recording was produced.

## Review fixes
The old listening question “what does the speaker want to do?” revealed want before the learner interpreted quiero. All six listening checks now ask the neutral question “What is this person saying?” and require the intention as well as the action.
Bare yes/no replies no longer establish can/cannot comprehension. Recognition-choice support remains available as practice, with its weaker evidence label.
Do not play a listening line and immediately ask for the identical Spanish output in production; the first task primes the second. Reused answer forms count as immediate practice, even if item IDs differ.
A “held-out” label is insufficient. Retest selection must check teaching exposure, model reveals and answer-use history.
The song's translation-list bridge has become a musical bridge. The episode opens with a reason Mateo must wait: a delivery. No additional Spanish delivery vocabulary enters the gate.

## Current source files for the app thread
docs/CORE_ARC_01_PRODUCTION_PACK.md — reviewed version 0.2, all concept mappings, lyrics, game prompts, readiness proposal and release workflow.
content/core/arc-01/episode.source.json — 44 spoken/prompt/model segments with proposed authoring keys, response windows and nine interaction links.
content/core/arc-01/assessment.server.json — 15 draft assessment items with meaning criteria and exclusions; server-only authoring material, not a client answer payload.
content/core/arc-01/boosters.source.json — four segmented repair scripts; authoring source, not published media.
docs/CORE_ARC_01_RECORDING_REVIEW.md — this studio handoff.
These files are candidate authoring formats. They are not database migrations or proof that the existing app consumes their schema. The development thread owns adapters and UX. Do not expose server keys as learner-facing content.

## Voice and performance direction
Sofía: young adult, conversational, warm and decisive; flexible rather than nagging. Mateo: young adult, friendly, slightly distracted, never a caricature. Narrator: calm, engaging adult English support; brief explanations, not a motivational lecture.
Record Spanish character clips with validated Latin American pronunciation. A generator's preset name or es language flag does not establish native-speaker authenticity. Audition the actual output.
Use two different Spanish voices for final scenes and a third unfamiliar voice for listening checks. Do not use theatrical whispers for tested speech. Start with ordinary pace, then record a clear-speech version without distorting phrase stress.
Actor labels and segment IDs below are production labels, never spoken words. Each line should be its own clean clip for interactive playback. A scene-only edit strings character clips into meaningful conversation; removing prompts must not leave unexplained silent gaps.
Record model answers as separate clips so a learner's Skip/response controls determine when an answer becomes audible. The transcript drawer remains optional, and opening it before a response changes the evidence label.
Suggested delivery: clean mono speech stems; retain unprocessed masters; mastered playable copies with measured duration. Export choices are producer defaults, not claims about current server support.

## Sofía recording sheet
A1-EP-01-A02 — Quiero salir.
A1-EP-01-A04 — Está bien. Voy a esperar.
A1-EP-01-A07 — Quiero comer.
A1-EP-01-A16 — Voy a salir después.
A1-EP-01-A20 — Quiero salir.
A1-EP-01-A20 — Está bien. Voy a esperar.
A1-EP-01-B02 — Necesito ayuda.
A1-EP-01-B04 — Gracias. Quiero salir ahora.
A1-EP-01-B08 — Está bien. Voy a esperar.
A1-EP-01-B10 — Puedo esperar.
A1-EP-01-B15 — Necesito ayuda.
A1-EP-01-B21 — Voy a esperar. Después, quiero comer.

## Mateo recording sheet
A1-EP-01-A03 — Tengo que esperar.
A1-EP-01-A08 — Voy a comer después.
A1-EP-01-A12 — Tengo tiempo. Pero tengo que esperar.
A1-EP-01-A17 — Sí. Voy a esperar ahora.
A1-EP-01-A20 — Tengo que esperar.
A1-EP-01-B03 — Puedo ayudar.
A1-EP-01-B05 — No puedo salir ahora. Tengo que esperar.
A1-EP-01-B09 — Necesito comer.
A1-EP-01-B18 — Voy a salir ahora.
A1-EP-01-B22 — Sí. Puedo salir después.

## Narrator recording sheet
A1-EP-01-A01 — Sofía is ready to go out. Mateo has to wait for a delivery. The afternoon is not going to plan. Listen.
A1-EP-01-A05 — Who wants to go out: Sofía or Mateo?
A1-EP-01-A06 — Sofía. Quiero salir means I want to go out. Mateo says Tengo que esperar: I have to wait.
A1-EP-01-A09 — He plans to eat later. He didn’t say he has to eat.
A1-EP-01-A10 — Tell Mateo you want to eat.
A1-EP-01-A11 — One way: Quiero comer.
A1-EP-01-A13 — Tengo tiempo: I have time. Tengo que esperar: I have to wait. That que changes the job of the phrase.
A1-EP-01-A14 — Keep comer. Change Quiero comer into a plan: I’m going to eat.
A1-EP-01-A15 — Voy a comer.
A1-EP-01-A18 — Choose a real or fictional action. Say something you want to do, then something you plan to do. You can use the same action, but make the two intentions clear.
A1-EP-01-A19 — For example: Quiero salir. Voy a salir después. Your answer can be different.
A1-EP-01-A21 — Next: what you need, what you can do, and what you can’t do right now.
A1-EP-01-B01 — Same afternoon. Sofía needs help. Mateo can help, but can’t go out yet. Ayuda means help; ayudar means to help.
A1-EP-01-B06 — Is Mateo saying he doesn’t want to go out, or that he can’t go out now?
A1-EP-01-B07 — He can’t go out now. No puedo does not mean I don’t want to.
A1-EP-01-B11 — You need to sleep. Say it.
A1-EP-01-B12 — Necesito dormir.
A1-EP-01-B13 — Puedo salir. Keep salir, but say you cannot go out.
A1-EP-01-B14 — No puedo salir.
A1-EP-01-B16 — You have time and are able to help. Answer Sofía in Spanish.
A1-EP-01-B17 — One answer: Puedo ayudar.
A1-EP-01-B19 — Your situation changed: you can’t leave now because you have to wait. Tell Mateo both things.
A1-EP-01-B20 — For example: No puedo salir ahora. Tengo que esperar.
A1-EP-01-B23 — A want, a need, an obligation, a plan, and what’s possible. Keep listening if you like; a Quick Check can see what you can use without these examples.

## Music treatment A — dance/rap-pop
Glossy bilingual dance-pop with rap-pop attitude, 106 BPM, punchy syncopated drums, warm sub-bass, crisp claps, tight percussion, neon synth stabs and a little late-night guitar texture. Playful confident female lead, intimate rhythmic verses, melodic chant-hook chorus and tasteful short ad-libs. Establish the hook within ten seconds. Spanish frames quiero salir, tengo que esperar and voy a salir must be intelligible with natural stress; no tongue-twister delivery. Give each phrase breathing room. Compact verses, rising pre-chorus, bass-forward chorus, stripped bridge and energetic final lift. Clean lyrics, contemporary radio-ready mix, bright but not childish. Avoid classroom chanting, nursery-song melodies, motivational narration, oversized choir, heavy vocal distortion and long instrumental intros.
Use the revised lyrics in the production package. The genre and emotional state should work even when a listener forgets this is language content. Keep the three primary frames clear. Additional bailar is supported vocabulary, not a surprise gate.
Generation comparison: does the hook arrive quickly, is it catchy without classroom cadence, and can listeners hear tengo que as a complete chunk? Actual generated lyric deviations must be reviewed.

## Music treatment B — atmospheric melodic R&B
Atmospheric bilingual melodic R&B/pop, 88–94 BPM with a half-time feel, warm rounded sub-bass, dry finger snaps, restrained percussion, hazy synth chords and a small clean electric-guitar figure. Intimate female lead with personality, rhythmically precise verses and a memorable melodic chorus; soft harmonies only at line endings. Make quiero salir, tengo que esperar and voy a salir clearly intelligible with natural Spanish stress and clean consonants. Establish a vocal motif in the first ten seconds, then build from close verses to a spacious chorus. Strip the bridge to voice and bass before the last hook. Clean bilingual lyrics, late-night mood, inviting rather than sleepy. Avoid classroom cadence, spoken grammar explanations, long ambient intros, melisma across target words, heavy auto-tune effects, choir stacks and generic motivational-pop delivery.
Use the same revised lyrics and target map. This is a preference alternative, not another compulsory lesson. Decide after listening which treatment deserves continuation. Both prompts are prepared for a concise music-style field.

## Target review questions for a Spanish reviewer
Do the ordinary spoken lines and sung target frames sound natural in the selected variety?
Does any performance blur tengo versus tengo que, or voy a plus infinitive?
Are want, need, obligation, plan and can/cannot translations faithful to the context?
Are open-response alternatives accepted without certifying a target the learner did not actually use?
Is any new lexical item deciding the score instead of the intended frame?
Review the exact final audible text, not just the source script. Provide line-specific edits with affected segment and concept IDs. An unchanged version is not signed off by silence.

## Recording acceptance and handoff
Before learner release: linguistic review, pedagogical review, actual audio verification, rights provenance and app playback/evidence QA.
Draft demonstration audio may be used in a clearly labeled creator pilot without mastery claims. Do not mark media ready, publish the assessment bank or unlock the full Arc just because a draft MP3 exists.
Music: listen for stress, intelligibility, vocal clutter, replay value, accidental lyric additions and the final lyric-to-concept map.
Speech: listen for pronunciation, naturalness, speaker consistency, clipped syllables, comfortable pacing, leading prompts and model-answer timing.
Assessment: keep raw tested clips free of background lyrics, captions, hidden models or clues in their filenames shown to learners. Randomize speaker/prompt order within policy, not through unrelated difficult vocabulary.
Current eight-second audition contains: Quiero salir. Tengo que esperar. Voy a salir después. Necesito ayuda. Puedo ayudar. No puedo salir ahora.
Use this audition to evaluate voice suitability only. It is not a held-out test asset and may not establish target mastery.

## Thread ownership
This thread owns curriculum targets, scripts, lyric maps, answer criteria and approval state. The UX/app thread owns player interaction, controls, adapters, state persistence and implementation verification.
Shared handoff is committed content, not assumed live conversation synchronization. Before adapting a package, read its current version and approval state. Return observed asset IDs and implementation limitations without redefining curriculum targets in UI code.
Next useful step: audition the voice and song treatments, incorporate line-specific review, then record chapter A and its plain-speech target clips. A three-frame demo stays labelled partial Arc 1.
