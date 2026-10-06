# Borao Progression, Rewards & Unlocks

Status: UX/app product contract.
Scope: Learner motivation, album progression, game unlocks, bonus content, library ownership, and non-Duolingo gamification.
Curriculum/content authoring remains upstream in the curriculum thread. This document defines how approved content is revealed and rewarded.

## 1. Product principle

Borao should feel rewarding without becoming an XP economy.

Avoid:
- hearts/lives;
- coins/gems;
- streak punishment;
- cartoon treasure boxes;
- arbitrary level numbers;
- leaderboards as the primary motivator;
- points that imply learning;
- fake scarcity around required instruction.

Prefer:
- music/content unlocks;
- new game mechanics;
- new albums/series;
- alternate versions/remixes;
- personal collection growth;
- visible Core chapter completion;
- “Ready” moments tied to demonstrated ability;
- customization and ownership.

The emotional loop should be:

**I learned something useful → Borao opened something cool → I want to keep going.**

The curriculum engine still decides readiness. Rewards do not create mastery.

---

## 2. Album progression model

Recommended model: **progressive album reveal**, not fully locked albums and not fully open albums.

### Album 01 — first-contact album

At onboarding:
- album cover/title is visible;
- 2–3 starter tracks are playable immediately;
- remaining tracks are visible but locked;
- 15–30 second previews may be used for discovery if rights/production support it;
- user can see that more music is coming without seeing a school-like lesson map.

As the learner progresses through the associated Core segment:
- target tracks unlock one at a time;
- each newly unlocked track can become the next Arc anchor;
- learning does not require repeated plays;
- album browsing remains music-first.

When the associated segment is readiness-cleared:
- full uninterrupted album play unlocks;
- album can be downloaded for offline use when native/offline support exists;
- full album can be added to queues/mixes;
- bonus/encore content may unlock.

This gives the user both:
1. an immediate music hook at the beginning; and
2. a meaningful “I opened the whole record” payoff later.

### Later albums

Album 02 and later should appear in the Library as visible future releases.

When the prior Core segment is ready:
- the next album cover animates/reveals;
- its lead track becomes playable;
- the next learning/content cycle begins.

Do not hide all future albums completely. A visible record shelf creates aspiration.

---

## 3. Albums vs curriculum

Albums are reward/discovery containers, not mastery gates.

The curriculum owns:
- concept sequencing;
- Arc readiness;
- checkpoints;
- resurfacing.

The album owns:
- track order;
- aesthetic identity;
- genre mix;
- replay value;
- collection status.

A user may replay unlocked tracks freely.

A track can appear in:
- its album;
- an Arc recommendation;
- Listen;
- a smart mix;
- a user playlist;
- Favorites.

Unlocking a track means “you now have access to this piece of content,” not “you mastered its language.”

---

## 4. Genre personalization

Do not create a completely unique album for every user. That would multiply production and QA costs.

Recommended model: **shared album spine + preference-based swap slots**.

Example:
- 6–8 shared tracks establish the album identity and common curriculum coverage;
- 2–4 swap slots have approved alternatives;
- alternatives teach/recycle equivalent targets but use different genres or energy profiles.

Onboarding captures:
- favorite genres;
- disliked genres;
- energy preferences.

Borao uses those preferences to choose between approved alternatives.

Example:
Track 5 slot:
- alt-pop version;
- rap/trap version;
- Latin-pop/reggaeton version.

The learner may later browse other approved versions too.

This preserves:
- a common cultural/product experience;
- enough personalization to feel “made for me”;
- manageable native-speaker and pedagogical QA.

---

## 5. Music-native reward vocabulary

Prefer music/library language over game-economy language.

Good:
- New track unlocked
- Album unlocked
- New release
- Bonus track
- Deep cut
- Encore
- Alternate version
- Remix
- Acoustic / stripped version
- Spoken version
- Karaoke / recall version
- New mix
- Added to your Library

Avoid:
- loot;
- chest;
- coins;
- XP;
- level up;
- lives;
- streak freeze.

The visual metaphor should be a growing music collection, not a casino or children’s game.

---

## 6. Bonus songs

Bonus songs should be motivational rewards that still have pedagogical value.

Possible reward types:

### Encore track
A genuinely new song recycling the Arc’s language in a different context.

### Alternate-genre version
Same curricular job, different musical production.

### Reprise
Mostly-Spanish later version of a previously familiar track.

### Karaoke / recall version
Strategic gaps or reduced lead vocal for active recall.

### Plain-speech companion
Target hooks spoken naturally without melody.

### Deep cut
A less curriculum-central but highly replayable track that recycles familiar language.

### Future preview
An optional track containing mostly known language plus a small taste of what comes next.

Reward rules:
- bonus content should never be required to pass;
- do not reserve all preferred genres only for high performers;
- unlock bonus content through readiness, exploration, or optional challenges rather than high-score competition;
- exposure from a bonus track remains exposure unless the learner produces stronger evidence elsewhere.

---

## 7. Game progression

Play should feel like a growing arcade/cabinet of useful mechanics.

Do not expose every game on day one.

Unlock new mechanics gradually as the learner has enough language for them to be meaningful.

### Initial game set

#### Flip It
Job: manipulation.
Change intention/polarity/person while preserving the action.

#### Hook Hunt
Job: recall.
Recover the missing chunk from a familiar song or spoken hook.

#### Scene Rescue
Job: contextual recognition or production.
Help a character respond usefully.

#### Finish the Bar
Job: music-based retrieval/listening.
Complete the lyric or hook after audio stops.

#### Quick Draw
Job: fast meaning retrieval.
Short untimed-at-first prompts; speed becomes optional only after competence.

#### Who Said That?
Job: listening comprehension.
Identify meaning/speaker intention from a fresh voice.

#### Text Back
Job: practical reading/writing.
Respond to a short message in context.

#### Voice Note
Job: guided/independent production.
Reply to a character’s short voice note.

#### Remix the Line
Job: flexible language generation.
Change one or two features of a known phrase.

#### Repair Room
Job: conversational repair.
Learner hears/reads a confusing interaction and chooses/says a useful repair phrase.

Not every Arc needs every game.

The recommender selects games by missing evidence dimension, while the learner can also browse favorites.

---

## 8. Game unlock rhythm

Example release rhythm across Core:

- Arc 1: Flip It
- Arc 2: Scene Rescue
- Arc 3: Who Said That?
- Arc 4: Repair Room
- Arc 5: Quick Draw
- Arc 6: Text Back
- Arc 7: Hook Hunt / Finish the Bar
- Arc 8: Voice Note
- Arc 9: Remix the Line
- Arc 10: mixed “Set” using multiple mechanics

This is an initial UX distribution only. Curriculum decides where each mechanic is pedagogically appropriate.

A newly unlocked mechanic gets a short celebratory reveal:
“New game: Scene Rescue”
not:
“Level 2 unlocked +50 XP.”

---

## 9. Achievement without points

The app can create accomplishment with **meaningful milestones**.

Examples:
- First song unlocked
- First full album unlocked
- First spoken episode completed in Practice mode
- First Ready Check cleared
- First delayed check retained
- First playlist created
- First song favorited
- First full-Spanish version unlocked
- First elective path unlocked
- First Drive mix built
- Core complete

These should be occasional and tasteful.

Do not award a badge for every microscopic action.

A milestone may have:
- subtle animation;
- haptic feedback;
- album-art reveal;
- short sound sting;
- share card later if the user chooses.

No confetti after every answer.

---

## 10. “Collection completion” as the main progress fantasy

Instead of filling an XP bar, Borao can build a **Record Shelf**.

The learner sees album covers across the journey:
- available;
- partially discovered;
- complete/unlocked;
- future release.

Within an album:
- unlocked tracks show art/title;
- locked tracks may show title/art silhouette or mystery art;
- bonus tracks can appear as hidden slots until earned.

This produces collection desire without implying that playback equals mastery.

Core progress remains separate:
- 3 of 10 Core chapters ready.

Album collection progress:
- 7 of 10 tracks unlocked.

Those two numbers must never be conflated.

---

## 11. End-of-segment unlock moment

When a major Core segment is readiness-cleared, use one strong reward moment.

Suggested sequence:
1. learner receives useful readiness feedback;
2. “You opened the rest of Album 01”;
3. album cover expands into full track list;
4. newly available tracks animate into place;
5. one optional bonus/deep-cut reveal;
6. CTA choices:
   - Play the album
   - Add favorites
   - Start next Core chapter
   - Explore the new game

The user chooses what feels fun next.

Do not immediately force the next lesson.

---

## 12. Playlists and ownership

Unlocked tracks can be:
- favorited;
- added to manual playlists;
- added to smart mixes;
- queued;
- downloaded later for offline use.

Playlist creation should be available during the journey, not only after Core.

Examples:
- My Jams
- Gym
- Car
- Chill
- Mostly Spanish
- Favorites
- Songs I Actually Know

Downloads/offline:
- only unlocked/rights-cleared audio;
- managed inside Borao;
- native/offline implementation later;
- downloaded status does not affect mastery.

---

## 13. Smart reward recommendations

Reward content can also solve pedagogical needs.

Example:
Learner has weak delayed retrieval for quiero/voy a but loves a specific trap-pop track.

Instead of:
“Review C001.”

Borao can surface:
“Bonus version unlocked — mostly Spanish.”

That version naturally re-exposes the same language, followed later by a fresh retrieval check.

This is motivational packaging around legitimate learning logic.

---

## 14. Anti-Duolingo differentiation

Borao’s motivational identity:

**Music collection + story world + capability unlocks.**

Not:
**daily chores + points economy + punishment for absence.**

Distinctive characteristics:
- rewards are actual content;
- progress is about what the learner can do;
- albums create anticipation;
- games are cognitive tools with aesthetic identity;
- replays are voluntary;
- no guilt for missing a day;
- no lives preventing learning;
- no leaderboard required;
- no fake mastery from tapping.

The user should feel:
“I keep unlocking cooler Spanish stuff.”

Not:
“I have to protect my streak.”

---

## 15. Current product recommendation

For first release:

1. Album 01 visible from onboarding.
2. 2–3 starter tracks immediately playable.
3. Remaining Album 01 tracks unlock through the first Core segment.
4. One new game mechanic introduced at meaningful Arc milestones.
5. One or two bonus/encore tracks per album segment.
6. Full Album 01 uninterrupted play unlocks at the segment gate.
7. Album 02 cover becomes visible early and unlocks at the next major readiness milestone.
8. Favorites + playlists work throughout.
9. Offline downloads arrive when native/offline storage is ready.
10. No XP, coins, hearts, streak penalties, or required social competition.

This is the default UX direction unless pilot behavior suggests a stronger alternative.
