# Borao Learner Experience System

## Product thesis

Borao should feel like an entertainment app that happens to make Spanish usable.

The learner-facing experience is organized around listening, playing, speaking, and choosing what feels good next. The curriculum engine remains authoritative underneath and decides what concepts are introduced, recycled, tested, and resurfaced.

The product must not become a collection of disconnected songs, podcasts, games, and quizzes. Every surface participates in one shared learner model.

---

## 1. Top-level learner journey

### Phase A — Core

Every learner starts in Core.

Core teaches the high-frequency, high-utility Spanish needed to:
- express wants, needs, plans, ability, and obligation;
- ask and answer routine questions;
- understand common everyday speech;
- repair misunderstanding;
- navigate common social and household interactions;
- build enough grammar intuition to generate new language.

Core is linear enough to protect prerequisites but flexible enough to let the learner replay, browse, and choose preferred modalities.

Core is divided into **Arcs**.

Each Arc is a small entertainment-and-learning cycle:
1. Anchor exposure
2. Guided spoken episode
3. Retrieval / manipulation
4. Reinforcement through a second modality
5. Checkpoint
6. Unlock next Arc

An Arc may include:
- one or more songs;
- one spoken episode;
- one or more short games;
- one speaking prompt or mission;
- one checkpoint.

Not every item is mandatory. The checkpoint proves readiness.

### Phase B — Choose Your Spanish

After Core, the learner chooses elective learning paths instead of following one mandatory sequence.

Candidate elective modules:
- Travel
- Everyday Social Spanish
- Dating & Relationships
- Family & Home
- Work & Professional Spanish
- Food, Restaurants & Going Out
- Health & Wellness
- Parenting
- Slang & Casual Speech
- Latin Music & Lyrics
- Storytelling & Conversation
- Country / Region Packs
- Advanced Listening
- Grammar Power-Ups

A learner can keep 1–3 elective modules active at once.

Core language continues to resurface inside elective modules so completion does not cause forgetting.

### Phase C — Fluency Library

As the learner accumulates content, Borao becomes increasingly self-directed.

The learner can:
- build playlists;
- save albums / episodes;
- make music-only or mixed playlists;
- create Drive mixes;
- create review mixes;
- choose mood / energy / genre / topic;
- choose more or less English support;
- choose whether retrieval interruptions are enabled.

The adaptive engine still uses due concepts and weak evidence to quietly influence recommendations.

---

## 2. The Arc model

An Arc is the smallest meaningful curriculum chapter.

Example: **First Contact — Want / Have To / Going To**

### Anchor track
Purpose:
- make the target patterns familiar;
- create memorable hooks;
- deliver high-replay exposure.

Evidence:
- exposure only unless the learner responds to an embedded prompt.

### Spoken episode
Purpose:
- show the patterns in natural conversation;
- establish characters and context;
- teach listening and pragmatic use;
- transition from song familiarity to real speech.

Structure:
- scene;
- prediction pause;
- character response;
- learner self-insert;
- variation;
- mini transfer moment.

### Game burst
Purpose:
- retrieve the language quickly;
- create manipulation or listening evidence;
- make repetition feel different.

### Speaking moment
Purpose:
- produce the language without copying;
- connect it to the learner's real life.

### Checkpoint
Purpose:
- verify the learner can understand and use the Arc's target language;
- decide whether the next Core Arc should unlock;
- generate precise resurfacing if not ready.

The checkpoint should not feel like a school exam.

Learner-facing names could include:
- Ready Check
- Prove It
- Can You Use It?
- Quick Check

---

## 3. Checkpoint design

A checkpoint should be short: usually 2–6 minutes.

It should sample multiple evidence dimensions rather than produce one quiz score.

Typical checkpoint:
1. **Listening recognition** — understand a short unfamiliar audio line.
2. **Meaning recall** — retrieve a phrase from meaning.
3. **Manipulation** — change one variable in a known pattern.
4. **Production** — answer personally or complete a practical task.
5. **Transfer** — use the language in a slightly novel context when appropriate.

### Pass logic

Do not use a simplistic percentage-correct score.

The initial engineering rule should look at:
- required target concepts;
- recent evidence strength;
- whether the learner has at least recognition/listening evidence;
- whether important generative targets have manipulation or production evidence;
- hint/support level;
- repeated failures.

Exact thresholds remain an engineering hypothesis until tested with real learners.

If the learner is not ready:
- do not show "FAIL";
- create a 1–3 minute Booster;
- replay a relevant hook / scene;
- offer one targeted game;
- then re-check only the weak dimension.

The learner should feel helped, not punished.

---

## 4. Audio-first interaction model

Primary loop:

**Play → hear something meaningful → tiny response → continue playing**

The app should avoid dragging the learner into a screen after every piece of audio.

### Audio interruption levels

**Level 0 — Free Listen**
- no interruptions;
- records exposure / engagement only.

**Level 1 — Light Learning**
- occasional tap / prediction;
- best for walking, casual listening.

**Level 2 — Active**
- retrieval and short speaking prompts;
- strongest default learning mode.

**Level 3 — Drive**
- voice-first;
- large/no-touch controls;
- oral prompts and pauses;
- no typing;
- resume audio automatically.

The learner can choose the mode, but the curriculum engine controls what evidence each interaction counts as.

---

## 5. App information architecture

The app should be optimized for mobile first.

### Bottom navigation

#### Home
The simplest possible answer to "what should I do now?"

Shows:
- Continue current Arc
- Now / Next
- checkpoint ready state
- one recommended game or speaking action
- current Core / module progress
- recently played

Home should never look like an LMS dashboard.

#### Listen
The entertainment library.

Top-level filters:
- Music
- Episodes
- Mixes
- Drive
- Saved

Persistent mini-player at bottom.

#### Play
Short games generated from current curriculum needs.

Games should be recommended by the cognitive evidence needed, not randomly.

#### Speak
Voice practice and conversation.

Includes:
- quick oral prompts;
- scene roleplay;
- conversation missions;
- later AI conversation constrained by curriculum targets.

#### Library
Long-term ownership and exploration.

Includes:
- Albums
- Spoken series
- Modules
- Saved items
- Playlists
- Downloads later

---

## 6. Persistent player

A persistent player is a core product primitive, not decorative UI.

It should support:
- background playback;
- queue;
- previous / next;
- speed for spoken episodes;
- lyrics / transcript toggle;
- support-language toggle;
- favorite;
- add to playlist;
- learning mode toggle;
- resume position;
- lock-screen controls in native app later.

A queue can contain both songs and spoken episodes.

A mixed queue may look like:
1. Song
2. Spoken scene
3. Song reprise
4. 45-second retrieval break
5. New song

This is how Borao becomes closer to an entertainment platform than a lesson app.

---

## 7. Music system

Music is not a reward after lessons. It is a primary curriculum surface.

Each track declares:
- active targets;
- recycled targets;
- language ratio;
- genre / subgenre;
- energy;
- mood;
- difficulty;
- version;
- transfer job.

Suggested version pattern:
- A: English-supported
- B: reduced English
- C: mostly Spanish
- D: karaoke / recall version

The system can automatically recommend the right version based on learner evidence.

Album completion is not mastery.

---

## 8. Spoken series

Spoken content should feel closer to a podcast, story, or serialized show than a traditional audio lesson.

Recurring characters create familiarity.

Episode types:
- scenes;
- mini-stories;
- guided discourse;
- repair conversations;
- missions;
- debriefs;
- drive drills.

The learner gradually moves:
listen → predict → respond for character → respond to character → respond as self → unfamiliar transfer.

Transcripts and translations are support layers, not the primary delivery.

---

## 9. Games

Launch with a small number of strong mechanics rather than many shallow games.

### Game 1 — Hook Hunt
Hear/read a familiar hook and retrieve the missing chunk.

Evidence:
- recall;
- listening recall when audio is used.

### Game 2 — Flip It
Change one variable:
- want → going to;
- I → you;
- now → tomorrow;
- statement → question.

Evidence:
- manipulation.

### Game 3 — Scene Rescue
A character has a problem. Pick or say the useful response.

Evidence:
- recognition at low support;
- production when spoken/open.

### Game 4 — Speed Round
Rapid short prompts.

Evidence:
- retrieval fluency / automaticity.

### Game 5 — Finish the Bar
Music-based prediction / retrieval.

Evidence:
- recall;
- listening when audio is present.

Games should use due/weak concepts and current module targets.

---

## 10. Modules after Core

Elective modules are learning paths, not isolated content packs.

Each module has:
- communicative goal;
- prerequisites;
- its own Arcs;
- songs;
- spoken episodes;
- games;
- missions;
- checkpoints;
- transfer goal.

Example:

### Travel
Outcomes:
- airport;
- hotel;
- transport;
- directions;
- restaurants;
- problems / clarification.

### Social Spanish
Outcomes:
- introductions;
- invitations;
- texting;
- opinions;
- plans;
- casual reactions;
- conversation repair.

Learners should be able to browse locked modules early to build desire, but Core requirements should be clearly explained rather than hidden.

---

## 11. Playlists

Playlists become increasingly important as the learner's library grows.

### Manual playlists
Learner chooses exact items.

Examples:
- Gym Spanish
- Car songs
- Favorites
- Chill Spanish

### Smart playlists
Rules generate / refresh the list automatically.

Possible rules:
- due concepts;
- weak production;
- favorite genre;
- mostly Spanish;
- no interruptions;
- 20-minute drive;
- high energy;
- one new track + familiar tracks;
- a specific module.

### System mixes
Always available and automatically refreshed.

Examples:
- Today's Mix
- Your Review Mix
- Drive 20
- Mostly Spanish
- Songs You Know
- New This Week
- Finish What You Started

Playlists should support:
- music-only;
- spoken-only;
- mixed.

Listening to a playlist gives exposure. It does not automatically grant mastery.

---

## 12. Relationship between content and curriculum

The hierarchy stays:

Outcome
→ Function
→ Concept
→ Content item
→ Learner evidence

A song and a spoken episode can teach the same concepts.

A game can test them.

A checkpoint can decide whether the Arc is ready to advance.

None of these content formats owns mastery.

---

## 13. Recommended Core experience

A Core Arc should generally feel like:

### Session 1
Anchor song + one tiny response

### Session 2
Spoken episode + prediction / retrieval

### Session 3
Second song or game reinforcement

### Session 4
Speaking / life mission

### Session 5
Checkpoint

But the recommender may compress, reorder, or repeat surfaces based on learner evidence and preferences.

The learner should not see "Session 1–5" unless useful.

They should see:
- Continue
- Listen
- Try this
- Ready Check

---

## 14. Native app direction

Web/PWA remains valuable for:
- account creation;
- development QA;
- admin / creator tooling;
- fallback access.

Native mobile becomes increasingly justified when we require:
- reliable background audio;
- offline downloads;
- lock-screen controls;
- microphone-heavy interaction;
- push reminders;
- deep links;
- Bluetooth / car usage;
- polished audio queue behavior.

Do not rewrite native before the audio product loop is proven.

---

## 15. Build order

### Now
1. Harden first real learner flow.
2. Finalize Core / Arc / module / playlist data model.
3. Build player/media contract.
4. Add first real spoken audio.
5. Add first real curriculum-linked song.

### Next
6. Build Arc orchestration.
7. Build checkpoint gating.
8. Build 2–3 games.
9. Build Listen library + queue.
10. Build Speak / voice response flow.

### Then
11. Complete Core content.
12. Unlock elective modules.
13. Build playlist creation + smart mixes.
14. Add native wrapper/app when audio constraints justify it.

---

## 16. Non-negotiable product rules

- Exposure is not mastery.
- Audio claims require actual audio.
- Games must map to a real evidence type.
- Checkpoints test transfer, not only recognition.
- Core protects prerequisites.
- Elective modules provide freedom after Core.
- Playlists maximize ownership and replay without corrupting mastery.
- Internal engine vocabulary stays invisible to learners.
- The learner should spend more time listening / speaking than navigating screens.
