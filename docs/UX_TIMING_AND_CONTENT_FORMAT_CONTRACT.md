# Borao UX Timing & Content Format Contract

Status: UX/app interpretation of the current curriculum sources.
Authority: Read alongside Borao Master Curriculum v1.2, docs/CORE_ARC_01_PRODUCTION_PACK.md v0.3, docs/CONTENT_HANDOFF_v1_2.md, docs/CURRICULUM_CONTENT_INDEX.md, docs/LEARNER_EXPERIENCE_SYSTEM.md, and docs/AUDIO_FIRST_PRODUCT_ARCHITECTURE.md.
This document does not rewrite curriculum or author content. It defines how approved curriculum/content should appear to learners.

## 1. What the learner should see

The learner should experience:
- Core progress through named functional chapters;
- music;
- spoken episodes;
- tiny game bursts;
- speaking moments;
- short readiness checks;
- targeted tune-ups when needed;
- playlists and free listening.

The learner should not see:
- internal stage IDs such as S1U1;
- the 48 authoring units;
- 192 target counts;
- canonical concept IDs;
- evidence weights;
- raw recommendation reason codes;
- item-bank sizes;
- database or assessment terminology.

User-facing Core language should be functional:
- Make Something Happen
- You, Me, Let’s
- Ask Anything
- Stay in the Conversation
- etc.

“Arc” may remain an internal/product term. If shown at all, prefer “Core” or “Chapter” in learner copy.

## 2. Arc 01 timing

Current v1.2/v0.3 commissioning targets:
- Song: 2:30–3:10 planned, not measured until final production
- Spoken episode story edit: approximately 75–120 seconds before optional practice; current source is unmeasured
- Active episode: the same 24-turn story with up to three optional practice prompts inserted at approved breakpoints
- Optional game burst: 1–2 min
- Ready Check: normally about 3–6 min; a second short check may be needed when one pass cannot establish paired evidence across all six critical frames
- Booster / Quick tune-up: about 2 min
- Entry phrase preview for true beginners: about 60 sec when needed
- Speaking mission: generally about 2–3 min unless evidence collection requires more

Do not present a fixed total Arc duration until the real audio and adaptive check lengths are measured.

Recommended learner-facing encounters:

### Encounter A — listen first
- Arc entry / anchor song
- uninterrupted story episode
- natural Continue Later point
- no mandatory quiz inserted into the song or passive story

### Encounter B — active use
- optional episode Practice mode using only the approved prompt breakpoints
- one useful game burst when the evidence job warrants it
- compact speaking mission
- Ready Check becomes available when enough prerequisite exposure/practice exists, but returning learners may test first

### Encounter C — Ready Check
- smallest fresh set needed to resolve missing evidence
- uncued production before matching model/reveal where practical
- transcript-free listening with fresh audio
- manipulation only where needed
- short held-out practical adjustment if still necessary
- targeted result, with a second short check or approximately two-minute Booster rather than a long exam

A motivated learner may continue through all encounters in one sitting. The app should never force artificial day boundaries.

## 3. Session rhythm

The Master Curriculum supports:
- 5-minute active sessions for one due target + one useful exchange;
- ordinary 12–20 minute active sessions;
- 20–30 minute music/podcast listening sessions as exposure.

UX default:
- make the next recommended action feel 3–8 minutes long;
- allow one-tap continuation into a longer 12–20 minute flow;
- never require the learner to choose a formal session length before beginning.

Every Home recommendation should expose an honest estimated time such as:
- 3 min
- about 5 min
- 90 sec
- 4–6 min

After final audio production, use measured durations rather than authoring estimates.

## 4. Content format rules

### Song
User format:
- full uninterrupted audio;
- artwork;
- title / artist-style presentation;
- optional lyrics/support drawer;
- Save / Add to playlist;
- Replay;
- Continue Arc suggestion after playback, never an interruption inside the song.

Learning role:
- exposure and memorable retrieval support;
- no automatic mastery credit from completion;
- no mandatory spoken quiz inserted into A1-MUSIC-01.

Song can appear simultaneously in:
- Listen;
- an album;
- the current Core recommendation;
- user playlists;
- a smart mix.

The collection does not own mastery.

### Spoken episode
Arc 01 should appear as one episode: “El plan cambió.”

The v0.3 source is one coherent 24-turn story. Do not expose the old Chapter A / Chapter B split. Practice mode may insert the three approved optional prompts at their authored breakpoints; stored source-array order is not playback order.

Suggested user presentation:
- episode title;
- short description;
- total duration;
- two chapter markers;
- mode selection: Listen / Practice.

Listen mode:
- scene-only edit;
- uninterrupted;
- exposure only;
- transcript and English support available on demand.

Practice mode:
- active edit;
- response pauses;
- app captures eligible evidence;
- model answer appears only after response or skip;
- if learner answers early, do not force the full silent pause.

Do not display segment IDs A01, A02, B01, etc.

### Games
Games are micro-sessions, not course chapters.

Arc 01:
- Flip It: 60–120 sec
- Scene Rescue: roughly 1–2 min

User format:
- one mechanic;
- very little instructional chrome;
- immediate next prompt;
- no beginner speed penalty;
- end after the evidence job is done.

Play hub may surface the same mechanics independently, but an Arc should recommend the mechanic whose cognitive demand matches the current need.

### Speaking mission
User format:
- one scenario;
- one visible goal;
- large microphone / response state when voice capture is available;
- text route available if speech capture is unavailable or declined;
- no long rubric or score shown to the learner.

Arc 01 learner framing:
“Plans changed. Tell your friend what you can’t do, what you have to do, and what you can do instead.”

The app stores separate underlying evidence, but the learner sees practical communication.

### Quick Check
User-facing name: “Ready Check” is preferred over “Test.”

The 15+ candidate items in the Arc 01 bank are an item bank, not a fixed test.

The app must dynamically select the smallest fresh set needed to resolve missing evidence.

Do not show all six listening + three manipulation + six production items by default.

Selection order for a fresh check:
1. collect uncued production before showing matching Spanish answers;
2. sample transcript-free listening with fresh audio;
3. add manipulation only where needed;
4. finish with a short practical transfer task if still necessary.

Reuse valid recent evidence. Do not retest dimensions already securely observed solely to fill a progress bar.

Learner-facing duration target:
- normally about 3–6 minutes;
- allow up to the curriculum’s 4–7 minute target when evidence is sparse;
- if it is growing longer than that, split the unresolved evidence into a follow-up rather than make the learner sit through an exam.

Never show “8/10,” “fail,” or a single mastery percentage.

Result formats:
- Ready: “You can use these here. The next Core chapter is ready.”
- Production gap: “You understand this. Let’s make one phrase easier to say without help.”
- Listening gap: “You can say it. We still need to hear it in a new voice.”
- Technical issue: explicitly separate playback/recording failure from Spanish ability.

### Booster
User-facing format: “Quick tune-up” or “2-minute fix,” not remediation or failed lesson.

- about 2 minutes;
- one confused contrast only;
- preserve passed evidence;
- fresh recheck at the end;
- if failure was technical or lexical, do not prescribe a grammar Booster automatically.

## 5. Home UX

Home should answer:
“What is the best thing for me to do right now?”

Primary card:
- title of the recommended content/action;
- format icon: Song / Episode / Game / Speak / Ready Check;
- honest duration;
- one sentence explaining why in learner language;
- one CTA.

Examples:
- “Ahora sí — Song · 3 min”
- “El plan cambió — Episode · 3 min”
- “Flip It — Game · 90 sec”
- “Ready Check — about 4 min”

Core card:
- current functional chapter;
- Arc readiness state, not screen-completion state;
- “Next Core chapter ready” when the gate is satisfied.

Avoid a percent that implies passive content completion equals learning. If a Core percentage is shown, it should represent completed/readiness-cleared Arcs only.

Secondary row:
- Listen
- Play
- Speak

Recently played belongs lower on the page.

## 6. Listen UX

Listen is entertainment-first.

Sections:
- For You
- Music
- Episodes
- Mixes
- Saved
- Drive

Cards should use media language, not curriculum language.

For episodes:
- title;
- series;
- duration;
- resume position;
- Listen / Practice availability.

For songs:
- artwork;
- title;
- genre/mood when useful;
- duration;
- save/add to playlist.

Do not show evidence or mastery indicators in Listen.

## 7. Modes

### Free Listen
- uninterrupted;
- no required responses;
- exposure/engagement only;
- support optional.

### Practice / Active
- response pauses allowed;
- recognition/retrieval/manipulation/production evidence may be collected;
- user can skip or reveal without being punished as a failure.

### Drive
Current Arc 01 rule takes precedence over older generic UX language:
- scene-only/passive audio while moving;
- no required response;
- no scoring;
- no microphone capture;
- no visual task;
- no distracting cognitive challenge.

Any future hands-free oral practice should be explicitly a stationary/safe practice mode, not driving-time assessment.

## 8. Delayed review

Arc readiness may unlock the next Core chapter immediately.

Retention is checked later without blocking the learner for seven days.

Recommended UX:
- next day: one or two tiny fresh prompts embedded naturally in Home/Play/Speak;
- around one week: a few due prompts using changed words/speakers;
- never make the learner repeat the entire Arc;
- never label provisional readiness as permanent mastery.

The learner should experience this as Borao “bringing something back,” not as a scheduled exam.

## 9. Core pacing

There are 10 learner-facing Core Arcs.

Do not estimate Core completion from the 48 authoring units; those units are internal production packages.

Core should feel finite and reachable.

The app should communicate:
- current functional chapter;
- what the learner can now do;
- how many Core chapters are ready/completed;
- what unlocks after Core.

After Core, the UI shifts toward elective modules and user choice.

## 10. Post-Core modules

Electives should appear as browseable cards before unlock to build desire.

Each module card:
- outcome;
- 2–4 mini-Arcs;
- sample songs/episodes;
- estimated effort only after real content exists;
- prerequisite state;
- “Ready now,” “Bridge recommended,” or “Locked until Core” rather than a generic lock icon.

After Core, Home should favor:
- selected active module;
- due Core resurfacing;
- Listen recommendations;
- one practical speaking/game action.

## 11. Collections and playlists

Albums and series:
- playable collections;
- browseable even when their content spans multiple Arcs;
- no “album complete = Arc complete” messaging.

Manual playlists:
- exact learner-selected items.

Smart mixes:
- system-generated by time, mood, mode and learning need.

Good examples:
- Drive 20
- Mostly Spanish
- Songs You Know
- Review Mix
- High Energy
- Finish What You Started

A mixed queue may sequence:
song → spoken scene → song/reprise → optional practice break → next audio.

Practice breaks should be opt-in in ordinary listening and disabled in Drive.

## 12. Key UX principle

The curriculum engine owns readiness.
The player owns playback.
Collections own browsing.
The learner owns playlists.
The app should make these boundaries invisible but never confuse them internally.

The ideal user feeling is:
“I put Spanish on, Borao occasionally asks me to do something useful, and it always seems to know what I should do next.”
