const test = require('node:test')
const assert = require('node:assert/strict')
const { assessSongPackage, canMoveToFounderReview, canPublish, nextDraftVersion } = require('../.test-dist/lib/studio/pipeline.js')

const base = () => ({
  id: 'arc1-want', version: 1, status: 'approved', conceptIds: ['quiero'],
  objective: 'Ask for something naturally', lyrics: 'Quiero café', hooks: ['Quiero café'],
  musicPrompt: 'Bright, rhythmic Latin pop', exercises: [
    { kind: 'production', prompt: 'Ask for coffee', expectedConceptIds: ['quiero'] },
  ],
  reviews: ['language', 'pedagogy', 'creative'].map(dimension => ({
    dimension, verdict: 'pass', reasonCodes: [], notes: 'Passed', reviewedVersion: 1,
  })),
  founderApprovedVersion: 1,
})

test('fully reviewed explicitly approved current version can publish', () => {
  assert.equal(canMoveToFounderReview(base()), true)
  assert.equal(canPublish(base()), true)
})
test('generation alone is insufficient; retrieval and current reviews required', () => {
  const song = base()
  song.exercises = [{ kind: 'listening', prompt: 'Listen', expectedConceptIds: ['quiero'] }]
  assert.ok(assessSongPackage(song).includes('NO_ACTIVE_RETRIEVAL'))
  assert.equal(canPublish(song), false)
})
test('outdated founder approval cannot publish', () => {
  const song = base()
  song.founderApprovedVersion = 0
  assert.equal(canPublish(song), false)
})
test('new revision clears prior reviews and founder signoff', () => {
  const revised = nextDraftVersion(base())
  assert.equal(revised.version, 2)
  assert.equal(revised.status, 'drafting')
  assert.equal(revised.founderApprovedVersion, undefined)
  assert.deepEqual(revised.reviews, [])
  assert.equal(canPublish(revised), false)
})
test('unresolved revision blocks release even with pass', () => {
  const song = base()
  song.reviews.push({ dimension: 'language', verdict: 'revise', reasonCodes: ['IDIO M'], notes: 'Fix wording', reviewedVersion: 1 })
  assert.ok(assessSongPackage(song).includes('UNRESOLVED_LANGUAGE_REVISION'))
  assert.equal(canPublish(song), false)
})
test('music prompt budget enforced', () => {
  const song = base()
  song.musicPrompt = 'x'.repeat(901)
  assert.ok(assessSongPackage(song).includes('INVALID_MUSIC_PROMPT'))
})
