# Borao Spanish Learning Program Master Curriculum

Version 1.2 — internally revised design baseline; independent review and pilot validation pending

## Purpose and authority

Borao is the current working product name. This is the canonical curriculum specification for an adult, music-driven, audio-first Latin American Spanish program. It tells curriculum writers, songwriters, audio producers, assessors and developers what to teach, how to sequence it, what to produce and what evidence to collect. The initial destination is useful everyday conversation; the later sequence develops connected storytelling, sustained interaction and increasingly nuanced expression. Neither completing the course nor finishing an album constitutes a certified proficiency level.

The curriculum comprises eight stages, 48 instructional units, 192 unit targets, and 24 cross-course pronunciation, listening and interaction targets. Lexical banks supply the words used to vary those targets. Each target is a learning object, not a claim that one phrase covers every use of a verb. The eight stages are internal coverage bands, and the 48 units are authoring packages. The learner-facing progression follows the ten Core Arcs and then chosen elective paths, as specified below. Personalization chooses contexts, genres and support levels without replacing evidence rules.

This is a complete design baseline for the proposed scope. It is not a finished library of recorded songs, podcast episodes or scored exercises. Native-speaker review, pilot calibration, full assessment-item authoring and audio production remain release work. The worked package near the end shows the level of specification required for each production unit.

Existing project documents 02 Curriculum and Learning Science, 06 Content System and Album 01, 08 Architecture Gate and 11 Character Narrator and Spoken Teaching System supply the established philosophy and product contracts. This document extends their sequence and makes previously open dialect and scoring decisions explicit. It does not claim that code or databases have been updated. Document 08 mentions a 100-concept seed, and the existing project status says those Beginner-1 concepts are in development. The user supplied the later ten-Arc product architecture during this drafting turn. The current repository seed of 100 concepts and written Arc map have now been inspected. The v1.2 coverage register assigns every seed concept an authoring home and preserves every existing ID. Database Arc memberships and runtime behavior still require verification by the app thread; the register is a content specification, not a migration. Expanded targets require an explicit semantic crosswalk before import. Do not overwrite or silently renumber existing database concepts.

## Governing product architecture Core Arcs and chosen paths

This section incorporates the user-supplied product architecture and takes precedence wherever an older lesson or stage model suggests a different learner experience. Borao has one invisible curriculum. An Arc groups the abilities to demonstrate; songs, episodes, games and speaking tasks teach or measure them. Albums and podcast series are playable collections, not levels. The internal stage bands and unit cards below supply reusable teaching material rather than a compulsory screen sequence.

The relationship is curriculum targets and dependencies → Core or elective path → Arc → mapped content and activities → evidence → Quick Check → readiness or targeted Booster → next recommendation. The player and queue deliver those choices. A single content item can reference multiple Arcs, and one Arc can draw from multiple albums, series and games.

The supplied update reports database foundations for Core/elective paths, Arcs, learner path state and playlists, and reports that the actual 100 Beginner-1 concepts have been grouped into ten Core Arcs. Those implementation claims come from the supplied thread; this curriculum turn does not independently certify migrations or deployment. The revision pass inspected the repository seed and Arc map. It did not verify live database membership rows or deployed behavior.

### The ten Core Arcs

Keep the existing 100 concept IDs. The revised written map provides a complete authoring assignment; reconcile it with database membership before import. The crosswalk below maps the new teaching specifications to each named function; it is not a replacement seed or a claim that all listed expanded targets are part of the original 100. When implemented membership and proposed coverage differ, audit the gap explicitly. Early command or pronoun chunks may belong to Core while their full grammatical systems remain later targets.

| Core Arc | Demonstrated ability | New document teaching coverage | Quick Check and specific Booster |
|---|---|---|---|
| 1 Make Something Happen | Express want, need, obligation, intention and ability | S1U1–S1U4; a brief Stage 0 support primer | Hear the intention, retrieve a phrase, change a frame and respond to a practical constraint; Booster contrasts only the confused frame |
| 2 You Me Let’s | Shift a familiar intention between self, other person and shared action | S1U3C3; S1U4C2; selected S2U4 present forms | Interpret who acts and give a changed-person response; Booster works on the exact person contrast |
| 3 Ask Anything | Ask relevant basic information questions and interpret answers | S1U6; S0U2C3; selected S2U2C3 | Ask about what, where and when, then respond to the answer; Booster distinguishes the missed question function |
| 4 Stay in the Conversation | Repair, clarify, confirm and continue an exchange | S0U3; S0U6; X17–X20 | Handle an unclear instruction and ask a useful follow-up; Booster targets a missing repair strategy |
| 5 Now Later Before | Interpret timing, sequence and readiness | S1U3C4; selected S2U5; S4U4C3 as a familiar completion chunk | Coordinate now/later and understand not-yet; Booster contrasts timing rather than reteaches the whole Arc |
| 6 Where Are We | Interpret existence, location, destination and speaker perspective | S0U4; S1U3C1; selected S3U3 | Locate something and explain where to go; Booster contrasts hay, está or movement as needed |
| 7 Everyday Life | Understand and discuss familiar daily actions | Selected S2U4; household and food lexical banks | Interpret a short routine and say a personal action; Booster uses the missed verb or action frame |
| 8 Get Things Done | Understand requests and give practical action language | Selected S3U4 command/request chunks; S1U4 | Complete a household task exchange; Booster addresses a specific request, command or negative meaning |
| 9 Me You How Things Are | Describe identity, state, liking and simple relationships | Selected S2U1; S1U5; S2U3; S2U2 | Distinguish who someone is, how they are and what they like; Booster isolates the weak contrast |
| 10 Keep Up | Combine the Core repertoire with less support and unfamiliar voices | S0U6 and S2U6 integration; X11–X15 using known Core language | Complete an unscripted multi-turn Core exchange; Booster addresses the bottleneck without introducing a giant new grammar block |

Core completion means the learner can use the approved Beginner-1 repertoire sufficiently to begin chosen paths. It does not mean the learner has finished all eight stages, mastered narrative past or achieved broad conversational fluency. The larger 192-target sequence extends beyond Core. Post-Core learning continues through selected modules and continuing pathways toward the broader conversation goals.

A true beginner can receive a short supported greeting and repair introduction before Arc 1 without being forced through weeks of preliminary vocabulary. Returning learners can attempt the relevant Quick Check immediately. Everyday conversation remains central; advanced content is available through appropriately scaffolded paths rather than hidden behind unrelated elective completion.

### Quick Checks test through and Boosters

A Quick Check samples four dimensions where applicable: transcript-free listening, uncued retrieval, controlled manipulation and actual production. Its result is a dimension profile and the next useful action, not one 8-out-of-10 pass score. Each Arc declares a small set of critical functions, acceptable alternatives, applicable dimensions and a held-out scene. Do not require a manipulation task for a purely interactional chunk when that demand has no meaningful role.

Immediate Arc readiness requires all critical functions to be usable at the Arc's declared minimum support level. A strong recognition result cannot compensate for inability to retrieve or produce a critical productive frame. Readiness can unlock the next Arc while delayed checks remain scheduled. The retained label still requires later evidence; the app should not delay every unlock for seven days or declare durable mastery from a single successful binge-listening checkpoint.

A learner can skip instructional activities by demonstrating the relevant abilities. Passive plays never satisfy the gate by themselves. A quick successful check records provisional readiness, then a changed prompt later confirms retention. If a Quick Check exposes one weak dimension, retain passed evidence and build a roughly two-minute Booster for that gap. Retest that function with a fresh example; do not force the learner to repeat the entire Arc or reuse the just-revealed answer as proof.

Checkpoint sampling must be sufficient for the specific gate. Four activities can sample four dimensions, but a single answer does not validate five distinct frames. Add short targeted probes when evidence is sparse. Record which critical functions are confirmed, supported or unresolved. Learner wording can be You can understand this already; this phrase needs one more spoken try. The emotional tone stays useful while the underlying rule stays objective.

### Chosen modules and continuing growth

After Core, the default experience shifts toward choose-your-Spanish. Each elective has a concrete outcome, two to four mini-Arcs, linked content, a prerequisite check, missions and a final Quick Check. Some modules extend basic practical ability; others require later grammar or listening readiness. Offer a bridge instead of making learners complete every unrelated module. Completing one module does not imply another module's targets are known.

| Module | Mini Arc sequence and outcome | Useful packages and prerequisite bridge | Final proof |
|---|---|---|---|
| Travel | Arrive and navigate; ask and repair; solve a travel problem | S3U3, S3U5, S3U6; basic time/quantity bridge | Handle a changed route or booking with an unfamiliar speaker |
| Everyday Social Spanish | Start and continue; react; make a plan; close naturally | S2U2, S2U6, S5U6; follow-up bridge | Sustain a linked exchange with one unexpected question |
| Dating and Relationships | Invite; express interest; set boundaries; discuss feelings | S2U3, S4U5, S6U3; opt-in context and request bridge | Respond to an invitation and communicate a clear preference or boundary |
| Family and Home | Coordinate routines; ask for help; give instructions; repair | S2U2, S2U4, S3U4 | Coordinate a shared household task without a script |
| Work | Explain a routine; arrange time; report a problem; recommend | S2U5, S3U5, S4U6, S6U6; generic work vocabulary | Clarify a request and agree a practical next step |
| Food and Going Out | Order; modify; pay; suggest and compare | S3U1, S3U2, S2U5 | Complete an order with one unavailable item |
| Health and Wellness | Describe a basic need; ask for help; understand routine information | S3U5 and body/feeling banks; ordinary language only | Communicate a fictional concern and clarify an instruction without practicing diagnosis |
| Slang and Casual Speech | Recognize tone; regional phrases; choose register | S5U6, S7U2, S7U5; regional listening bridge | Interpret a labeled informal exchange and choose a suitable reply |
| Latin Music and Lyrics | Hear repeated phrases; interpret figurative language; compare spoken use | Song maps plus S5U4 and S7U3 when needed | Explain a lyric's meaning and use a natural ordinary-speech equivalent |
| Storytelling | Completed events; background; connected narrative; listener response | Stage 4 and S7U1; past-tense bridge | Tell a new story and answer follow-ups |
| Country and Region Packs | Address forms; local vocabulary; multiple local voices; register | S7U5; familiar Core meaning in regional recordings | Understand a practical exchange in more than one local voice |
| Advanced Listening | Segmentation; natural rate; inference; summary | X12–X16, S5U6, S7U3; vocabulary-controlled bridge | Summarize new audio without captions and explain key evidence |

Core repair, high-value frames and weak older targets resurface inside chosen module contexts. The recommendation engine keeps their original concept identities and evidence histories. A new travel example of quiero is a new context for the same meaning, not a duplicate travel-only concept.

### Navigation player and playlist behavior

Target navigation is Home, Listen, Play, Speak and Library. Home provides one prominent continue/play recommendation, an appropriate Quick Check and at most one optional activity. Listen contains music, episodes, mixes, Drive and saved audio. Play offers a small set of effective mechanics. Speak contains responses, character role-play, missions and eventually constrained conversation. Library organizes albums, series, modules, favorites, downloads and playlists. These are product requirements, not a claim that the current interface has already changed.

A persistent mini-player is foundational. Borao owns in-app learning playback and queue state. External Spotify or Apple Music distribution may support discovery, but cannot reliably substitute for in-app exposure timing, pauses, transcripts, response capture and content-version tracking. Off-platform listening can be acknowledged by learner report but does not create verified prompt or production events.

Songs and series remain freely enjoyable. An assessment is optional during uninterrupted listening. A tiny response can happen inside an episode, followed by resumed audio, without launching a worksheet screen every time. Player rules include pause/resume, queue continuity, safe interruption, segment timecodes, response opt-in, playback failure recovery and an accessible text alternative. Count observed playback honestly; queueing a song is not hearing it.

Queues, favorites and basic saved content are available from the beginning. Build Your Mix is a post-Core feature distinction rather than a restriction on liking or listening to music. A manual playlist is user ordered. A smart playlist has an explicit recipe: duration, music/spoken/mixed ratio, energy, genre, support level, current module, due concepts, allowed new-target count and prompt frequency. Learners can choose songs-only or chill-with-no-questions. Those sessions remain exposure unless an observable learning response occurs later.

Examples include Gym Spanish, 20 Minute Drive, Mostly Spanish, Make Me Speak, Travel Prep and Reggaeton Plus Weak Spots. A mixed queue can place a song, a related scene, a reprise and one oral challenge together. The challenge is omitted when mode or preference makes it unsuitable. Downloaded content retains asset versions and syncs idempotent events when reconnecting; unavailable or expired assets do not masquerade as completed learning.

The initial game set is Hook Hunt, Flip It, Scene Rescue, Speed Round and Finish the Bar. Hook Hunt earns recall only if the learner retrieves without answer choices; otherwise it earns recognition. Flip It records manipulation. Scene Rescue records context comprehension or actual production according to response capture. Speed Round is optional timed reuse of known material, with untimed alternatives. Finish the Bar supplies cued music recall and needs a separate spoken-use check for transfer. Five strong mechanics are sufficient; a larger menu is not a curriculum requirement.

### Data alignment with the Arc architecture

Add or reconcile learning_paths, path_arcs, arc_concepts, learner_path_state, checkpoints, checkpoint_dimensions, checkpoint_attempts, boosters, playlist_recipes and queue_sessions with the existing schema. Do not create duplicate tables simply because a name differs. The supplied thread reports that several of these foundations already exist; inspect actual migrations before extending them.

Arc membership identifies critical, optional, introduced and recycled targets, not just a list of song IDs. Content-to-concept mappings remain many-to-many. Checkpoint rules reference applicable dimensions and critical functions. Booster selection references failed functions and evidence, with passed dimensions preserved. Unlock state is derived from a versioned policy and evidence, while durable concept retention is tracked separately.

The actual Core seed is authoritative for implemented concept identity. The expanded unit cards here are curriculum specifications to crosswalk, not an instruction to replace the 100 seed concepts with 192 new database rows. This distinction prevents a writing task from silently changing the live learning model.

## Decisions that govern the whole program

- Audience is adults and general-audience learners, including true beginners and adults reactivating school Spanish. The core content is clean; optional mature humor or flirtation is a separate preference and rating layer.
- Production models use broadly intelligible Latin American Spanish with tú, usted and ustedes. Vosotros is recognition-only optional comparison. Voseo is introduced receptively before optional regional production.
- Listening, spoken response, music and podcast-style teaching are the main delivery modes. Reading and writing support learning and have their own evidence records.
- Teach useful chunks immediately, then reveal their grammar through meaningful contrasts and varied production. A chart is a reference, not the default lesson.
- Every learning block includes meaningful input, focused attention to form, retrieval, learner output and fluent reuse of familiar material. Songs need not carry every concept.
- Translation is a legitimate early support tool. We gradually reduce dependence; we do not punish learners for translating or suggest that translation itself is a failure.
- Natural errors are expected. Task success, intelligibility and the specific target under assessment matter more than perfect recital.
- Passive replay, mental rehearsal and audio-prompt participation without an observable response never establish independent mastery.
- Optional relaxation, visualization and identity language are transparent and learner-controlled. They add no automatic learning credit.

## Sources and how we use them

The following sources inform design, not copied lesson scripts. All unit sequences, examples, thresholds and production allocations below are original product proposals.

[S1] ACTFL Proficiency Guidelines 2024 overview: https://www.actfl.org/proficiency-guidelines-overview. Use its real-world, spontaneous performance framing and separate skill domains to audit tasks. Our stages are not ACTFL ratings and the app is not an official ACTFL assessment.

[S2] Council of Europe CEFR descriptors and Companion Volume resources: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors. Use can-do activities, interaction and phonological control as coverage checks. Stage alignment is approximate and requires external assessment to substantiate.

[S3] Instituto Cervantes Plan Curricular: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/default.htm and functions inventory https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_a1-a2.htm. Use communicative functions and Spanish-specific coverage; adapt examples and priorities for Latin America rather than importing Spain-specific usage or chapter order.

[S4] Paul Nation, The Four Strands, 2007: https://openaccess.wgtn.ac.nz/articles/journal_contribution/The_four_strands/12552167. Audit balance across meaning-focused input, meaning-focused output, language-focused learning and fluency development over a rolling block. Roughly balanced opportunities are an organizing principle, not a requirement that every song divide into four equal parts.

[S5] Karpicke and Roediger, The Critical Importance of Retrieval for Learning, Science, 2008, DOI 10.1126/science.1152408: https://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Karpicke-Roediger-2008_Sci.pdf. Repeated successful retrieval can improve delayed vocabulary retention. This does not establish our exact review intervals, app thresholds or conversational-fluency effects.

[S6] Ludke, Ferreira and Overy, Singing can facilitate foreign language learning, Memory and Cognition, 2014, DOI 10.3758/s13421-013-0342-5: https://doi.org/10.3758/s13421-013-0342-5. A controlled phrase-learning study motivates testing sung practice. It does not establish that passive music listening produces fluency or validate this whole program.

[S7] RAE and ASALE, Diccionario panhispánico de dudas, vos: https://www.rae.es/dpd/vos. Use pan-Hispanic reference support for regional address forms. Regional experts must review local voices, slang and register before release.

Historical FSI-style variation is used as a design inspiration for changing person, polarity, time and lexical slots. No intelligence-community endorsement or secret-method efficacy claim is implied. We do not rely on speculative mechanisms to establish learning progress.

## Revision authority, learner routes and validation

The v1.2 unit-specific critical scopes, support notes and held-out scenarios refine each card's broader outcome; extension targets never become hidden prerequisites for the narrower initial encounter. The complete seed register in content/curriculum/core-coverage.v1.2.json and unit register in content/curriculum/units.v1.2.json are authoring sources, not import-ready migrations. The former preserves all 100 seed IDs; the latter preserves all 192 expanded targets. Reconcile meanings before assigning legacy evidence to expanded targets.

True beginners receive one repair strategy immediately, then the three anchor intentions in separate short encounters before adding need and ability. Returning learners may check first. Readers with weak listening receive familiar words in new voices. Hesitant speakers can practice privately or use a written route with speech marked unobserved. Listen begins playback without compulsory exercises; active review can be deferred. None of these routes silently changes the declared Core outcome.

A complete commissioning pass does not make the entire content library complete. This baseline contains unit outcomes and scenarios for all eight stages, a rewritten first-Arc lyric/story package and later catalog briefs. Later units still require fully authored dialogue, exact keys and reviewed audio before release. Previously discussed songs without supplied lyrics/audio remain unverified; no internal review can inspect absent material.

Current accreditation/certification status is none. docs/CERTIFICATION_AND_VALIDATION.md distinguishes provider accreditation, external learner exams and our own completion records. CEFR coverage is a design reference, not an approval seal. Internal simulated teacher/native/user/academic/business lenses do not replace actual external reviewers or learners. Six-pass findings and unresolved empirical gates are in docs/CURRICULUM_REVIEW_LOG_v1_2.md. The UX implementation handoff is docs/CONTENT_HANDOFF_v1_2.md.

## Learner journey and stage outcomes

| Stage | Learner goal | Exit performance | Approximate coverage audit |
|---|---|---|---|
| 0 | Get your bearings | Greet, identify self, request repetition, locate a familiar thing and understand a short supported exchange | Pre-A1 to early A1 functions |
| 1 | Say what you need | Express wants, needs, ability, plans, likes and basic questions in short exchanges | A1 functions |
| 2 | Have a little conversation | Sustain linked question-answer turns about people, routines, schedules and descriptions | A1 to A2 functions |
| 3 | Live your day in Spanish | Complete common errands, make arrangements, understand instructions and solve a routine problem | A2 functions |
| 4 | Talk about your life | Tell a connected account of past events, explain background and give reasons and reactions | A2 to B1 functions |
| 5 | Keep up with people | Follow familiar natural conversation, handle pronouns and reformulation, and respond to unfamiliar speakers | B1-oriented coverage |
| 6 | Express what you mean | Give advice, express uncertainty and wishes, discuss alternatives and negotiate a practical choice | B1 to selected B2 functions |
| 7 | Make Spanish your own | Sustain extended conversation, interpret tone, summarize media and explain or defend a viewpoint | Selected B2-oriented tasks |

These are design intentions, not equivalences between CEFR and ACTFL. Later grammar appearing in a unit does not itself prove B2 proficiency. Skill levels may differ within one learner. There is no calendar guarantee, fixed fluency promise or vocabulary-count certificate.

## Course structure and pacing

A unit is an authoring package with four active targets, not a learner-visible lesson or unlock gate. An Arc can use targets from several units, and a unit can support several Arcs. Its four targets are coverage slots, not a demand to introduce four new forms together. Split it into two or more encounters if the learner needs fewer new forms. A target may first appear as a chunk and later be revisited as a productive construction. Units do not equal days. A learner may need one to several weeks of mixed reuse for a difficult unit, while a returning learner can test out of familiar components.

For an ordinary 12–20 minute active session, begin with two due retrievals, introduce or revisit one meaningful scene, focus on at most two new targets, request varied output and end with a short mission or later-review appointment. A 5-minute session can contain one due target and one useful exchange. A 20–30 minute music or podcast playlist is an exposure opportunity; pair it with a separate active check when convenient.

Each unit requires a production package with the following assets. Counts are initial authoring minimums for usable variation, not research-derived dosages.

| Asset | Initial requirement per unit | Learning role |
|---|---|---|
| Spoken story | One coherent uninterrupted scene or short episode; record its actual duration | Meaning-focused input and voluntary replay |
| Optional practice companion | One to three optional prompts at scene boundaries; longer focused drills are separate clips | Noticing, retrieval and guided output |
| Character scene | Two 60–180 second scenes with different practical contexts | Comprehension and narrative continuity |
| Pattern play | Two 60–120 second clips varying one feature at a time | Retrieval and manipulation |
| Plain speech | At least two voices; clear and conversational recordings | Transfer out of song and familiar narration |
| Item bank | Four recognition, four uncued meaning, four listening, four manipulation and four production prompts, plus held-out variants | Dimension-specific evidence |
| Transfer missions | One guided mission and one held-out mission variant | Task completion and new-context use |
| Delayed review | At least four new prompts using changed words or speakers | Retention and generalization |
| Reading and writing | One brief message, menu, note or story and two purposeful replies | Literacy support |
| Music | A mapped track, reprise or recycled excerpt where useful | Voluntary meaningful repetition |

These counts are reusable authoring coverage, not a launch procurement quota. A scene can serve several units with explicit mappings. Build a complete Arc 1 pilot, then Arcs 2–4, then complete Core; commission later stages according to learner needs. Asset count is never an outcome measure. No 48-song or 48-episode launch requirement exists.

## Dependencies and identification

Unit IDs use S0U1 through S7U6. Target IDs add C1 through C4, for example S1U1C2. Cross-course strand IDs use X01 through X24. These are authoring IDs for this document. Production IDs must be reconciled with existing IDs through an explicit alias table, never by assuming an existing C001 has the same meaning.

Entry dependencies named in unit cards are instructional readiness checks. Only mark a dependency hard when failure would prevent understanding the task itself. Most are recommended recycling targets; the learner may sample later exposure with extra support. Within a card, a target with no specified special dependency uses the card's entry requirements. Exposure to an advanced chunk may occur early without unlocking assessment of the full construction.

Examples of construction edges: S1U1C2 depends on recognizing an infinitive as an action; S1U2C2 builds on S1U2C1 plus an infinitive; S1U3C2 builds on motion voy and time reference; S2U3C2 builds on the me gusta chunk; S3U4C3 builds on affirmative command chunks; S4U3 contrasts completed past with background past; S5U1 and S5U2 require known verb frames to interpret object roles; S6U1 requires a known main-clause frame plus an independently expressed second subject. Do not impose a full conjugation-chart prerequisite for any early chunk.

The sequence below is the expanded authoring order within internal coverage bands. The ten Core Arcs govern Core progression; elective paths can select these packages after Core without requiring every earlier stage card. Audio production, error handling, mastery rubrics and review logic in later sections apply to every card. Each card provides a job, entry concepts, target variants, likely confusions, listening focus and a specific transfer task.
## Stage 0 Get your bearings

### S0U1 Meet and respond

Outcome: Exchange a greeting and leave politely.

Entry and recycling: None; meaning is supplied through short bilingual scenes.

Listening task: Greeting intonation and phrase boundaries.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S0U1C1 greeting chunks | Hola, ¿qué tal? | Buenos días; buenas tardes; buenas noches | Do not translate qué tal word by word. |
| S0U1C2 social response | Bien, gracias. ¿Y tú? | Muy bien; más o menos; ¿y usted? | A response plus return question sustains interaction. |
| S0U1C3 politeness and repair of an interruption | Perdón. Gracias. | Por favor; de nada; disculpe | Perdón and permiso have overlapping but distinct contexts. |
| S0U1C4 farewell | Nos vemos mañana. | Hasta luego; adiós; nos vemos | Mañana here means tomorrow; do not infer all uses of mañana. |

Transfer mission: Meet a new neighbor, respond to a greeting and end the exchange.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Do not require every time-of-day greeting in one check; politeness C3 is recycled support.

Held-out scenario: Neighbor says buenos días and leaves sooner than expected. Return the greeting and close; accept a short suitable farewell.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S0U2 Say who you are

Outcome: Give a name, origin and learning status.

Entry and recycling: Greeting chunks from S0U1.

Listening task: Stress in names and rising versus falling questions.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S0U2C1 name frame | Me llamo Ana. | ¿Cómo te llamas?; ¿cómo se llama usted? | Do not omit me in this chunk. |
| S0U2C2 identity with ser | Soy de Florida. | Soy Ana; soy estudiante | Do not generalize ser as only permanent. |
| S0U2C3 origin question | ¿De dónde eres? | ¿De dónde es usted?; soy de México | de belongs to the origin frame. |
| S0U2C4 learner identity | Hablo un poco de español. | Estoy aprendiendo español; un poco | Do not require fluent grammar for a useful self-description. |

Transfer mission: Introduce yourself to someone who asks your name and origin.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Origin question C3 is receptive first; no country-list quiz or compulsory personal disclosure.

Held-out scenario: New speaker mishears your name; correct it, identify yourself and explain limited Spanish. Fictional identity is allowed.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S0U3 Keep the conversation alive

Outcome: Request slower speech, repetition and meaning.

Entry and recycling: S0U1; learner status from S0U2.

Listening task: Hear entiendo and despacio in clear and conversational versions.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S0U3C1 comprehension repair | No entiendo. | No entiendo bien; entiendo un poco | No entiendo is about comprehension, not no escucho. |
| S0U3C2 repetition request | ¿Puedes repetir, por favor? | Otra vez, por favor; ¿puede repetir? | A request for repetition is different from pretending to understand. |
| S0U3C3 pace request | Más despacio, por favor. | Un poco más despacio | Más is comparative here; avoid teaching despacio as slowly in every construction. |
| S0U3C4 meaning request | ¿Qué significa listo? | ¿Cómo se dice ready en español? | Meaning and how-to-say questions solve different problems. |

Transfer mission: An unfamiliar speaker gives an instruction; ask for help and confirm the meaning.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Introduce one repair strategy immediately before Arc 1. Add meaning/expression requests C4 separately; asking for repetition alone does not prove comprehension.

Held-out scenario: A familiar action is spoken too quickly. Ask for useful support, hear the repair and act on it.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S0U4 Locate something

Outcome: Ask about existence and locate a familiar object.

Entry and recycling: Repair tools; contextual nouns such as agua and baño.

Listening task: Distinguish hay, ahí and allí without relying on spelling.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S0U4C1 existence | Hay agua. | ¿Hay agua?; no hay agua | hay is invariant here; not the location of a known object. |
| S0U4C2 location of a known thing | ¿Dónde está el baño? | Está aquí; ¿dónde está mi teléfono? | Do not use es for this object-location task. |
| S0U4C3 deictic location | Está aquí. | Ahí; allí; allá as receptive variant | These depend on speaker perspective and regional usage. |
| S0U4C4 attention and pointing | Mira, está ahí. | Esto; eso; aquí está | esto and eso stand alone; do not append a noun to esto. |

Transfer mission: Find a bathroom or a needed household object.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Use a visible referent and controlled viewpoint. C4 pointing is support; hay/ahí is a stress/meaning contrast, not a spelling quiz.

Held-out scenario: A needed item exists, but is in a different place than expected. Ask and locate it from the new answer.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S0U5 Hear the shape of Spanish

Outcome: Recognize a short familiar utterance and repeat it intelligibly.

Entry and recycling: S0U1–S0U4 exposure; X01 and X02.

Listening task: Five vowels, word stress and a phrase spoken rather than sung.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S0U5C1 stable vowels | Casa, mesa, vino, poco, uno. | /a e i o u/ in familiar words | Avoid English-style vowel glides; labels are optional. |
| S0U5C2 word stress noticing | Teléfono; café. | Casa; también | Do not give every syllable equal stress. |
| S0U5C3 question versus statement | ¿Está aquí? Está aquí. | ¿Hay agua? Hay agua. | Not all questions must rise; use recordings, not a universal pitch rule. |
| S0U5C4 small listening anchors | Sí, no, aquí, ahora. | No hay; no entiendo | A heard keyword does not prove whole-sentence understanding. |

Transfer mission: Understand which of two familiar messages a new speaker says and respond.

Critical scope: C1,C2. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Receptive/intelligibility target; accent imitation and perfect r are never gates. C3/C4 remain contextual listening support.

Held-out scenario: A new voice says a familiar name or place with changed stress. Identify the intended referent and repeat intelligibly.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S0U6 First complete exchange

Outcome: Combine identity, repair and location in a short exchange.

Entry and recycling: S0U1–S0U4 functional readiness.

Listening task: Unfamiliar voice, ordinary pauses and one repeated phrase.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S0U6C1 confirmation | ¿Aquí? Sí, aquí. | ¿Entendí bien?; correcto | Confirmation is a tool; do not reward guessing from the last word. |
| S0U6C2 not knowing | No sé. | No sé dónde está | No sé and no entiendo are different. |
| S0U6C3 discourse link | Sí, pero no entiendo. | Y; pero | pero contrasts ideas, not merely a pause filler. |
| S0U6C4 turn handoff | ¿Y tú? | ¿Y usted?; un momento, por favor | Pronouns may be useful for contrast even though often omitted elsewhere. |

Transfer mission: Greet someone, introduce yourself, ask where something is and repair one misunderstanding.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Linked turns matter; C3 connectors help but an unnecessary pero is not demanded.

Held-out scenario: A neighbor corrects the room number. Confirm the corrected location, repair if necessary and close.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

## Stage 1 Say what you need

### S1U1 Want something or do something

Outcome: Express a want with a noun or an action.

Entry and recycling: S0U3 repair; familiar nouns and infinitives supplied.

Listening task: Quiero agua versus quiero ir.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S1U1C1 want with a noun | Quiero agua. | Quiero un café; no quiero eso | Count nouns often need an article; agua can be a mass noun. |
| S1U1C2 want with an infinitive | Quiero comer. | Quiero ir; quiero hablar | Second verb stays infinitive when the subject is shared. |
| S1U1C3 direct need | Necesito ayuda. | Necesito tiempo; no necesito eso | Need and want differ in meaning and tone. |
| S1U1C4 need with an infinitive | Necesito salir. | Necesito llamar; necesito descansar | Do not conjugate both verbs. |

Transfer mission: Ask for something, then say what you want to do next.

Critical scope: C1,C2,C3,C4 in two encounters. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Start with want/action; add need later. Quiero agua is not a universal service-politeness model; offer por favor and later request variants.

Held-out scenario: At home you ask for water; later you explain an action you want or need. A choice changes.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S1U2 Have and have to

Outcome: Distinguish possession, states and obligation.

Entry and recycling: S1U1 action frames.

Listening task: Tengo and tengo que in ordinary speech.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S1U2C1 possession or availability | Tengo tiempo. | Tengo dinero; no tengo agua | tengo is not a general equivalent of am. |
| S1U2C2 obligation | Tengo que llamar. | No tengo que ir; tienes que esperar | No tengo que means not required, not prohibited. |
| S1U2C3 tener states | Tengo hambre. | Tengo sed; tengo frío; tengo sueño | Do not use literal estar hambre. |
| S1U2C4 have question | ¿Tienes tiempo? | ¿Tiene tiempo?; tengo veinte años | Age uses tener; numbers are taught through meaningful quantities. |

Transfer mission: Explain what you have available and one thing you must do.

Critical scope: C1,C2. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 states and C4 age/person questions are separate encounters. No tengo que is absence of obligation, not prohibition.

Held-out scenario: A friend offers a visit; you have time but an obligation first. Clarify whether attendance is required.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S1U3 Move and make a plan

Outcome: Say where you are going and what you intend to do.

Entry and recycling: S1U1 infinitives; S0U4 location.

Listening task: Voy a casa versus voy a llamar.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S1U3C1 destination | Voy a casa. | Voy al mercado; vengo de casa | a marks destination; distinguish movement from location. |
| S1U3C2 planned action | Voy a llamar. | Voy a comer; no voy a salir | voy a plus infinitive is not merely physical movement. |
| S1U3C3 invitation to act together | Vamos a comer. | Vamos; ¿vamos?; vamos al parque | vamos can be a suggestion or statement; context matters. |
| S1U3C4 basic sequencing | Ahora voy; después llamo. | Ahora; después; luego | Keep present plans distinct from past stories. |

Transfer mission: Arrange a short visit and explain your next action.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Teach destination versus intended action in separate scenes. C4 time is supported; do not require tense terminology.

Held-out scenario: A meeting place changes. Say destination, next action and a joint suggestion.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S1U4 Can and cannot

Outcome: Express ability, possibility and a simple permission request.

Entry and recycling: S1U1 infinitives; S0U3 repair.

Listening task: Puedo versus puedes and request intonation.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S1U4C1 ability frame | Puedo ayudar. | No puedo ir; puedo hacerlo as supported chunk | No puedo may express inability or situational impossibility. |
| S1U4C2 ability question | ¿Puedes venir? | ¿Puede venir?; ¿pueden venir? | Person ending changes who is addressed. |
| S1U4C3 permission request | ¿Puedo entrar? | ¿Puedo usar esto? | Permission meaning comes from the situation. |
| S1U4C4 knowledge versus ability | No sé, pero puedo preguntar. | Sé dónde está; puedo buscar | Do not treat saber and poder as interchangeable. |

Transfer mission: Say whether you can help and ask permission to enter or use something.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Ability, circumstance and permission are distinct senses. C4 saber contrast is a later bridge, not a six-frame Arc 1 gate.

Held-out scenario: Someone asks for help; you can do one action but not another. Ask permission when the situation calls for it.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S1U5 Like and choose

Outcome: State preferences and make a simple choice.

Entry and recycling: S1U1; pronoun me as chunk, not a full pronoun prerequisite.

Listening task: Me gusta and no me gusta.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S1U5C1 liking a noun or action | Me gusta el café. | Me gusta bailar; no me gusta esperar | gusta agrees with what is liked, not the experiencer. |
| S1U5C2 other person's liking | ¿Te gusta? | ¿Le gusta a usted? | te and le here name the experiencer. |
| S1U5C3 preference | Prefiero agua. | Prefiero comer aquí; ¿qué prefieres? | Stem change is noticed within useful forms. |
| S1U5C4 choice and alternative | ¿Agua o café? | Este o ese; quiero este | Teach o as alternative; gender of demonstratives needs the referent. |

Transfer mission: Choose a drink or activity and ask another person's preference.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 demonstratives need visible referents. Do not score noun gender from a vague image; no compulsory taste disclosure.

Held-out scenario: Two drinks or activities are offered; state a preference and find out the other person’s.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S1U6 Ask and answer useful questions

Outcome: Find out what, where, when, why and how.

Entry and recycling: S0U4; S1U1–S1U4 readiness.

Listening task: Question words without written prompts.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S1U6C1 what and how | ¿Qué quieres? ¿Cómo estás? | ¿Qué necesitas?; ¿cómo se dice? | qué and cómo are not freely interchangeable. |
| S1U6C2 when | ¿Cuándo vas? | Hoy; mañana; más tarde | ¿Cuándo? asks time; ¿cuánto? asks quantity. |
| S1U6C3 reason | ¿Por qué no puedes? | Porque tengo que trabajar | por qué question and porque answer are distinct written forms. |
| S1U6C4 where and destination | ¿Dónde estás? ¿Adónde vas? | ¿A dónde vas?; voy a casa | Location and destination differ even when speakers use dónde colloquially. |

Transfer mission: Arrange a simple plan after asking what, where and when.

Critical scope: C1,C2,C3,C4 across two encounters. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Expand the question bank with quién, cuál and cuánto through the Core register. A correct question word without responding to the answer is incomplete interaction.

Held-out scenario: You are missing where and when a friend is going. Ask, listen and revise the plan.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

## Stage 2 Have a little conversation

### S2U1 Describe people and things

Outcome: Identify and describe a person or object.

Entry and recycling: S0U2 ser; S0U4 estar; familiar noun phrases.

Listening task: Es versus está in simple contrast.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S2U1C1 identity and characterization | Es mi hermana. Es amable. | Soy médico; son estudiantes | ser is not simply permanent; roles and identities can change. |
| S2U1C2 state and location | Está cansada. Está en casa. | Estoy bien; estamos aquí | estar is not simply temporary. |
| S2U1C3 agreement | La casa es pequeña. | El cuarto es pequeño; casas pequeñas | Gender is grammatical, not always biological. |
| S2U1C4 articles and number | Un libro; unos libros. | La mesa; las mesas; el agua fría | el agua does not make agua masculine; later restore agreement. |

Transfer mission: Describe who someone is, where they are and how they seem today.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Add event-location contrast later. C4 articles are supporting accuracy; do not teach permanent/temporary as a universal rule.

Held-out scenario: A new visitor asks which person is your friend and where they are now. Describe and locate them.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S2U2 Talk about family and relationships

Outcome: Describe relationships and ask who someone is.

Entry and recycling: S2U1 description; S1U2 tener.

Listening task: Mi, tu and su inside natural noun phrases.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S2U2C1 possessive determiners | Mi hermana vive aquí. | Tu casa; sus amigos; nuestra casa | su can be ambiguous; clarify whose. |
| S2U2C2 relationship and age | Tengo una hija. Tiene dos años. | Mi pareja; mi amigo; mi familia | Do not assume marriage, children or gender in personalized prompts. |
| S2U2C3 who questions | ¿Quién es? | ¿Quiénes son?; ¿con quién vas? | Number and preposition matter. |
| S2U2C4 relative link | La persona que vive aquí es mi amiga. | El lugar que me gusta | Early que links a noun to information; full relatives come later. |

Transfer mission: Introduce two people and explain a relationship without a memorized family tree.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 relative que is a supported chunk first. Personal a enters familiar person examples early, with fuller treatment S5U2.

Held-out scenario: A photo or fictional contact list contains two possible referents for su. Clarify whose item it is.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S2U3 Express feelings and preferences

Outcome: Describe feelings, plural likes and interpersonal reactions.

Entry and recycling: S1U5 me gusta; S2U1 states.

Listening task: Gusta versus gustan and me versus te.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S2U3C1 feeling state | Estoy contenta. | Estoy triste; estoy nervioso; me siento bien | Accept appropriate gender forms; do not force disclosure. |
| S2U3C2 plural likes | Me gustan estas canciones. | Me gusta esta canción; te gustan | Agreement follows the liked noun. |
| S2U3C3 other gustar-type meanings | Me encanta bailar. | Me interesa eso; me duele la cabeza | These meanings differ; do not teach a single emotional translation. |
| S2U3C4 shared reaction | A mí también. A mí tampoco. | Yo también; yo tampoco with suitable prior clause | Match the response construction and positive or negative antecedent. |

Transfer mission: Choose an activity based on feelings and another person's preferences.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 encantar/interesar/doler is a split extension, not one interchangeable emotion rule. Health vocabulary is optional.

Held-out scenario: A friend likes two activities, you like only one. Agree or disagree with the actual positive/negative antecedent.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S2U4 Describe your routine

Outcome: Explain habitual actions and ask about another person's day.

Entry and recycling: S1U1–S1U4 frames; S2U2 relationships.

Listening task: Present endings and natural omitted subjects.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S2U4C1 regular present patterns | Trabajo aquí. Comes temprano. Vivimos cerca. | Trabajas; come; viven | Practice ar, er and ir in useful forms; avoid conjugating an infinitive after quiero. |
| S2U4C2 high-value irregular present | Hago café y salgo temprano. | Tengo; voy; sé; estoy | Irregular first-person forms need their own examples. |
| S2U4C3 frequency | Siempre desayuno aquí. | A veces; nunca; casi siempre; todos los días | Position varies; never means nunca, not no nunca as a universal formula. |
| S2U4C4 routine reflexive chunks | Me levanto a las siete. | Me acuesto tarde; te levantas | Reflexive pronouns agree with the subject; not every verb takes me. |

Transfer mission: Describe a normal morning and compare with someone else's routine.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 reflexives are a separate chunk encounter. Teach useful stem changes juego/duermo in context; no full paradigm before communication.

Held-out scenario: A morning routine changes today. Distinguish usual action from today’s plan and ask about someone else.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S2U5 Talk about time and plans

Outcome: Set a time and check availability.

Entry and recycling: S1U3 planned action; S2U4 routine.

Listening task: Son las versus es la una; dates and numbers.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S2U5C1 clock time | Son las tres. Es la una. | A las tres; a la una; ¿qué hora es? | Time now versus appointment time use different frames. |
| S2U5C2 day and date | El lunes voy a llamar. | Hoy es lunes; el cinco de mayo | Days are lowercase; el lunes and los lunes differ. |
| S2U5C3 availability | ¿Te viene bien a las cuatro? | Estoy libre; no puedo a esa hora | Teach viene bien as a chunk before full analysis. |
| S2U5C4 rescheduling | Mejor mañana, porque hoy no puedo. | Antes; después de comer; más tarde | de links después to an infinitive or noun. |

Transfer mission: Schedule a meeting and respond to a change of time.

Critical scope: C1,C2,C3,C4 in two encounters. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Numbers are separately supported. Clock time, date, availability and change are not introduced together on one screen.

Held-out scenario: A voice note reschedules a meeting from three to one. Confirm day and appointment time.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S2U6 Sustain a small conversation

Outcome: Combine questions, descriptions and reasons across multiple turns.

Entry and recycling: S2U1–S2U5 readiness; S0U3 repair.

Listening task: Follow-up questions and reaction timing.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S2U6C1 follow-up | ¿Y después qué haces? | ¿Y por qué?; ¿con quién? | A follow-up must respond to actual prior information. |
| S2U6C2 short opinion | Creo que es buena idea. | Para mí; me parece bien | Belief and certainty are not identical. |
| S2U6C3 reason and result | No voy porque trabajo. Entonces vamos mañana. | Porque; entonces; por eso | Cause and consequence have different functions. |
| S2U6C4 hold a turn and clarify | A ver, quiero decir otra cosa. | Bueno; un momento; ¿me explico? | Fillers aid interaction; do not require them in every sentence. |

Transfer mission: Have six linked turns about a routine or weekend plan with one clarification.

Critical scope: C1,C3,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Six linked turns are a task target, not a fluency certificate. C2 opinion frames are optional when no opinion is needed.

Held-out scenario: Follow up on information the partner actually gives, then handle a changed availability.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

## Stage 3 Live your day in Spanish

### S3U1 Food and everyday transactions

Outcome: Order, adjust and pay for food or drink.

Entry and recycling: S1U1 wants; S2U1 noun agreement; S1U5 preferences.

Listening task: Numbers, item quantities and counter-service speed.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S3U1C1 quantity and count | Dos cafés y una botella de agua. | Un poco de; mucho; suficiente | Mucho agrees with a noun but not when modifying a verb. |
| S3U1C2 service request | ¿Me da un café, por favor? | Quisiera un café; ¿me puede dar? | Direct quiero can be grammatical yet differ in politeness; model choices. |
| S3U1C3 modification | Sin azúcar, por favor. | Con leche; para llevar; para aquí | Modifiers must refer to the intended item. |
| S3U1C4 payment | ¿Cuánto es? ¿Puedo pagar con tarjeta? | La cuenta, por favor; en efectivo | Prices are context-specific; do not assume currency or tipping norm. |

Transfer mission: Order two items, request one change and confirm the total.

Critical scope: C1,C2,C3,C4 across encounters. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Use region-tagged service requests; distinguish task success from precise form. No assumptions about tipping, prices or payment access.

Held-out scenario: One menu item is unavailable. Choose an alternative, preserve a requested modification and confirm payment.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S3U2 Shop and compare

Outcome: Ask a price, compare options and explain a choice.

Entry and recycling: S3U1 quantities; S2U1 description.

Listening task: Más que, menos que and prices.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S3U2C1 comparison | Este es más barato que ese. | Menos caro que; tan grande como | más and tan take different comparison frames. |
| S3U2C2 irregular comparison | Este es mejor. | Peor; mayor; menor in appropriate contexts | más bueno has specific uses; assess the intended neutral comparison. |
| S3U2C3 amount and size questions | ¿Cuánto cuesta? ¿Qué talla es? | ¿Cuántos necesita?; más grande | Do not test obscure sizing vocabulary as grammar knowledge. |
| S3U2C4 demonstratives with nouns | Quiero esa camisa. | Este libro; esos zapatos; aquella tienda | esto stands alone; este modifies a masculine noun. |

Transfer mission: Choose between two products with a budget and practical constraint.

Critical scope: C1,C3,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C2 irregular comparison begins mejor/peor; mayor/menor is extension. State all visual labels so the puzzle cannot be solved without Spanish.

Held-out scenario: A cheaper item is the wrong size. Ask and justify a different choice within a budget.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S3U3 Navigate and travel locally

Outcome: Understand directions, transport and basic spatial relations.

Entry and recycling: S0U4 location; S1U3 destinations; S2U5 time.

Listening task: Short direction chunks in an unfamiliar voice.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S3U3C1 spatial relations | Está al lado de la farmacia. | Cerca de; lejos de; enfrente de; entre | Relations are anchored to a reference point. |
| S3U3C2 direction chunks | Sigue derecho y gira a la izquierda. | A la derecha; cruza la calle | Recognize commands as useful chunks before full morphology. |
| S3U3C3 transport | Voy en autobús. | A pie; en carro; me bajo aquí | Carro, coche and auto are region-tagged alternatives. |
| S3U3C4 route question | ¿Cómo llego al mercado? | ¿Dónde me bajo?; ¿este va al centro? | llegar differs from ir; preserve the task's destination. |

Transfer mission: Get to a nearby destination and confirm the correct stop.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 transport words are local variants; change voice without also introducing unknown vocabulary in the scored clip.

Held-out scenario: Your intended stop is unavailable. Understand a familiar direction and confirm a replacement route.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S3U4 Understand and give instructions

Outcome: Make a request, give a command and prevent an action.

Entry and recycling: S1U4 request frames; S3U3 direction chunks.

Listening task: Affirmative and negative commands; tone.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S3U4C1 polite request with puedes | ¿Puedes cerrar la puerta? | ¿Puede traer agua?; por favor | Tone and relationship influence interpretation. |
| S3U4C2 affirmative command | Cierra la puerta. Ven aquí. | Abre; espera; pon; haz; dime; dame | A command is not automatically rude; teach context. |
| S3U4C3 negative command | No abras la puerta. | No vengas; no lo hagas | Do not put no before an affirmative command and assume its form is correct. |
| S3U4C4 sequence and checking | Primero abre esto; luego espera. | Al final; ¿así?; ¿está bien? | Sequencing is communicative, not simply an ordered verb list. |

Transfer mission: Explain how to do a household task and respond to a boundary.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 sequence is supported. Negative commands begin as chunks; imperative morphology is not all-or-nothing. Explain tone and relationship.

Held-out scenario: A household task changes: close one door, leave another open. Ask or give a context-appropriate instruction.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S3U5 Make arrangements and ask for help

Outcome: Request an appointment, explain a problem and get practical help.

Entry and recycling: S2U5 scheduling; S3U4 requests.

Listening task: Polite request chunks and confirmation numbers.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S3U5C1 arrangement frame | Quiero hacer una cita. | ¿Hay lugar mañana?; necesito cambiar la hora | Cita can mean appointment or date; context disambiguates. |
| S3U5C2 problem statement | No funciona. | Está roto; perdí mi teléfono as a supported past chunk | Do not require past-tense analysis to use an urgent memorized chunk. |
| S3U5C3 help and discomfort | Necesito ayuda. Me duele aquí. | No me siento bien; ¿puede llamar a alguien? | This is communication practice, not medical advice or triage. |
| S3U5C4 confirm details | Entonces, el martes a las dos, ¿verdad? | ¿A nombre de quién?; a nombre de Ana | Confirm both date and time; a keyword answer is insufficient. |

Transfer mission: Book or change an appointment and describe one everyday problem.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 discomfort uses fictional concerns; no diagnosis, triage or professional interpreter claim. Arrival details need audio confirmation.

Held-out scenario: A routine appointment time is unavailable. Explain the problem and confirm another time and name.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S3U6 Complete a real day

Outcome: Coordinate an errand, a schedule change and a shared task.

Entry and recycling: S3U1–S3U5 functional readiness.

Listening task: Several short messages with changed speakers.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S3U6C1 purpose with para | Voy al mercado para comprar comida. | Esto es para ti; para mañana | para has several functions; do not teach a single translation. |
| S3U6C2 cause and route with por | Voy por aquí porque es más rápido. | Gracias por ayudar; por la mañana | por and para are not interchangeable; other uses return later. |
| S3U6C3 impersonal obligation | Hay que esperar. | Hay que llamar; tenemos que salir | hay que does not identify a personal subject. |
| S3U6C4 contingency in the present | Si no puedes, voy yo. | Si hay tiempo, vamos | Use present indicative for this real condition; not si tendría. |

Transfer mission: Complete a three-part day mission with one unexpected change.

Critical scope: C1,C3,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C2 por senses are extensions one sense at a time. Different purpose/route/cause meanings do not inherit one score.

Held-out scenario: An errand cannot happen until a shared task is finished. Propose an alternative and explain why.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

## Stage 4 Talk about your life

### S4U1 Tell what happened

Outcome: Narrate completed events with a few common past forms.

Entry and recycling: Present action frames; time language; S2U6 linking.

Listening task: Fui, fue, hice and ayer without a transcript.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S4U1C1 regular completed past | Ayer trabajé y después comí. | Hablaste; compró; salimos; vivieron | Present and preterite overlap for forms such as salimos; context matters. |
| S4U1C2 ir and ser in the past | Fui al mercado. Fue divertido. | Fuimos; fueron; ¿cómo fue? | Same past forms have different meanings from context. |
| S4U1C3 common irregular past | Hice café y tuve tiempo. | Dije; pude; estuve; vino; puso | Do not extrapolate one irregular stem to all verbs. |
| S4U1C4 event sequence | Primero llegué; después llamé. | Ayer; anoche; el otro día; al final | Keep completed event order clear without requiring every ending. |

Transfer mission: Tell someone three things that happened yesterday.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 irregular past is several encounters. Choose high-utility forms first; preserve present/past overlap as a contextual issue.

Held-out scenario: Tell a recent errand; a listener asks where and what happened next. Answer without replaying a memorized paragraph.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S4U2 Describe how things used to be

Outcome: Describe past habits and background states.

Entry and recycling: S4U1 completed past; routine descriptions.

Listening task: Era, estaba and hacía as separate meaning anchors.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S4U2C1 habitual past | Antes trabajaba aquí. | Comía; vivía; todos los días | Imperfect does not always mean used to. |
| S4U2C2 background identity or state | Era pequeño y estaba cansado. | Éramos; estaban; hacía calor | ser and estar remain meaningful contrasts in the past. |
| S4U2C3 past ir habit | Íbamos al parque los domingos. | Iba; iban | Do not confuse iba with fui solely by English gloss. |
| S4U2C4 background time and age | Tenía diez años. | Eran las tres; cuando era niña | Age and time frames require relevant past forms. |

Transfer mission: Describe a place or routine from earlier in your life.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 age/time supports background. A correct English used-to gloss alone does not establish imperfect aspect.

Held-out scenario: Describe a former routine and compare it with now, using fictional history if preferred.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S4U3 Tell a story with background

Outcome: Combine events, ongoing actions and context.

Entry and recycling: S4U1–S4U2; X12 phrase segmentation.

Listening task: An event interrupting ongoing background.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S4U3C1 event against background | Dormía cuando sonó el teléfono. | Estaba cocinando cuando llegó | Tense choice expresses viewpoint, not a list of trigger words. |
| S4U3C2 ongoing action | Estaba trabajando. | Estoy comiendo; estaba esperando | estar plus gerund is not a replacement for every present or imperfect. |
| S4U3C3 when and while | Cuando llegó, yo cocinaba. | Mientras esperaba, llamé | Both verbs' meanings and viewpoints matter. |
| S4U3C4 duration and bounded event | Esperé diez minutos. | Viví allí dos años; esperaba cada tarde | A long duration can still use preterite. |

Transfer mission: Tell a short mishap, explain what was happening and say what changed.

Critical scope: C1,C3,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C2 progressive may be appropriate but is not compulsory if an imperfect expresses the meaning. Avoid trigger-word scoring.

Held-out scenario: Explain an interruption with a changed event and duration. Listener asks what was already happening.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S4U4 Talk about experience and recent change

Outcome: Explain experience, progress and what is still pending.

Entry and recycling: S4U1–S4U3; tener and time reference.

Listening task: He versus había in later contrast; ya versus todavía no now.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S4U4C1 experience or current relevance | He visitado México. | Nunca he probado eso; ¿has ido? | Perfect versus preterite usage varies regionally; avoid a universal today rule. |
| S4U4C2 completed time contrast | Fui a México el año pasado. | Ya comí; hoy hablé con Ana | Latin American varieties may use preterite where other varieties prefer perfect. |
| S4U4C3 already and not yet | Ya terminé. Todavía no termino. | Aún no; todavía estoy aquí | ya has multiple discourse meanings; this unit assesses completion. |
| S4U4C4 duration continuing now | Vivo aquí desde mayo. | Hace dos años que vivo aquí; llevo dos años aquí | desde names a starting point; hace expresses elapsed time in this frame. |

Transfer mission: Explain something you have done, something you did at a stated time and something not yet done.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 continuing duration is a separate bridge. Accept region-appropriate perfect/preterite choices and identify the assessed temporal meaning.

Held-out scenario: Explain an experience, a dated event and a pending task to a new speaker.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S4U5 Explain feelings and relationships

Outcome: Connect feelings, events and perspectives.

Entry and recycling: S2U3 feelings; S4U1 narration; S2U6 reasons.

Listening task: Me sentí versus me siento; reported reactions.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S4U5C1 past feelings | Me sentí mejor después. | Estaba nerviosa; me dio alegría | Different frames convey different viewpoints; avoid literal feeling translations. |
| S4U5C2 reason and concession | Me gustó, aunque fue difícil. | Pero; porque; sin embargo | aunque with indicative here reports an accepted fact. |
| S4U5C3 interpersonal event | Hablé con mi amiga y nos vimos. | Nos conocimos; quedamos en llamar | Reciprocal nos is introduced through known subjects. |
| S4U5C4 opinion with justification | Creo que fue buena idea porque ayudó. | Me parece que; en mi opinión | Assess a reason, not agreement with the narrator. |

Transfer mission: Discuss a fictional disagreement and explain two people's reactions.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 reciprocal events are a separate encounter. Do not score emotional agreement or force disclosure about relationships.

Held-out scenario: A fictional disagreement has two viewpoints; explain a reaction and acknowledge the other view.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S4U6 Tell a connected account

Outcome: Narrate, explain background and respond to questions.

Entry and recycling: S4U1–S4U5 readiness.

Listening task: A changed voice asks follow-ups outside the scripted story.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S4U6C1 story orientation | El sábado estaba en casa cuando llegó Ana. | Hace un año; una vez | Anchor people, time and place for a listener. |
| S4U6C2 causal connection | Llegué tarde, así que llamé. | Por eso; entonces; como estaba cansado | Cause and consequence need coherent event order. |
| S4U6C3 story repair | Me equivoqué: fue el viernes. | Quiero decir; mejor dicho | Self-correction counts as successful communication when meaning is restored. |
| S4U6C4 listener check | ¿Y qué pasó después? | ¿Cómo te sentiste?; ¿por qué lo hiciste? | Answer the question actually asked; do not replay the whole memorized story. |

Transfer mission: Give a two-minute account and answer three unscripted questions.

Critical scope: C1,C2,C3,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Two minutes is a task estimate. Coherence and response relevance outrank filling time with memorized speech.

Held-out scenario: Tell an account, correct a mistaken day and answer an unexpected follow-up about cause.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

## Stage 5 Keep up with people

### S5U1 Refer to things naturally

Outcome: Understand and use direct objects with familiar verbs.

Entry and recycling: S1U1 infinitive frames; S3U4 commands; known noun referents.

Listening task: Lo, la, los and las in conversational speech.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S5U1C1 direct object replacement | Lo necesito. La compré. | Los tengo; las quiero | Gender and number follow the referent; lo also has non-noun uses later. |
| S5U1C2 placement with an infinitive | Quiero verlo. | Lo quiero ver; voy a comprarla | Both placements can be acceptable; do not mark one wrong. |
| S5U1C3 placement with gerund | Estoy buscándolo. | Lo estoy buscando | Written accent may change; spoken and orthographic evidence remain separate. |
| S5U1C4 command attachment | Dámelo. | Ábrela; no lo abras | Affirmative commands attach clitics; negative commands put them before. |

Transfer mission: Discuss a known item without repeating its name in every turn.

Critical scope: C1,C2. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 gerund and C4 attached commands are split extensions. Accept both valid clitic placements; accent spelling is written evidence.

Held-out scenario: Two familiar items have different owners. Refer to the correct item and clarify after a listener’s question.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S5U2 Say who receives something

Outcome: Understand indirect objects and combined pronouns.

Entry and recycling: S5U1 objects; dar and decir frames.

Listening task: Le, les and se lo without treating se as always reflexive.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S5U2C1 recipient object | Le doy el libro a Ana. | Les digo la hora; te mando un mensaje | le is not simply him; it can refer to her or formal you. |
| S5U2C2 two objects | Se lo doy a Ana. | Te lo mando; me lo dijo | le or les changes to se before lo, la, los or las. |
| S5U2C3 clarify referents | Se lo di a ella. | A él; a usted; a ellos | Use clarification when pronouns alone are ambiguous. |
| S5U2C4 personal a | Veo a Ana. | Busco a mi hermana; veo la casa | Teach through person references; do not put a before every direct object. |

Transfer mission: Pass on a message and clarify who gets which object.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 personal a is first noticed earlier; now extend it systematically. Do not award comprehensive pronoun knowledge from one se lo.

Held-out scenario: Two people need different items; explain who gets what and repair an ambiguous se lo.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S5U3 Notice what happened unexpectedly

Outcome: Distinguish reflexive, reciprocal and common se constructions.

Entry and recycling: S2U4 reflexive routine; S4U1 past; S5U2 recipient.

Listening task: Se me cayó in a short unscripted explanation.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S5U3C1 reflexive versus reciprocal | Me visto. Nos vemos mañana. | Se lava; se ayudan | se has multiple functions; these are not one reflexive rule. |
| S5U3C2 unplanned event frame | Se me cayó el teléfono. | Se me olvidó; se nos perdió | Common unintentional-event framing does not excuse or erase responsibility. |
| S5U3C3 impersonal or passive-like notice | Se habla español. Se venden libros. | Se puede pagar aquí | Distinguish the patterns at recognition level before full analysis. |
| S5U3C4 change or become chunks | Se puso nervioso. | Me quedé en casa; se quedó dormido | Do not teach every become meaning as ponerse. |

Transfer mission: Explain a small accident, ask about an object and understand a service notice.

Critical scope: C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C1 reflexive/reciprocal and C4 change-of-state are separate sense encounters. Se is not one construction or one global mastery record.

Held-out scenario: Explain a misplaced object and understand a new service notice.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S5U4 Follow longer explanations

Outcome: Connect clauses, compare reasons and understand reference.

Entry and recycling: S2U2 relative que; S4U6 stories; S5U1 objects.

Listening task: Clause boundaries and referents over several sentences.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S5U4C1 relative person and place | La persona que llamó vive donde trabajo. | El lugar donde nos vimos | Do not force donde after a person. |
| S5U4C2 what as lo que | No entiendo lo que dices. | Lo que necesito es tiempo | lo que means the thing or information that; not a masculine object noun. |
| S5U4C3 contrast and concession | Aunque estaba cansado, fui. | Sin embargo; aun así | Following a concession differs from spotting a familiar connector. |
| S5U4C4 earlier past | Ya había salido cuando llamaste. | Había comido; no lo había visto | Past perfect locates an event before another past point. |

Transfer mission: Listen to a 60–90 second explanation, identify the reason and ask one relevant follow-up.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 past perfect is a separate temporal encounter. Do not require it to prove clause/reference listening.

Held-out scenario: A speaker gives two reasons and a qualification. Summarize accurately and ask a relevant follow-up.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S5U5 Make plans and predictions more flexibly

Outcome: Interpret future, conditional courtesy and ongoing time.

Entry and recycling: S1U3 voy a; S4U4 experience; S5U4 clause links.

Listening task: Voy a, future endings and conditional chunks.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S5U5C1 simple future | Mañana te llamaré. | Será; tendremos; podré | Also hear the common voy a alternative; register and intention differ. |
| S5U5C2 polite conditional | ¿Podrías ayudarme? | Me gustaría ir; quisiera as a familiar request chunk | Conditional courtesy does not require a hypothetical if clause. |
| S5U5C3 probability chunk | Debe de estar en casa. | Quizá está aquí; estará en casa as recognition extension | Both deber and deber de can express conjecture; separate obligation/probability by meaning and context, not a mechanical de rule. |
| S5U5C4 ongoing duration | Sigo aprendiendo. | Todavía estudio; llevo dos meses practicando | Different frames relate duration and continuation. |

Transfer mission: Compare plans, predict a practical outcome and make a polite request.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 probability is an extension; debe estar and debe de estar can express conjecture. Meaning and register, not mechanical de presence, determine acceptance.

Held-out scenario: A plan changes; make a polite request and explain an ongoing commitment.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S5U6 Understand people beyond the cast

Outcome: Follow familiar topics with new voices, tempo and accent.

Entry and recycling: S5U1–S5U5; X12–X16.

Listening task: Connected speech, word boundaries and meaning-preserving regional variants.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S5U6C1 reformulation | O sea, vamos mañana. | Es decir; quiero decir | Do not confuse a reformulation marker with new factual content. |
| S5U6C2 discourse ya | Ya veo. Ya voy. | Ya está; ya as completion recycling | Context determines meaning; not every ya means already. |
| S5U6C3 natural reactions | Qué bueno. No me digas. | ¿En serio?; claro; puede ser | Tone can reverse or modify a literal reading. |
| S5U6C4 accent and register variation | ¿Tú quieres venir? / ¿Vos querés venir? | Usted; ustedes; region-tagged vocabulary | Recognition of a variant does not require using it; no accent is defective. |

Transfer mission: Respond to two unfamiliar voice notes and complete a ten-turn exchange.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 regional variation is receptive first. Changing accent and unknown lexicon together confounds assessment.

Held-out scenario: Two unfamiliar voices describe a familiar plan; respond to a correction and reaction.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

## Stage 6 Express what you mean

### S6U1 Express wishes and influence

Outcome: Distinguish own action from a desired action by someone else.

Entry and recycling: S1U1 quiero plus infinitive; S2U4 present forms; separate clause subjects.

Listening task: Quiero ir versus quiero que vayas.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S6U1C1 same versus different subject | Quiero ir. Quiero que vengas. | Necesito salir; necesito que me ayudes | que plus a second subject is not an infinitive chain. |
| S6U1C2 present subjunctive in a wish | Espero que estés bien. | Quiero que sea fácil; espero que puedas | Teach useful forms and meaning before demanding all forms. |
| S6U1C3 impersonal evaluation | Es importante que llegues a tiempo. | Es mejor que esperemos | No second clause is needed in es importante descansar. |
| S6U1C4 request softening | Te pido que me avises. | Prefiero que lo hagamos mañana | Register varies; a subjunctive alone does not guarantee politeness. |

Transfer mission: Ask someone to do something and explain your own intended action.

Critical scope: C1,C2. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3/C4 evaluation and request softenings are separate encounters; useful subordinate forms can be chunks before full paradigms.

Held-out scenario: You will act yourself, then need someone else to act. Express both without a supplied clause frame.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S6U2 Handle uncertainty and reactions

Outcome: Express belief, doubt and an emotional reaction accurately.

Entry and recycling: S6U1 clauses; S2U6 creo que.

Listening task: Creo que es versus no creo que sea.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S6U2C1 belief contrast | Creo que viene. No creo que venga. | Pienso que; no pienso que | Polarity is a useful contrast, not an exhaustive mood rule. |
| S6U2C2 possibility frame | Puede que llueva. | Es posible que venga; tal vez viene or venga by stance | Some adverbs allow more than one mood depending on stance. |
| S6U2C3 reaction | Me alegra que estés aquí. | Me sorprende que no puedas | Subjective reaction and factual reporting differ. |
| S6U2C4 subjunctive negated command revisit | No lo hagas todavía. | No vengas; no se preocupe | Connect to Stage 3 command chunks; do not treat this as wholly new. |

Transfer mission: Discuss an uncertain plan and distinguish a known fact from a doubt.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 negative commands recycle known chunks. Do not apply a universal uncertainty=subjunctive rule.

Held-out scenario: A plan includes one confirmed fact and one uncertain possibility. Explain the distinction and a reaction.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S6U3 Give advice and negotiate

Outcome: Suggest an action, explain a trade-off and disagree tactfully.

Entry and recycling: S5U5 conditional courtesy; S6U1–S6U2.

Listening task: Podrías, deberías and request tone.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S6U3C1 advice alternatives | Podrías llamar primero. | Deberías descansar; te recomiendo que preguntes | Advice strength depends on wording and relationship. |
| S6U3C2 tactful disagreement | Entiendo, pero prefiero otra opción. | No estoy de acuerdo porque; tienes razón en eso | Partial agreement is different from surrendering the whole point. |
| S6U3C3 trade-off | Es más rápido, pero cuesta más. | Por un lado; por otro lado | Explain both consequences, not just a connector pair. |
| S6U3C4 joint proposal | ¿Y si vamos mañana? | Podemos hacerlo así; ¿qué te parece si...? | Present if suggestion is not the counterfactual structure. |

Transfer mission: Help choose between two options without dictating the other person's decision.

Critical scope: C1,C2,C3,C4 across encounters. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Politeness is context-sensitive. Advice strength and listener autonomy count; agreement is never compulsory.

Held-out scenario: Two options trade speed for cost. Suggest, disagree tactfully and reach or decline a joint plan.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S6U4 Imagine alternatives

Outcome: Discuss hypothetical situations and unreal alternatives.

Entry and recycling: S5U5 conditional; S4U2 past contrasts; S6U2 mood readiness.

Listening task: Si tuviera versus si tengo.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S6U4C1 real versus hypothetical condition | Si tengo tiempo, voy. Si tuviera tiempo, iría. | Si pudiera, lo haría | Do not put conditional directly after si in this standard counterfactual pattern. |
| S6U4C2 imperfect subjunctive useful forms | Si fuera más fácil, lo intentaría. | Tuviera; pudiera; supiera; fuese as recognition variant | This is not an imperfect indicative form. |
| S6U4C3 conditional consequence | Yo elegiría esta opción. | Haría; tendría; podría; sería | Intelligible reasons matter alongside form accuracy. |
| S6U4C4 past unreal extension | Si hubiera sabido, habría llamado. | Hubiese; hubiera llamado in appropriate accepted variants | This is a stretch target; allow B1 learners to remain with present hypotheticals. |

Transfer mission: Explain what you would do under a changed budget or schedule.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 unreal past is optional stretch and cannot block the basic hypothetical outcome. Accept reviewed -ra/-se forms.

Held-out scenario: A budget changes; explain a present hypothetical choice and contrast it with a real condition.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S6U5 Talk about purposes and boundaries

Outcome: Express purpose, future contingencies and limits.

Entry and recycling: S3U6 para; S6U1 subject change; S6U4 alternatives.

Listening task: Para versus para que; cuando with future reference.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S6U5C1 purpose by subject | Salgo para comprar comida. Te llamo para que vengas. | Para que podamos hablar | Same-subject and different-subject purpose frames differ. |
| S6U5C2 future time clause | Cuando llegues, me llamas. | En cuanto llegue; antes de que salgas | Future reference can call for subjunctive in the time clause, not future tense everywhere. |
| S6U5C3 known versus sought referent | Busco a alguien que habla español. Busco a alguien que hable español. | Un lugar que tiene / tenga patio | Mood reflects how the referent is presented, not merely whether busco appears. |
| S6U5C4 boundary and condition | Voy, con tal de que terminemos temprano. | Aunque llueva, voy; siempre que | Concession with subjunctive can leave truth open or treat it as irrelevant. |

Transfer mission: Explain a plan's purpose and agree on conditions for following it.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 known/sought referent is a separate advanced encounter. Score stance and intended referent, not busco as an automatic mood trigger.

Held-out scenario: Explain purpose, a future time condition and a boundary under changed timing.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S6U6 Express a considered view

Outcome: Sustain an opinion, qualify certainty and negotiate a resolution.

Entry and recycling: S6U1–S6U5 readiness.

Listening task: Evidence markers and follow-up challenges.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S6U6C1 qualified stance | Hasta donde sé, funciona. | No estoy segura; por lo que entiendo | Express certainty proportional to evidence. |
| S6U6C2 reasoned recommendation | Recomiendo esta opción porque cuesta menos. | Lo mejor sería que probáramos primero | Different acceptable structures can express the same stance. |
| S6U6C3 conditioned agreement | Estoy de acuerdo si cambiamos la hora. | De acuerdo, siempre que podamos terminar | Do not assess ideological agreement; assess the conditional commitment. |
| S6U6C4 repair of nuance | No digo que sea malo; digo que no me sirve. | No exactamente; lo que quiero decir | A learner should be able to repair an overstrong interpretation. |

Transfer mission: Discuss a practical choice for five minutes, explain trade-offs and reach or decline agreement.

Critical scope: C1,C2,C3,C4 across encounters. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: No required ideological position or jargon. Five minutes is approximate; the language must show qualification and responsive reasoning.

Held-out scenario: Discuss a practical choice, respond to new evidence and repair an overstrong interpretation.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

## Stage 7 Make Spanish your own

### S7U1 Tell stories people want to hear

Outcome: Shape an extended narrative with listener-aware detail.

Entry and recycling: S4U6 narrative; S5U4 linking; S6U2 stance.

Listening task: Natural pacing, prominence and a speaker's digression.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S7U1C1 narrative emphasis | Lo más raro fue que nadie llamó. | Resulta que; al final | Do not imitate dramatic filler at the expense of clarity. |
| S7U1C2 reported speech | Me dijo que estaba cansada. | Dijo que venía; me preguntó si podía | Perspective and time reference matter; tense backshift is not mechanical in every context. |
| S7U1C3 perspective and detail | Según ella, todo salió bien. | Desde mi punto de vista; mientras tanto | Separate narrator fact from someone else's report. |
| S7U1C4 summarize the point | En pocas palabras, perdimos el autobús. | Lo importante es que llegamos | Summary selects meaning rather than repeats every event. |

Transfer mission: Tell a three-minute story, answer interruptions and summarize its point.

Critical scope: C1,C2,C3,C4 across encounters. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Backshift depends on perspective and temporal meaning. Do not reward dramatic fillers without narrative coherence.

Held-out scenario: Tell an unfamiliar anecdote, distinguish your view from reported speech and summarize after an interruption.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S7U2 Read tone and respond socially

Outcome: Interpret humor, indirectness and emotional tone.

Entry and recycling: S5U6 reactions; S6U3 tact; X19–X24.

Listening task: Same words with sincere, teasing or irritated delivery.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S7U2C1 check tone or intent | ¿Lo dices en serio? | ¿Es una broma?; ¿qué quieres decir? | Do not infer intent from words alone. |
| S7U2C2 soften and hedge | No sé si sea la mejor opción. | No sé si es la mejor opción; quizá podríamos | Accept regional and stance-sensitive mood variation. |
| S7U2C3 indirect invitation or refusal | Me encantaría, pero no puedo. | A ver si podemos; lo vemos luego | These can imply different commitments; ask rather than stereotype. |
| S7U2C4 repair a social misread | Perdón, entendí otra cosa. | No quería decir eso | Politeness norms vary by person and region. |

Transfer mission: Identify a speaker's stance, check an interpretation and respond appropriately.

Critical scope: C1,C3,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C2 mood variants require region/stance review. One clip cannot prove a universal interpretation; ambiguity allows clarification.

Held-out scenario: The same phrase is delivered sincerely or teasingly. Check intent rather than guessing a cultural stereotype.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S7U3 Understand media and longer input

Outcome: Extract meaning and stance from authentic-length content.

Entry and recycling: S5U4 explanations; S7U1 reporting; X12–X16.

Listening task: Two to four minutes with natural speed and optional captions after first listen.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S7U3C1 main point and support | La idea principal es que necesitamos tiempo. | Por ejemplo; según el autor | A correct keyword list is not a coherent summary. |
| S7U3C2 inference with evidence | Parece que está molesto porque cambió de tono. | Da a entender que | Mark inference as inference. |
| S7U3C3 quotation versus summary | Ella dijo eso, pero yo entendí otra cosa. | En otras palabras; mencionó que | Preserve the speaker's meaning and uncertainty. |
| S7U3C4 unknown-word strategy | No conozco esa palabra, pero entiendo la idea. | Por el contexto; ¿se refiere a...? | Permit unresolved details while checking essential meaning. |

Transfer mission: Summarize a voice note, interview excerpt or short story and distinguish fact from opinion.

Critical scope: C1,C2,C3,C4 across encounters. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Authentic-length does not mean unscreened audio. Rights, lexical reach and transcript accuracy must be reviewed.

Held-out scenario: Summarize a new short interview, separate fact and inference and leave a nonessential unknown word unresolved.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S7U4 Explain and defend a viewpoint

Outcome: Organize an argument, ask for support and revise a claim.

Entry and recycling: S6U6 considered view; S7U3 summaries.

Listening task: Contrasts between a claim, example and qualification.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S7U4C1 structured position | Mi propuesta es cambiar la hora por dos razones. | Primero; además; por último | Structure should serve substance, not formulaic recital. |
| S7U4C2 counterargument | Es cierto que cuesta más, pero dura más. | Aunque entiendo tu punto | Represent the other person's point accurately. |
| S7U4C3 ask for evidence | ¿En qué te basas? | ¿Tienes un ejemplo?; ¿cómo lo sabes? | Tone changes whether a question sounds curious or confrontational. |
| S7U4C4 revise a claim | Tienes razón en eso; cambiaría mi propuesta. | No había considerado esa parte | Revision is communicative success, not loss of points. |

Transfer mission: Present two reasons, answer a counterargument and modify a point if warranted.

Critical scope: C1,C2,C3,C4 across encounters. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: Reward responsive reasoning in Spanish, not agreeing with an assessor. Avoid unfamiliar domain knowledge deciding the score.

Held-out scenario: Defend a practical proposal, fairly restate a counterargument and revise after new information.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S7U5 Use regional and personal Spanish

Outcome: Choose a coherent production lane while understanding alternatives.

Entry and recycling: S5U6 regional recognition; S7U2 pragmatics.

Listening task: Multiple speakers within each region; no one voice stands for a country.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S7U5C1 address forms | ¿Tú puedes? / ¿Vos podés? / ¿Usted puede? | Ustedes pueden; vos sos; vos tenés | Voseo is not limited to Argentina; usage varies locally. |
| S7U5C2 regional vocabulary | Carro, coche, auto. | Celular; teléfono; region-tagged local terms | Do not claim every regional word is universal or restricted to one country. |
| S7U5C3 regional sound recognition | Identify known words in naturally reduced speech. | S aspiration or deletion in labeled clips; yeísmo variants | Recognition target only; do not caricature speakers or demand imitation. |
| S7U5C4 register choice | ¿Podría ayudarme? / ¿Me ayudas? | Written message versus casual voice note | Choose by relationship and situation, not a universal formal country stereotype. |

Transfer mission: Understand the same practical exchange in two regional versions and choose your preferred production forms.

Critical scope: C1,C2,C4. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C3 sound reduction is receptive only. Use several speakers per region; no accent or country is a single uniform profile.

Held-out scenario: Understand two reviewed regional versions and choose a consistent address/register lane in a new exchange.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

### S7U6 Capstone and continuing immersion

Outcome: Demonstrate sustained practical communication and choose the next growth goal.

Entry and recycling: Stage 7 units; delayed evidence in earlier critical targets.

Listening task: Unfamiliar interlocutor, unexpected detail and ordinary conversational pacing.

| Target ID and focus | Model example | Required variants | Main confusion to address |
|---|---|---|---|
| S7U6C1 extended interaction | Negotiate a plan with changing constraints. | Ask, clarify, respond, revise and close | A rehearsed script does not establish spontaneous ability. |
| S7U6C2 mediation and explanation | Explain a short notice to another person in simple Spanish. | Summarize a plan; clarify an instruction | Do not require professional translation or medical interpretation. |
| S7U6C3 self-directed repair | Rephrase a missing word and keep going. | Describe it; ask what it is called | Reward effective repair without pretending the missing vocabulary is known. |
| S7U6C4 continuing learning plan | Identify a topic and listening gap to work on next. | Media, community exchange, domain vocabulary | Completion opens maintenance and growth; it does not imply native-like fluency. |

Transfer mission: Complete a fifteen-minute mixed scenario plus a delayed retest in a different context.

Critical scope: C1,C2,C3. These are unit-local coverage requirements, not additional learner unlocks.

Scaffolding and acceptance revision: C4 continuing plan is reflective, not a graded language gate. Fifteen minutes and all eight stages do not confer B2 or native-like fluency.

Held-out scenario: Negotiate changing constraints, explain a short notice and repair a missing word with an unfamiliar interlocutor.

Evidence package: collect evidence appropriate to the declared critical function; keep reading, listening and generated output separate. Use controlled familiar vocabulary, record hints and accept successful natural alternatives while granting target credit only for the observed construction. Recheck a changed situation later; do not reuse the teaching answer as held-out evidence.

## Cross course pronunciation listening and interaction strands

These 24 targets run alongside the units. They are not a preliminary pronunciation course that delays communication. Each includes perception, a meaningful use and an acceptance rule. Being unable to trill an r does not block a learner from advancing in unrelated communication.

| ID | Target and first emphasis | Example or contrast | Assessment and later reuse |
|---|---|---|---|
| X01 | Five stable vowels from Stage 0 | a e i o u in casa, mesa, vino, poco, uno | Hear a vowel contrast in familiar words and produce intelligible vowels in a phrase; reuse across all stages |
| X02 | Stress and written accent from Stage 0 | café, teléfono, término, terminó | Identify intended word from stress; score spelling separately from spoken meaning |
| X03 | Syllable grouping from Stage 0 | quiero agua; tengo que ir | Repeat meaningful groups without inserting English-style pauses; song rhythm is not the only model |
| X04 | Question and statement prosody from Stage 0 | ¿Está aquí? versus Está aquí | Interpret recordings in context; do not teach one mandatory rising contour |
| X05 | Silent h and meaningful consonant contrasts from Stage 1 | hola, ahora; una versus uña | Recognize and produce meaning-bearing differences in suitable clean contexts |
| X06 | Tap and trill r from Stage 1 | pero versus perro; caro versus carro | Listen first, then supported articulation; intelligibility outweighs a perfect trill |
| X07 | b and v spelling versus sound from Stage 1 | bien, vivir | Do not require an English b/v contrast; assess spoken clarity and orthography separately |
| X08 | j and g before e or i from Stage 1 | gente, jugar | Use regional recordings; accept intelligible regional realization |
| X09 | ñ and palatal patterns from Stage 1 | mañana, niño, año | Discriminate and produce in familiar phrases rather than isolated technical labels |
| X10 | ll and y variation from Stage 2 | yo, calle, lluvia | Introduce yeísmo and regional realizations receptively; no one realization is universal |
| X11 | Linking across words from Stage 2 | voy a ir; los amigos | Segment connected speech and reconstruct meaning; do not invent a reduced spelling rule |
| X12 | Chunk and clause boundaries from Stage 2 | no puedo ir / porque trabajo | Identify reasons, referents and scope across a phrase, then a paragraph |
| X13 | Unstressed function words from Stage 3 | de, que, me, lo, se | Hear small words inside meaningful contrasts; do not score a full clause from a lone keyword |
| X14 | Conversational speed from Stage 3 | same task recorded clearly and naturally | Compare comprehension across versions; speech rate is recorded per clip, not assumed from a speed slider |
| X15 | New voices from Stage 0; wider accent variation by Core integration | same function from different Latin American speakers | Keep vocabulary familiar while varying speaker; then add regional words separately |
| X16 | Reduction and sound weakening from Stage 5 | labeled natural clips with weakened s or intervocalic d | Receptive recognition; do not force learners to imitate reduction or present it as careless Spanish |
| X17 | Turn taking from Stage 0 | ¿Y tú?; un momento | Enter, hold and yield a turn appropriately in a short exchange |
| X18 | Repair escalation from Stage 0 | repeat, slow down, paraphrase, confirm | Ask for the right support and verify the repaired meaning |
| X19 | Backchannels from Stage 2 | claro, ajá, entiendo | Show listening without falsely agreeing; cultural QA reviews timing and tone |
| X20 | Topic continuation from Stage 2 | ¿Y después?; ¿con quién? | Ask a relevant follow-up that depends on what was said |
| X21 | Register and address from Stage 1 | tú, usted, ustedes | Choose and maintain a suitable form; accept community-appropriate variation |
| X22 | Word search and circumlocution from Stage 3 | es una cosa que usamos para... | Convey the missing concept and continue; do not award knowledge of the missing word |
| X23 | Tone and implied meaning from Stage 5 | no me digas; claro; lo vemos | Interpret multiple deliveries and ask when intent is uncertain |
| X24 | Self correction and nuance from Stage 4 | mejor dicho; no exactamente | Repair meaning while maintaining conversation, later revisiting the inaccurate target |

Production practice uses a short clear spoken model, optional mouth-position coaching, a contrasting recording and a meaningful phrase. Avoid long repetitive articulation drills that produce fatigue. Speech recognition can help collect a response; it does not establish pronunciation accuracy simply because transcription succeeded.

## Lexical inventory and expansion policy

The following banks are required seed vocabulary, not disconnected quizzes or exhaustive word-count goals. Attach each lemma or chunk to approved examples, an audio asset, meaning senses, grammatical features, register and regional tags. Teach a small set when needed by the unit; recycle it through other contexts. The same lemma may need separate sense records. Polysemy should not silently inherit mastery from one learned meaning.

A new lexical entry needs: stable ID; lemma; part of speech; sense; translation or plain-language meaning; pronunciation model; gender and irregular plural where relevant; two collocations; two contrasting examples; a likely confusion; region/register label; and linked units. A word-family count cannot substitute for performance. Frequency rankings should be checked against an appropriate licensed corpus before making any numerical high-frequency claims; these selections reflect utility and framework coverage, not a computed frequency list.

| Bank and first emphasis | Required seed entries | Expansion rule |
|---|---|---|
| Interaction Stage 0 | hola, gracias, por favor, perdón, disculpe, permiso, de nada, sí, no, bien, mal, más o menos, otra vez, despacio, entiendo, no sé, qué, cómo, dónde, quién | Teach whole exchanges; add greetings by time and regional response variants |
| Generative verbs Stages 1–2 | querer, necesitar, tener, poder, ir, venir, hacer, ser, estar, haber, saber, entender, hablar, decir, dar, ver, escuchar, mirar, buscar, encontrar | Seed useful forms first; add person and tense variants through the relevant units |
| Daily actions Stages 1–3 | comer, beber, tomar, comprar, pagar, trabajar, estudiar, aprender, llamar, mandar, usar, ayudar, esperar, salir, llegar, llevar, traer, abrir, cerrar, poner, quitar, dejar, limpiar, cocinar, dormir, descansar, caminar, manejar | Maintain distinctions such as llevar/traer and oír/escuchar in context |
| Routine and relationships Stages 2–4 | vivir, levantarse, acostarse, despertarse, vestirse, bañarse, sentirse, gustar, encantar, interesar, preferir, conocer, recordar, olvidar, preguntar, responder, pedir, explicar, pasar, quedar, volver, empezar, terminar, seguir | Add senses gradually; quedar and pasar require distinct contextual entries |
| People Stages 0–2 | persona, gente, amigo, amiga, pareja, familia, madre, padre, hijo, hija, hermano, hermana, niño, niña, bebé, vecino, compañera, colega, jefe, estudiante, cliente | Personalize without assuming family structure, gender or employment |
| Reference and small words Stages 0–3 | yo, tú, usted, él, ella, nosotros, nosotras, ustedes, ellos, ellas, me, te, se, nos, lo, la, los, las, le, les, mi, tu, su, nuestro, este, ese, aquel, esto, eso, algo, nada, alguien, nadie, todo, otro, cada | Stage pronoun functions; early exposure does not certify the full object system |
| Relations and connectors Stages 1–6 | a, de, en, con, sin, para, por, entre, sobre, hasta, desde, antes, después, y, o, pero, porque, entonces, también, tampoco, aunque, mientras, cuando, si, que, donde, así que, por eso, además, sin embargo | Pair each with a meaningful contrast and scope check |
| Time Stages 1–4 | ahora, hoy, mañana, ayer, anoche, temprano, tarde, luego, todavía, ya, siempre, nunca, a veces, pronto, día, noche, semana, mes, año, hora, minuto, lunes, martes, miércoles, jueves, viernes, sábado, domingo | Add all month names when date tasks begin; test spoken times and dates with varied voices |
| Place Stages 0–3 | aquí, ahí, allí, allá, cerca, lejos, dentro, fuera, arriba, abajo, delante, detrás, derecha, izquierda, casa, cuarto, cocina, baño, puerta, mesa, silla, calle, parque, mercado, tienda, farmacia, oficina, escuela, ciudad, país | Distinguish reference point and direction from static location |
| Personal items Stages 0–3 | agua, comida, café, té, leche, azúcar, pan, arroz, fruta, verdura, pollo, carne, pescado, huevo, botella, vaso, taza, plato, teléfono, celular, llave, bolsa, libro, ropa, camisa, pantalón, zapatos, dinero, tarjeta, cuenta | Add learner-relevant items in bundles of four to eight, then require a practical exchange |
| Description Stages 1–3 | bueno, malo, grande, pequeño, nuevo, viejo, bonito, caro, barato, fácil, difícil, rápido, lento, cerca, lejos, listo, ocupado, libre, abierto, cerrado, suficiente, diferente, igual, importante, posible | Some entries differ by part of speech or ser/estar; teach collocations, not flat glosses |
| Feelings and body Stages 2–4 | contento, feliz, triste, cansado, nervioso, preocupado, tranquilo, enfermo, hambre, sed, frío, calor, sueño, miedo, dolor, cabeza, mano, pie, espalda | Use fictional situations for optional sensitive topics; communication exercises give no diagnoses |
| Quantification Stages 1–3 | uno through veinte; thirty through ninety; cien, ciento, mil; primero, segundo, último; mucho, poco, más, menos, tanto, bastante, demasiado, cuánto, cuántos, mitad | Author explicit number-generation and listening activities; include noun agreement and prices |
| Reasons and nuance Stages 4–7 | idea, problema, solución, razón, opinión, opción, experiencia, cambio, resultado, ejemplo, acuerdo, duda, oportunidad, ventaja, riesgo, parece, quizá, tal vez, seguro, probablemente, en realidad, por lo menos | Add domain terms only after an everyday use scaffold exists |

Numbers and dates require their own micro-lessons: 0–10, 11–20, 21–29, tens, hundreds, prices, phone-number grouping, times and calendar dates. Do not hide these behind a generic numbers badge. Color and clothing banks remain available for meaningful shopping or description tasks, but do not consume the first learning blocks as exhaustive memorization lists.

## Grammar coverage and recurring contrasts

Each productive construction receives a meaningful contrast, optional explanation and open use. Include manipulation when it helps reveal the construction; receptive, pragmatic and discourse targets use comprehension or interaction tasks instead. Full paradigms live in a searchable Grammar Lab. Learners access them when useful; completing a chart never unlocks a stage by itself.

| Construction | First functional use | Systematic revisit and contrast |
|---|---|---|
| Infinitive chains | S1U1–S1U4 | Shared subject versus quiero que at S6U1 |
| Present tense and omitted subjects | Early chunks; S2U4 productive system | High-value irregular and stem-changing forms in routine, questions and commands |
| Negation and questions | Stage 0–1 | Scope, nadie/nada/nunca, double negation and question-word prepositions in Stages 3–5 |
| Articles and gender/number | Early noun phrases; S2U1 | el agua fría, adjective placement, plural likes and demonstratives |
| ser, estar and hay | Stage 0–2 | Object location, event location with ser, profession, state and meaning-changing adjectives in Stages 3–5 |
| gustar and experiencers | S1U5 | Singular/plural and a mí también at S2U3; me duele and interests recur |
| Time, quantity and comparison | Stages 1–3 | ago/since/for meanings, equal comparison and mejor/peor |
| Commands and request frames | S3U3–S3U4 | Negative commands, usted/ustedes, pronoun attachment at S5U1 and S6U2 |
| Reflexive and reciprocal frames | S2U4 | Se constructions and accidental-event frames at S5U3 |
| por and para | S3U6 | Purpose, recipient, deadline, route, cause, exchange and duration in contextual micro-lessons |
| Preterite and imperfect | S4U1–S4U3 | Viewpoint, bounded duration, interruptions and storytelling; avoid trigger-word-only rules |
| Progressive, perfect and duration | S4U3–S4U4 | Present relevance by region, continuing time and past perfect at S5U4 |
| Object pronouns and personal a | Early chunks; system at S5U1–S5U2 | Clitic order, alternative placement, le/les to se and referent clarification |
| Relative clauses and lo que | Early que at S2U2 | Longer reference chains at S5U4; known/sought referents at S6U5 |
| Future and conditional | voy a in S1U3; expanded S5U5 | Probability, politeness, hypotheticals and unreal past at S6U4 |
| Subjunctive | Negative command chunks Stage 3 | Wishes, stance, reactions, future time, purpose and hypotheticals in Stage 6 |
| Reporting and discourse | Story links Stage 4 | Reported speech, perspective, stance and argument in Stage 7 |

Required micro-lessons supplement the unit examples: contraction al/del; saber versus conocer; pedir versus preguntar; ir versus venir and llevar versus traer from speaker perspective; bueno/bien and malo/mal; muy/mucho; adjective placement that changes interpretation; hace versus desde; qué versus cuál in useful questions; no tengo que versus no debo; no hay versus no está; ser location of an event versus estar location of a thing; tan/tanto; negative indefinite words; participles hecho, dicho, visto, puesto, vuelto, abierto, escrito, roto; personal a; donde versus adonde; spoken pronouns versus accent-mark spelling; and region-sensitive perfect/preterite usage.

The productive subject inventory is yo, tú, él/ella/usted, nosotros/nosotras and ellos/ellas/ustedes. Build regular ar/er/ir forms in present, preterite and imperfect, then high-value irregular families. Teach vosotros only as a comprehension or traveler add-on. Full voseo production is a region-specific extension reviewed by speakers of the intended variety. Avoid mixing tú present with vos commands in the same untagged production model.

## Music architecture and album map

Album 01 retains the eight-track project contract, with optional recall Track 09. Track order is a listening collection, not a rigid unlock sequence. A true beginner can listen immediately and request Stage 0 support or an optional phrase preview. Scored checks require known lexical prerequisites; entertainment does not require completing instruction. Track 01 deliberately exposes wants, obligation and intention together; systematic distinctions are taught in S1U1–S1U3. Thus music can introduce the larger idea without demanding mastery of every construction in one song.

| Track | Learning job and targets | Recycling | Spoken bridge and active check |
|---|---|---|---|
| 01 Anchor Spanglish | S1U1C2 quiero + action; S1U2C2 tengo que; S1U3C2 voy a | S0U3 repair; now/later | Hear three intention types, retrieve one phrase, then choose and say what you want, must and plan to do |
| 02 Movement | S1U3C1 destination; S0U4C3 location; S1U3C4 sequence | quiero and voy a | Map an audio direction to meaning; tell a new speaker where you are going |
| 03 Want Need Can | S1U1C1/C3; S1U4C1 | tengo que and familiar actions | Compare want, need and ability; answer a new practical request |
| 04 Question Hook | S1U6C1–C4 across separate companion activities | Known first-person frames | Ask relevant questions; check whether the response answers them |
| 05 Atmospheric Reinforcement | No required new grammar; recycle first four tracks | S0U3 and S1U1–S1U4 | Unfamiliar plain-spoken version and delayed meaning check; replay alone remains exposure |
| 06 Household Mission | S3U4C1 and familiar command chunks from S3U4C2 | ir/venir, location, want/need | Interpret a task and request help; early command exposure does not certify command morphology |
| 07 Grammar Remix | Person/polarity contrast from S2U4 and S1 frames | quieres, tienes, puedes, vamos | Change one feature without a word bank; then produce a personal answer |
| 08 Latin Signature / Spanish Heavy Reprise | Familiar Album 01 targets with reduced English | All earlier album language | Check new voice and new scene without transcript, restoring support if comprehension drops |
| 09 Optional Recall Version | Selected core targets with strategic gaps | All earlier material | Recall a phrase then use it outside the lyric; correct lyric completion alone is not spontaneous transfer |

### Required Latin signature track on every album

Every album includes at least one original track grounded in a specific Latin musical tradition. This is a required album role within the planned track count, not an automatic extra or bonus track. Genre personalization may vary other songs but must preserve at least one such track in each album edition.

“Authentic” is a production and review ambition, not a claim automatically earned by Spanish lyrics, a percussion preset, an AI prompt or a singer's nationality. Choose a named tradition and coherent regional production reference, then review groove, instrumentation, arrangement, vocal phrasing, idiom and register with practitioners/listeners familiar with that tradition. Do not treat Latin music as one sound or combine cultural markers indiscriminately.

The song is Spanish-first, with natural phrases and a story or feeling that stands on its own. Avoid inserted English grammar explanations and rhyme-forced syntax. Early albums can use simple language and familiar hooks while allowing supported exposure-only words. Optional translations and companion teaching remain outside the song. One to three primary constructions are enough; assess them later in plain speech. Listening still produces exposure, not mastery.

Album 01: reserve Track 08, the Spanish-heavy reprise, for the first Latin signature track. Initial commissioning direction is a contemporary cumbia treatment that recycles familiar wants/plans and an outing or shared-evening scene. This is a candidate direction, not an approved rendition or a universal representation of cumbia; choose its specific production lane during commissioning. Keep the other seven tracks available for the broader genre mix.

Later albums rotate traditions rather than requiring the same sound every time. Candidate lanes include bachata, salsa, bolero, reggaeton and additional cumbia treatments. Select the lane that best serves the lyric and album; identify the specific tradition in the brief. Final genre assignments follow listening and cultural/musical review, not a fixed stereotype about a learner or country.

Each album's release record names its signature track, genre/tradition, production references, language targets, exact lyric map and review status. The requirement remains unfulfilled until the actual audio passes language, musical and rights review. Never mark an album complete merely because this role has a written brief.

A song has one main musical hook and normally one to three primary constructions, with a small set of secondary lexical targets. Track 04's four question functions should be assessed across multiple brief activities, not one overloaded screen. Songs may contain decorative unknown language if it is contextually interpretable and not essential to an assessed task. Mark it exposed-only; do not conceal the true learner difficulty with a nominal target count.

For every song, write an actual lyric-to-concept map with line IDs and timecodes, exact Spanish words, intended senses, target status and companion activities. Store Spanish density as the fraction of intelligible sung lexical tokens, with a stated tokenization rule; report spoken-teaching support separately. Rough bands such as 25–45 percent introductory Spanish, 45–70 percent mixed and 70–95 percent Spanish-heavy are production starting points, not mastery thresholds. Do not present an unmeasured number for an existing song.

Later collection briefs:

| Collection | Curriculum coverage | Proposed track jobs |
|---|---|---|
| Album 02 Everyday Conversation | Stage 2 plus due Stage 1 | Identity/state contrast; family and reference; singular/plural liking; morning routines; time and plans; six-turn scene; person remix; Spanish-heavy jam |
| Album 03 Out in the World | Stage 3 | Café scene; quantities and comparison; direction call-and-response; polite request versus command; rescheduling scene; por/para purpose contrasts; practical-day remix |
| Album 04 Tell Me What Happened | Stage 4 | Completed-event hook; earlier-life scene; background/event contrast; experience and not-yet; feelings and reasons; narrative reprise |
| Album 05 Keep Up | Stage 5 | Direct-object hook; recipient scene; se event story; lo que and longer clauses; future/courtesy; familiar language in new regional voices |
| Album 06 Say What You Mean | Stage 6 | Want to versus want someone to; certainty/doubt; advice; present hypothetical; future time/purpose; negotiated-choice scene |
| Album 07 Yours to Use | Stage 7 | Narrative and reported speech; tone; media-inspired summary; viewpoint and counterargument; region-specific versions; familiar-language free jam |

These are commissioning briefs, not a requirement to make each construction into a track. Use genres broadly: pop, atmospheric R&B, hip-hop/trap, dance/reggaeton, indie/alternative rock, acoustic, Latin pop and suitable regional lanes. Offer clean equivalents. The curriculum target remains the same across genre variants; musical preference changes delivery, not who receives useful language.

Previously discussed tracks No Traduzco, Vámonos Ya, Qué Más Da and Mírame Ahora are candidate catalog entries. Their lyrics and audio were not supplied in the documents read, so target coverage, Spanish density and release status are unverified. No Traduzco may be an identity/recovery or review track; no traduzco is not automatically a beginner priority. Map exact lyrics and review language before assigning targets. Song names do not establish their instructional coverage.

Music release checks: Spanish stress and pronunciation remain understandable; rhyme has not forced unnatural grammar; the phrase works in ordinary speech; translations preserve sense; the target is audible over production; an unsung version exists; and held-out checks do not merely test remembered lyric order. Record rights and provenance for lyrics, composition, vocal assets and distribution. A commercially usable track requires a separate rights check for the chosen production platform and assets.

## Podcast and spoken teaching system

Use the established recurring cast Sofía, Mateo, Camila, Nico and Elena as provisional story identities, with a concise narrator and additional unfamiliar speakers. Characters have personal traits and relationships rather than nationality stereotypes. A favorite character never becomes a required pedagogical dependency.

Every episode needs a character goal, obstacle, consequential choice and payoff. Spanish dialogue must carry the essential premise and resolution without English narration. Simple language does not require empty characters. Story lines may exceed the assessed lexical envelope when supported; they cannot secretly become assessment prerequisites. Maintain a distinct uninterrupted Listen edit and an opt-in Practice companion. Practice normally offers one to three prompts at meaningful boundaries, with explanations and models outside the dramatic exchange. This is a commissioning hypothesis, not a measured optimal dose. A learner can request more drills separately.

Segment types are scene, narrator bridge, noticing, retrieve, model answer, variation, learner turn, mission and debrief. Each has text, audio/timecodes, speaker ID, region, register, primary targets, recycled targets, support level and response specification. A blank pause is not automatically a scored assessment. Offline response opportunities are useful practice even when the system cannot evaluate them.

A normal retrieval pause starts around four to seven seconds; an open sentence may need eight to twelve seconds. These are adjustable defaults, not a speed test. Model answers are examples, not the only allowable language. A repeat button, slower clear version and transcript remain available when stationary. A later unfamiliar speaker checks understanding beyond the cast.

Narrator English is initially brief and available. Reduce narration support when listening evidence supports it, while retaining tap-to-reveal translations and optional explanations. Listen mode can be mostly Spanish for learners who understand it and remains uninterrupted. Optional Practice mode offers responses; selecting Listen never requires speaking. Never assume a global English ratio captures proficiency across all modalities.

Drive mode is passive, uninterrupted audio listening with familiar language: no response demand, scoring, microphone capture or oral challenges while moving. It has no screen-based task, timed pressure or relaxation/hypnosis layer. Learners can listen without responding and save hard segments for later. There is no hidden microphone collection. Any prompt practiced mentally or spoken without capture is logged as practice opportunity, not verified production. At-home audio mode can support richer response pauses and optional recording by explicit choice.

## Learning evidence and mastery rules

Store evidence by dimension. The instructional progression is exposure, recognition, meaning recall, listening comprehension, manipulation, guided production, independent production and spontaneous transfer. It is not a mandatory linear staircase: learners may show strong production of a memorized chunk while needing listening work, and listening with no choices can be harder than a simple transformation.

The existing architecture's weights are optional ranking hints, not calibrated probabilities. This specification makes the policy explicit: exposure contributes zero to assessed mastery and remains a separate engagement record. Do not repeatedly add 0.05 exposure until a target becomes learned. Recognition must not spill automatically into production confidence. Spontaneous transfer is scoped to the observed task and target, not awarded to every word in the conversation.

| Dimension | Valid evidence | Evidence that does not establish it |
|---|---|---|
| Exposure | Audio played or material viewed with reliable playback metadata | Familiarity inferred from liking a genre |
| Recognition | Correct meaning/form choice across changed examples | Repeating a single identical item until correct |
| Meaning recall | Unaided explanation or translation before answer reveal | Picking from a word bank; parroting the shown answer |
| Listening | Understand a spoken prompt without transcript; record choices if present | Reading a transcript while audio plays |
| Manipulation | Change person, polarity, time or referent with controlled lexical demands | Dragging a memorized sentence with obvious word-order cues alone |
| Guided production | Original response using a frame, scene cue or partial support | Singing along with complete visible lyrics |
| Independent production | Learner-generated appropriate response without lexical answer cues | Transcribing an identical familiar recording |
| Transfer | Successful unannounced use or understanding in a new communicative setting | A different background image on the same memorized prompt |

### Provisional confidence and progression policy

Maintain separate states not observed, supported, emerging, ready to stretch, retained and needs review for each applicable dimension. Retained is time-sensitive and never permanent. Record sample size, diversity, delay and uncertainty. Do not display a scientific-looking mastery percentage based on sparse data.

Arc readiness, retention and framework proficiency are three different decisions. Core uses the scoped Arc gates in the coverage register and current production pack. Immediate readiness needs usable evidence for each critical function, normally transcript-free comprehension and an uncued generated use for a productive frame. Reuse recent eligible evidence; sample missing functions rather than deliver the whole bank. One listening and one generated response is a provisional routing minimum, not a reliability guarantee. Ambiguity triggers a changed probe. A manipulation probe is required only where that pattern manipulation is a critical function; interactional chunks do not require artificial transformations.

A frame can be provisionally ready before a delayed review. Retention needs repeated support-free success in changed contexts, including a later check around a week after first instruction. Receptive targets need new-voice comprehension rather than forced production. Transfer requires an information gap or unexpected change and appropriate response without naming the desired construction. Every decision records scope, support, delay, novelty, uncertainty and policy version. Fixed four-of-five and 80-percent totals from the older baseline are removed as universal gates; item difficulty and human-rated outcomes must calibrate the eventual decision policy.

The 48 authoring units never add a second unlock system. Stage capstones audit optional broader pathways. A skill profile records demonstrated spoken, written and receptive abilities separately. If recording is declined, a written response can demonstrate written production and support continued access; spoken ability remains unobserved. That is not a language failure. Core completion requires the declared functions across its ten Arcs, not full mastery of every sense or conjugation of all 100 seed concepts.

### Mission rubric

Each mission defines its required communicative actions, acceptable paraphrases and specific target constructions before use. Score task completion, comprehension, target use, intelligibility and repair separately on a 0–3 scale: 0 no demonstrated success; 1 substantial assistance; 2 success with minor support or recoverable errors; 3 independent and appropriate success. Score writing conventions only for written tasks.

Mission completion initially requires task completion and comprehension at least 2, with intelligibility at least 2 where speech is captured. A target receives independent production evidence only when that target's use is independently correct and appropriate. A learner can complete a transaction with broken grammar while still needing a grammar target reviewed. Conversely, perfect conjugation in an irrelevant reply does not complete the task.

Do not require a target when a natural alternative would accomplish the mission. Record a successful alternative as task success and, where mapped, evidence for its actual concept. A prompted target is assessed production, not spontaneous transfer. If the speaker asks an unannounced question naturally eliciting it, mark context and prompt novelty before granting transfer credit.

## Review scheduling and recommendation logic

Use deterministic scheduling for the first implementation. Exact intervals are configurable hypotheses. Store due dates per concept and relevant dimension, not just one shared due date for a word. A recently replayed song does not reset a recall interval.

Initial schedule after instruction: an attempted retrieval later in the same session, then approximately one, three, seven, fourteen and thirty days after successive qualifying successes. Time the next interval from the last qualifying event; do not pile up six tests on a learner returning after a gap. A supported answer gets a shorter revisit without being labeled failure. An unaided changed-context success can extend the interval; a lapse prompts a targeted correction, a changed item later in the session if appropriate, and a review within about one day.

Two failures on the same target in a session trigger a mode change or stop for that target. Offer a clear model and a small successful practice before ending. Avoid endlessly shrinking intervals or trapping a learner in weak material. After a long break, start with a few informative checks, then restore due work gradually. Latency is diagnostic only when a user opts into timed practice; motor speed, disability, anxiety and device delays must not be confused with knowledge.

Recommendation order:

1. Filter to approved content with available assets, valid prerequisites and a task suited to the selected mode. Driving, passive music and recorded-speaking modes have different eligible activities.
2. In Active mode, offer one or two useful due retrievals; allow deferral. In Listen mode, begin playback without a compulsory review. Batch overdue work and avoid a review-debt punishment.
3. Select a relevant current-unit activity. Introduce one or two targets if prerequisites are usable and recent difficulty is manageable.
4. Include a change of context or modality and an opportunity to say something as oneself.
5. End with a useful mission, enjoyable familiar content or an appropriate stopping point. Queue later review rather than demand immediate perfection.

A practical starting allocation is about half due/recycled content, one quarter current or new targets and one quarter mission or fluent reuse in an active session. Adapt it to goals and frustration rather than imposing the percentages on every playlist. Rank due importance, task relevance, recent errors, novelty and preference; explain the selection with reason codes such as due_recall, weak_listening, mission_prerequisite or preferred_genre_review. For guided practice, preference operates within educational eligibility. For voluntary listening, the learner can choose any approved available track; recommendation is advice, not a prerequisite gate on entertainment.

Error classes and interventions:

| Observed difficulty | Next action | Follow-up evidence |
|---|---|---|
| Meaning confusion | Contrast two familiar meanings in a scene | Uncued changed-context explanation |
| Retrieval failure | Brief model, partial cue, then a new recall opportunity | Delayed response before answer reveal |
| Listening parsing | Clear spoken phrase, boundary support, then new voice | Transcript-free meaning response |
| Person or tense form | Vary one grammatical feature with known words | New transformation and original sentence |
| Pronoun reference | Clarify who gives what to whom with familiar verbs | New referent interpretation and production |
| Word order | Compare understandable alternatives and repair one clause | Learner-generated changed clause |
| Register mismatch | Show the relationship and two possible deliveries | Appropriate request in a new relationship |
| Pronunciation | Hear a meaningful contrast and practice a clear phrase | Intelligible production and listening discrimination |
| ASR or audio failure | Repeat or use text without negative learning evidence | Record unresolved technical status |

## Onboarding and returning learners

Onboarding asks about intended uses, previous exposure, listening comfort, willingness to speak or record, English-support preference, music tastes, mature-content preference and available modes. Separate self-description from demonstrated baseline. Let a learner skip recording or decline an emotionally personal scenario.

The initial diagnostic should take about six to ten minutes and be skippable. Use roughly twelve sampled tasks across simple meaning recognition, transcript-free listening, uncued phrase retrieval, basic person/polarity manipulation and short open response. Branch up after success and down after difficulty. It is a routing sample, not a reliable proficiency certificate. Repeat weak or uncertain dimensions later with fresh items.

Sample prompts: identify which action a speaker intends; explain tengo que ir without choices; hear ¿Puedes venir mañana? without text; respond to a need for help; change a familiar sentence to a different person; explain one recent event if early items are easy. Do not show a written Spanish prompt for an activity advertised as a listening diagnostic.

A returning learner with strong recognition but slow retrieval starts with audio-plus-response work and can bypass already demonstrated greeting practice. A reader with weak listening receives familiar vocabulary in new voices. A fluent speaker with limited spelling receives literacy practice without being forced back through elementary speaking units. Until a delayed retest arrives, all baseline states are provisional.

Stage placement is the earliest stage containing important unresolved functions, with access to later useful exposure. Personal lanes such as household Spanish, travel, social life or work select contexts and lexical slots. They do not remove general repair, interaction, tense and listening coverage. Alexandra's returning-school-Spanish profile is a pilot persona, not the default user.

## Games and app surfaces

| Mechanic | Targeted cognitive action | Evidence label | Design constraint |
|---|---|---|---|
| Hear and choose meaning | Interpret spoken content | Listening with choice support | No transcript before response; change voice and distractors |
| Explain what was heard | Recall meaning from speech | Listening plus meaning recall | Accept paraphrase; do not require English phrasing identical to the key |
| Complete without a word bank | Retrieve an appropriate form | Recall | Admit multiple correct completions |
| Change the person or time | Transform a known construction | Manipulation | Keep unrelated vocabulary familiar |
| Respond to a voice note | Comprehend and generate a reply | Guided or independent production | Record assistance and whether the answer was captured |
| Order with a changing constraint | Achieve a practical objective | Production and mission evidence | Alternatives count; planned targets are not automatically spontaneous |
| Solve a small scene puzzle | Infer relevant information | Comprehension or reasoning | A puzzle solved visually earns no Spanish evidence |
| Gapped song or karaoke | Retrieve a lyric or phrase | Cued recall | Follow with ordinary spoken use |
| Unannounced conversational turn | Recombine known language | Transfer candidate | Approved task, held-out context and reliable evaluator required |

Show prompts that match the media state. If no clip has played successfully, do not ask What did you hear. Provide Replay, Read instead or a task appropriate to available assets. Reading instead changes the evidence modality. A transcript revealed after a response is feedback; revealing it before the response is support and must be logged.

Games should not convert all successful clicks into identical points. Rewards and completion can remain playful, while the learning record stays honest. Speaking, typing, choosing and passive listening are distinct routes; choosing a mode should not silently imply competence in the others.

## AI conversation and scoring contract

AI conversation runs within an approved mission, concept inventory, lexical envelope, register and difficulty. It can ask natural follow-ups, adapt support, give feedback and identify candidate target use. It cannot invent canonical prerequisites, change learner state directly or claim professional language certification.

Every task supplies learner-facing purpose, hidden scenario state, permitted complications, critical actions, expected meaning, acceptable alternatives, target IDs, scaffolding limits and a rubric. Allow the conversation to succeed through paraphrase. Do not reward copying a suggested reply as independent output. If the learner opts out of personal disclosure, use a fictional role.

AI scoring is initially a suggestion with evaluator version and confidence. Promotion to high-confidence state requires reliable evidence and, in pilot calibration, human-reviewed samples. Collect disagreements for review. An ASR transcription error, inaudible audio or uncertain target attribution yields unscored or needs-human-review, not an incorrect answer. The same recorded response must not create duplicate evidence on replay or retry.

Feedback normally addresses one meaning-blocking problem and one useful target, then gives the learner another chance. Use concise models rather than long corrections during an otherwise successful exchange. Keep a separate after-conversation summary with strengths, pending targets and a recommended next activity. Pronunciation scoring requires acoustic evidence; a text-only model can assess transcribed grammar but cannot reliably diagnose accent from text.

## Implementable data and authoring contract

The canonical program is content data plus versioned rules. It belongs outside interface components and model prompts. The following specification is for implementation; it does not assert that these fields have been deployed.

Concept records contain concept_id, legacy_aliases, curriculum_version, stage_id, unit_id, concept_type, communicative_function, canonical_label, sense, productive_or_receptive, core_or_extension, critical_for_unit, hard_prerequisites, recommended_prerequisites, example_variants, accepted_answers, common_errors, dialect_register_tags, rubric_id and QA_status. Variant records store exact forms, sense, subject/person, tense/mood where relevant, translation, example context, region, audio asset and language review.

Content records contain content_id, version, format, title, unit_links, speakers, language_and_region, primary_targets, recycled_targets, exposed_only_targets, assessed_targets, target_timecodes, lexical_envelope, support_level, estimated_duration, active_or_passive_mode, response_capture, evidence_dimension, rights_provenance, review_status and accessible_alternative. For songs add track_role, album_order, genre, song_version_family, lyric_lines and measured_spanish_density. For audio add segment type, pause duration and fallback text.

Evidence events are append-only records containing learner_id, event_id, activity_version, concept_id, timestamp, evidence_dimension, response_modality, response_capture_status, correct_or_rubric_scores, hint_level, answer_revealed_before_response, attempt_number, item_family_id, prompt_novelty, context_novelty, speaker_id, audio_rate, prior_instruction_delay, technical_status, evaluator_version and evaluator_confidence. Media playback events, favorites and self-reported practice live in distinct engagement records.

Derived state holds dimension-specific status, qualifying_event_count, diversity, last_success, last_error, next_due, uncertainty and policy_version. It is recomputable from events. Store only necessary learner data; optional speech recording needs clear consent, retention controls and deletion behavior before rollout. Context personalization should never require medical, family or workplace sensitive details.

Example target record:

    concept_id: S1U2C2
    canonical_label: tener que plus infinitive obligation
    type: construction
    function: describe obligation or absence of obligation
    prerequisites: familiar action infinitive; tengo recognition
    model: Tengo que llamar.
    variants: Tienes que esperar.; No tengo que ir.
    rejected_meaning: No tengo que ir means I must not go.
    unit_critical: true
    content_links: Album01Track01; EpisodeS1U2; MissionS1U2
    evidence_needed: delayed recall; listening; independent output
    QA_status: draft_pending_native_review

Before importing, resolve the legacy mapping with fields old_id, old_label, new_authoring_id, semantic_match_status, migration_action and reviewer. Preserve evidence identity: an existing target that genuinely matches can keep its ID and add an alias; a different sense gets a new target. A new curriculum version does not retroactively turn old exposure into production evidence.

Authoring validation must catch missing targets, absent assets, contradictory answer keys, impossible dependencies and cycles. Every critical productive target needs a plain-speech variant, a delayed check and a held-out mission opportunity. Do not label a unit released if the mission exists only as an idea or its audio has not been produced.

## Worked practice companion for S1U2

### Unit purpose and entry

The learner distinguishes having something, needing to do something and not being required to do it. Primary targets are S1U2C1 tengo, S1U2C2 tengo que, S1U2C3 tener states and S1U2C4 tienes questions or age. Teach C1 and C2 first; put states and age in a later encounter. Entry is familiar querer/action frames, repair language, and llamar, ir, esperar and tiempo with support as needed.

Primary contrast: Tengo tiempo means I have time. Tengo que llamar means I have to call. No tengo que ir means I do not have to go. To convey a prohibition in this level, use a separately taught supported chunk such as No puedes entrar or No debes entrar with contextual explanation. Do not accept the prohibition interpretation for this target.

### Focused practice script

This is an optional teaching clip, not the uninterrupted podcast template. The current Arc 1 story in docs/CORE_ARC_01_PRODUCTION_PACK.md supplies the entertainment model.

Narrator: Two little sounds change the job of the sentence. Listen to Camila first.

Camila: Tengo tiempo, pero tengo que llamar a Sofía.

Nico: ¿Tienes que llamar ahora?

Camila: Sí. Después puedo ir contigo.

Narrator: What does Camila have: time, or an obligation? She actually tells you both. Try the first phrase for having time. Pause five seconds. Tengo tiempo. Now say that you have to call. Pause six seconds. Tengo que llamar.

Camila: No tengo que ir hoy.

Narrator: Does that mean she must not go, or she is not required to go? Pause five seconds. She is not required to go. If she chooses, she still might. Now tell Camila you have to wait. Pause seven seconds. One possible answer is Tengo que esperar.

Nico: Tengo hambre. ¿Tienes comida?

Camila: Sí, tengo pan. Podemos comer después de la llamada.

Narrator: Tengo also carries familiar states: Tengo hambre, I am hungry. Do not try to translate every word one-for-one. Tell us whether you are hungry, thirsty or neither. Pause ten seconds. Model examples: Tengo hambre. Tengo sed. No tengo hambre.

Sofía: Hola. ¿Puedes venir mañana?

Narrator: Answer as yourself. Give one thing you have to do first, then say whether you can come. Pause twelve seconds. A possible reply is Tengo que trabajar, pero después puedo ir. Your answer can be different.

Narrator: Later, we will ask again with a different situation. For now, keep the useful contrast: Tengo tiempo. Tengo que llamar.

Production notes: Introductory bilingual support is intentional. A more Spanish-heavy version follows later evidence. Record clear and ordinary conversational versions; target phrases are spoken naturally. Script is draft and must receive language and performance review. Passive episode playback produces exposure; only captured and evaluated responses produce scored evidence.

### Assessment items and accepted meaning

| Item | Prompt before support | Accepted response or criterion | Evidence |
|---|---|---|---|
| A | Audio Tengo tiempo | Have time; equivalent paraphrase | Transcript-free listening with meaning recall if no choices |
| B | Audio Tengo que llamar | Has to / must call; distinguish obligation from possession. A need paraphrase counts only when required action is preserved; do not collapse necesito and tengo que in a contrast task | Listening and meaning recall |
| C | Audio No tengo que ir hoy | Not required to go today; must not go is incorrect for target meaning | Listening contrast |
| D | Calling is required before you leave. Explain the constraint in Spanish | Tengo que llamar antes de salir or suitable learned equivalent | Uncued elicited production; not spontaneous transfer |
| E | Change Tengo que esperar so you ask the other person | ¿Tienes que esperar? or ¿Tiene que esperar? when formality is specified or accepted | Manipulation |
| F | Audio ¿Tienes tiempo mañana? | Natural answer about availability, with understood tomorrow | Comprehension and production scored separately |
| G | You are thirsty and ask if there is water | Tengo sed. ¿Hay agua? or meaningful paraphrase | Guided scene production |
| H | New speaker asks whether you can join now | Explain an actual or fictional obligation without naming tener que in the prompt | Transfer candidate if held-out context and independently scored |

Hints: first a contextual cue such as think about obligation; then a partial frame Tengo...; then the full model. Track hint level and answer reveal. A correct response after the full model is practice, not unaided recall. Accept optional yo where natural, appropriate address variants and understandable non-target grammar mistakes without changing the target-specific score.

### Scene and mission specifications

Scene one: a friend is arranging a visit. Scene two: a person needs to finish an errand before joining a meal. Keep contexts and nouns different while holding the obligation contrast stable. A later unfamiliar speaker asks about availability using known vocabulary. Add an unexpected timing change; do not tell the learner which construction to use.

Guided mission success requires explaining availability, one obligation and a next step. Held-out mission success requires understanding a new question and conveying a constraint, allowing alternative language. Target evidence is granted only for the actual construction used. Review after about one day with ir or esperar, after about three days with ayudar, and after about seven days within a changed plan. These are scheduling defaults subject to observed performance.

### Song commissioning brief

Album 01 Track 01 can recycle this unit alongside quiero and voy a. Hook contrast: wanting versus obligation versus planned action. Use two or three familiar actions, clear audible consonants, natural stress on tengo and llamar, and an emotional situation someone would replay. Avoid teaching the obligation phrase through an unnatural rhyme. Companion micro-lesson isolates tengo versus tengo que; a later plain-spoken check removes the melody cue. Existing lyrics must be mapped before release.

### Release requirements

Two reviewed speaker recordings, explicit negative-obligation meaning, multiple correct answer alternatives, two changed-context scenes, a held-out task, delayed prompts and validated playback fallback. A native-speaking reviewer checks idiomaticity and register; a pedagogical reviewer checks whether unrelated vocabulary obscures the target. This package's structure is reusable, but later units need their own scripts, keys and missions rather than noun substitutions alone.

## Stage capstones and held out tests

| Stage | Required task | Surprise or transfer variation | Delayed check |
|---|---|---|---|
| 0 | Meet someone, ask a location, repair one misunderstanding | New voice and different object | Repeat the function on another day without greeting script |
| 1 | Coordinate wants, needs, ability and a simple plan | One changed availability or destination | Uncued wants/obligation/intention contrast after a week |
| 2 | Six to ten linked turns about people, routine and plans | Follow-up based on the learner's actual answer | New voice and a different day/time |
| 3 | Complete an errand, request help and adjust a schedule | An item is unavailable or the time changes | Another routine problem with familiar language |
| 4 | Give a connected account and explain background | Unexpected who/when/why question | Different story prompt with event/background checks |
| 5 | Interpret two voice notes and hold a ten-turn exchange | New speakers and referent changes | Pronoun/reference and natural-listening checks |
| 6 | Compare options, express uncertainty and negotiate | A condition changes or another view challenges the plan | New advice or hypothetical task |
| 7 | Fifteen-minute mixed conversation plus a media summary | Unfamiliar topic within lexical reach, nuance and clarification | Different context after seven to fourteen days |

Time and turn counts are practical task specifications, not proficiency ratings. Use a human-reviewed sample of capstones during the pilot. Avoid reusing identical held-out scenarios as teaching content. Provide alternate tasks of comparable function to prevent memorization and accommodate accessibility preferences. Learners can demonstrate strong receptive ability without participating in a recorded-speaking capstone; report the missing evidence explicitly rather than infer it.

## Optional motivation mental rehearsal and experimental layers

Established core design uses retrieval, spaced opportunities, feedback and varied meaningful use. Mental rehearsal, future-use visualization, rhythm and identity-supportive language are optional engagement supports. Experimental binaural or Gateway-inspired ideas are separately labeled and opt-in. They are not prerequisites, scored learning events or demonstrated subconscious programming.

A brief home-listening entry may invite the learner to picture successfully asking for a coffee, take a comfortable breath and then actually answer the spoken prompt. Identity language should be credible and action-linked: Me equivoco y sigo; Puedo preguntar; Cada vez entiendo más when understood and contextually appropriate. Avoid guarantees, shame, hidden persuasion, subliminal claims or personalized declarations of ability unsupported by evidence.

Never include relaxation, entrainment or hypnosis-style instructions in driving mode. Binaural layers should have a normal-audio alternative and must not obscure speech. If tested, keep the language curriculum and assessment equal between conditions, measure enjoyment and delayed learning separately, and disclose what was experimental. No promotional efficacy claim should precede adequate evidence.

## Quality assurance and production workflow

The workflow is draft, pedagogical review, linguistic review, audio verification, assessment calibration and approved release. A created script is not approved merely because a model generated it. Keep the exact version reviewed; later edits require review of the changed material.

Linguistic review checks grammar, meaning, idiomaticity, literal-translation traps, natural stress, register, regional claims and acceptable variants. At least one native-speaking Latin American reviewer must validate learner-facing core material; region-specific modules need review from that variety. Reviewers should have teaching or assessment expertise for explanation and answer-key work. A nationality alone is not an assessment qualification.

Pedagogical review checks that the target is clear, prerequisites are sparse and feasible, new vocabulary does not dominate a grammar test, task labels match actual response demands, hints change evidence correctly, and productive targets receive real transfer opportunities. Music review checks target audibility, replay quality and ordinary-speech compatibility. Audio review checks clipping, segmentation, timing, correct words, region metadata and fallback behavior.

Assessment calibration checks distractors, accepted paraphrases, inter-rater agreement, false rejection of regional forms, ASR failures, guessed recognition, delayed retention and whether rehearsed material overpredicts real conversation. Use unseen items and different voices. Freeze pilot item versions long enough to compare results; do not change thresholds midway without recording the policy change.

No-release conditions include missing essential audio, a listening prompt with no successful clip playback, an answer key with an unresolved meaning conflict, unsupported pronunciation diagnosis, missing rights/provenance, or a critical productive target assessed only by multiple choice. Resolve the specific failure rather than stop all unrelated content production.

## Pilot plan and release sequence

Start with a small exploratory group representing true beginners, returning school learners and stronger readers with weaker listening. An initial group of about 12–20 adults can expose usability and content problems; it is not large enough to establish broad efficacy. Include several language/assessment reviewer sessions. Obtain an independent baseline, then use two weeks of Stage 0–1 content and a delayed check. Participation in optional experimental audio is separately chosen.

Primary pilot questions: Can learners understand and use wants, obligation, intention and repair in a new voice and scene? Does support fade without destroying comprehension? Are recognition gains converting into delayed retrieval and output? Are songs and episodes voluntarily replayed? Do returning learners bypass basics while still repairing listening gaps?

Track active practice and passive listening separately. Report delayed recall, listening without text, independent response success, mission completion, hint reliance, technical scoring failures and speaker/context generalization. Track replay, favorites and listening minutes as engagement. A replay correlation does not establish a musical learning effect.

To test a music hypothesis, compare equivalent language exposure and active retrieval with and without a sung presentation, then assess spoken recall and new-context use after a delay. Control or record exposure duration, baseline ability and optional practice. A small pilot can generate hypotheses; stronger claims require a suitably designed and powered study. Equal intervals and expanding intervals can be compared later without declaring one schedule universally superior.

Release sequence:

1. Reconcile legacy concept IDs and decide the first production tranche. Preserve current app evidence.
2. Author and review Stage 0, S1U1–S1U4 and their cross-course strands. Produce plain-speech audio and complete one vertical package such as S1U2.
3. Produce and map Album 01 Tracks 01–04, with companion episodes and retrieval activities. A track can launch individually when its package is approved.
4. Add S1U5–S1U6, an Album 01 reprise, unfamiliar voices, held-out missions and delayed checks. Verify missing-audio and transcript fallback flows.
5. Run the exploratory pilot, repair weaknesses and freeze a revised curriculum/policy version before broader release.
6. Produce Stage 2–3 practical content, then Stage 4 narrative content, using the defined sequence and observed needs.
7. Add Stage 5–7 nuance and regional lanes with appropriate reviewers and scoring calibration. Maintain due earlier concepts throughout.

Curriculum design does not require the website to expand first. Music listening, podcast-style episodes and a simple app loop can share the same content and evidence model. The first useful release is an audio library with a working active-practice companion, not a large navigation tree with unavailable lessons.

## Maintenance and project handoff

Treat this document as the canonical curriculum design baseline. The app's structured concept/content data should implement a named version of it. Songs and lessons reference that version. Existing product, brand and technical documents retain their own responsibilities. If a later decision conflicts with this baseline, update the relevant section and a short change log rather than letting contradictory thread instructions accumulate.

Curriculum revisions record what changed, why, affected target IDs, prerequisite changes, content needing re-review and the evidence-policy version. Never delete evidence to simplify a migration. Retire incorrect content with a reason and route learners to a corrected contrast. A corrected example does not retroactively prove that learners understood the old material.

Before a build handoff, developers need the resolved concept alias table, structured unit/target data, approved audio and text assets, item banks with accepted variants, scorer/rubric versions and the review policy. Writers need the unit cards, vocabulary envelope, grammar contrasts, genre briefs, episode template and rights rules. Reviewers need candidate scripts, exact clips and answer keys. This document supplies the design; those production records supply releasable content.

Outstanding work is specific: reconcile the completed written 100-concept register with live database memberships; perform native-speaker review of this baseline's examples; create the first complete approved assets; calibrate provisional thresholds; verify rights for the selected music pipeline; and connect approved data to the existing app. These are implementation and release tasks, not gaps to fill with additional philosophy.

## Change log

Version 1.0 established the eight-stage sequence, 48 unit cards, 192 unit targets, 24 cross-course strands, required lexical banks, Album 01 compatibility, later collection briefs, podcast production requirements, dimension-specific mastery rules, deterministic review logic, returning-learner calibration, assessment and AI-scoring contracts, a worked S1U2 package and staged release plan. It changes exposure's assessed-mastery contribution to zero and finalizes the Latin American production core. All threshold values remain provisional until pilot calibration.

Version 1.1 incorporates the supplied Borao architecture: ten Core Arcs, elective mini-Arcs, Quick Checks, targeted Boosters, test-through access, the Home Listen Play Speak Library navigation, owned playback, and post-Core Build Your Mix. It clarifies that stages and unit cards are internal authoring coverage, not compulsory learner levels, and preserves implemented concept IDs pending a crosswalk.

Version 1.2 completes a six-pass internal revision across every unit card, all 24 strands and ten Core Arcs. It assigns all 100 seeded concepts an authoring home; separates story from optional practice; adds scoped critical functions and held-out scenarios to all 48 units; removes conflicting universal score thresholds; improves learner accommodations, pronunciation/register policy and commissioning priorities; and incorporates the v0.3 Arc 1 rewrite. Review findings and remaining external gates live in docs/CURRICULUM_REVIEW_LOG_v1_2.md. The archived v1.1 Google Doc is historical; this repository master is current. These revisions are not human validation, accreditation or demonstrated efficacy.

Music-policy amendment to v1.2: each album must include at least one Latin signature track within its existing track count. Album 01 Track 08 is reserved for this role; Spanish-first lyrics, specific tradition and actual musical/cultural review are required. This does not alter concept IDs or readiness policy.
