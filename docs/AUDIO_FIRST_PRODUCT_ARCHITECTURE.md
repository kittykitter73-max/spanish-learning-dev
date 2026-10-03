# Audio-First Product Architecture

## Product correction

Borao is not primarily a website lesson product. The website remains a development, account, QA, and fallback surface. The primary learner experience should be:

1. Music
2. Spoken episodic learning ("podcast-style" guided discourse)
3. App-native retrieval / speaking / lightweight play

The adaptive curriculum and mastery engine remain shared across all three.

## Primary learner loop

Listen -> Notice -> Retrieve -> Use -> Continue listening

The app should interrupt audio only when the expected learning value is worth the interruption. Most exposure should feel like entertainment; stronger evidence should come from short retrieval and production moments.

## Delivery surfaces

### Music
- Full tracks and progressive versions
- High replay value
- Target concepts declared in metadata
- Exposure does not equal mastery
- Short retrieval moments can follow or interrupt a track when appropriate

### Spoken episodes
- Recurring characters + learner self-insert
- Natural dialogue, narration, scene setup, prediction, repair, response
- Designed for driving / walking / low-screen use
- Can contain embedded pauses for oral response
- Transcript is fallback/support, not the primary experience

### App interactions
- Recognition checks
- Retrieval
- Manipulation
- Speaking / production
- Games and missions
- Recommendation / resurfacing decisions
- User controls for support level, mode and preferences

## Media model

The curriculum item remains the learning source of truth. Media is attached separately.

`content_items`
- pedagogical identity and status
- target concepts
- difficulty / rating / rights

`media_assets`
- playable audio attached to a content item or spoken segment
- full audio, segment audio, music mix, alternate audio
- storage/provider metadata
- explicit ready/processing/failed state

The UI must never say "listen", "heard", or imply audio evidence unless a ready playable media asset exists.

## Near-term build order

1. Harden current learner journey and remove misleading prototype copy.
2. Keep web UI as a functional test shell, not a design priority.
3. Build media ingestion + playback contract.
4. Add one high-quality spoken episode with real audio.
5. Add one real music track with curriculum metadata.
6. Build a unified audio queue / Now Playing experience.
7. Add oral response moments suitable for drive mode.
8. Add background/offline/native capabilities when web/PWA constraints become material.
9. Expand content only after the audio loop is proven.

## Release rule

A content item that claims listening evidence must have actual audio. Text fallback may produce exposure, recognition, recall, manipulation or production evidence, but not listening-comprehension evidence.

## Product language

Internal engineering signals such as `recent_error`, `production_gap`, `due_review` and `not_completed` stay internal. Learner-facing copy should describe the next action naturally.

Examples:
- "We'll bring this back soon."
- "Try it once more without help."
- "You know this when you see it. Let's make it easier to say."
- "Ready for something new."
