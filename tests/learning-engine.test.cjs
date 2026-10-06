const test = require('node:test')
const assert = require('node:assert/strict')

const { scoreAssessment } = require('../.test-dist/lib/learning/assessment.js')
const { evidenceStrength } = require('../.test-dist/lib/learning/evidence.js')
const { recommendationScore } = require('../.test-dist/lib/learning/recommendation.js')
const { evaluateCheckpointReadiness } = require('../.test-dist/lib/learning/readiness.js')
const {
  isAccessSatisfied,
  collectionAccessSummary,
} = require('../.test-dist/lib/progression/access.js')

const {
  boundedIndex,
  nextQueueIndex,
  previousQueueIndex,
  formatPlaybackTime,
  exposureThresholdSeconds,
} = require('../.test-dist/lib/player/queue.js')

function item(overrides = {}) {
  return {
    id: 'a1',
    slug: 'test',
    concept_id: 'c1',
    prompt: 'Prompt',
    item_type: 'typed_response',
    evidence_type: 'guided_production',
    options: [],
    scoring_strategy: 'exact_text',
    scoring_rules: {},
    hint_level: 0,
    sequence_number: 1,
    ...overrides,
  }
}

test('exact-text scoring normalizes case, spacing and Spanish punctuation', () => {
  const assessment = item({
    scoring_strategy: 'exact_text',
    scoring_rules: { accepted_answers: ['Quiero ir'] },
  })

  assert.equal(scoreAssessment(assessment, ' ¿QUIERO   IR! ').success, true)
})

test('choice-key scoring rejects non-accepted keys', () => {
  const assessment = item({
    item_type: 'multiple_choice',
    scoring_strategy: 'choice_key',
    scoring_rules: { accepted_keys: ['b'] },
  })

  assert.equal(scoreAssessment(assessment, 'a').success, false)
  assert.equal(scoreAssessment(assessment, 'B').success, true)
})

test('prefix + infinitive scoring requires a known infinitive after the prefix', () => {
  const assessment = item({
    scoring_strategy: 'prefix_known_infinitive',
    scoring_rules: {
      prefix: 'tengo que',
      known_infinitives: ['ir', 'comer'],
    },
  })

  assert.equal(scoreAssessment(assessment, 'Tengo que ir').success, true)
  assert.equal(scoreAssessment(assessment, 'Tengo que bailar').success, false)
  assert.equal(scoreAssessment(assessment, 'Quiero ir').success, false)
})

test('empty responses never pass', () => {
  const assessment = item({
    scoring_strategy: 'exact_text',
    scoring_rules: { accepted_answers: ['quiero ir'] },
  })

  assert.equal(scoreAssessment(assessment, '   ').success, false)
})

test('exposure is weaker than recognition and unaided production', () => {
  assert.ok(evidenceStrength('exposure') < evidenceStrength('recognition'))
  assert.ok(evidenceStrength('recognition') < evidenceStrength('independent_production'))
})

test('hints reduce evidence strength', () => {
  const unaided = evidenceStrength('guided_production')
  const hinted = evidenceStrength('guided_production', { hintLevel: 2 })
  assert.ok(hinted < unaided)
})

test('delayed self-generated novel-context evidence strengthens production but caps at one', () => {
  const base = evidenceStrength('independent_production')
  const strong = evidenceStrength('independent_production', {
    delayed: true,
    selfGenerated: true,
    novelContext: true,
  })

  assert.ok(strong > base)
  assert.ok(strong <= 1)
})

test('recommendation scoring rewards due/error relevance and penalizes duplication/frustration', () => {
  const strongCandidate = recommendationScore({
    due: 1,
    prerequisiteGap: 0.5,
    newTarget: 0.5,
    errorRelevance: 1,
    modalityDiversity: 0.5,
    goalRelevance: 0.5,
    preferenceFit: 0.5,
    novelty: 0.5,
    duplicatePenalty: 0,
    frustrationPenalty: 0,
  })

  const staleDuplicate = recommendationScore({
    due: 0,
    prerequisiteGap: 0,
    newTarget: 0.5,
    errorRelevance: 0,
    modalityDiversity: 0,
    goalRelevance: 0.5,
    preferenceFit: 1,
    novelty: 0,
    duplicatePenalty: 1,
    frustrationPenalty: 1,
  })

  assert.ok(strongCandidate > staleDuplicate)
})

const { safeInternalPath } = require('../.test-dist/lib/navigation.js')

test('confirmation redirect accepts internal paths and rejects external or protocol-relative URLs', () => {
  assert.equal(safeInternalPath('/onboarding?from=confirm'), '/onboarding?from=confirm')
  assert.equal(safeInternalPath('https://evil.example/phish'), '/today')
  assert.equal(safeInternalPath('//evil.example/phish'), '/today')
  assert.equal(safeInternalPath('javascript:alert(1)'), '/today')
})


test('player queue bounds and advances without wrapping unexpectedly', () => {
  assert.equal(boundedIndex(3, -1), 0)
  assert.equal(boundedIndex(3, 99), 2)
  assert.equal(nextQueueIndex(3, 0), 1)
  assert.equal(nextQueueIndex(3, 2), -1)
  assert.equal(previousQueueIndex(3, 2), 1)
  assert.equal(previousQueueIndex(3, 0), -1)
})

test('playback time formatting is stable for invalid and valid input', () => {
  assert.equal(formatPlaybackTime(Number.NaN), '0:00')
  assert.equal(formatPlaybackTime(-1), '0:00')
  assert.equal(formatPlaybackTime(0), '0:00')
  assert.equal(formatPlaybackTime(65.9), '1:05')
})


test('listening exposure requires a meaningful slice instead of a play tap', () => {
  assert.equal(exposureThresholdSeconds(Number.NaN), 10)
  assert.equal(exposureThresholdSeconds(8), 3)
  assert.equal(exposureThresholdSeconds(20), 5)
  assert.equal(exposureThresholdSeconds(120), 10)
})


test('progression access separates starter, readiness and explicit unlock rules', () => {
  const context = {
    unitStates: new Map([
      ['u-ready', 'active'],
      ['u-done', 'completed'],
    ]),
    pathStates: new Map([['p-done', 'completed']]),
    directUnlockedContentIds: new Set(['content-manual']),
    unlockedCollectionIds: new Set(['album-full']),
    unlockedGameIds: new Set(['game-manual']),
  }

  assert.equal(isAccessSatisfied({ accessRule: 'immediate' }, context), true)
  assert.equal(isAccessSatisfied({ accessRule: 'unit_ready', requiredUnitId: 'u-ready' }, context), true)
  assert.equal(isAccessSatisfied({ accessRule: 'unit_complete', requiredUnitId: 'u-ready' }, context), false)
  assert.equal(isAccessSatisfied({ accessRule: 'unit_complete', requiredUnitId: 'u-done' }, context), true)
  assert.equal(isAccessSatisfied({ accessRule: 'path_complete', requiredPathId: 'p-done' }, context), true)
  assert.equal(isAccessSatisfied({ accessRule: 'manual', contentItemId: 'content-manual' }, context), true)
  assert.equal(isAccessSatisfied({ accessRule: 'manual', collectionId: 'album-full' }, context), true)
  assert.equal(isAccessSatisfied({ accessRule: 'manual', gameId: 'game-manual' }, context), true)
  assert.equal(isAccessSatisfied({ accessRule: 'manual', contentItemId: 'locked' }, context), false)
})

test('collection progress counts content access without implying mastery', () => {
  const context = {
    unitStates: new Map([['u1', 'completed']]),
    pathStates: new Map(),
    directUnlockedContentIds: new Set(),
    unlockedCollectionIds: new Set(),
    unlockedGameIds: new Set(),
  }

  const summary = collectionAccessSummary([
    { accessRule: 'immediate' },
    { accessRule: 'unit_complete', requiredUnitId: 'u1' },
    { accessRule: 'manual' },
  ], context)

  assert.deepEqual(summary, {
    total: 3,
    unlocked: 2,
    complete: false,
    empty: false,
  })
})


test('Ready Check requires fresh unaided evidence instead of counting supported practice', () => {
  const requirements = [
    {
      key: 'C001-listening',
      conceptId: 'C001',
      dimension: 'listening',
      minSuccesses: 1,
      maxHintLevel: 0,
      requireFresh: true,
    },
    {
      key: 'C001-generated',
      conceptId: 'C001',
      dimension: 'generated_use',
      minSuccesses: 1,
      maxHintLevel: 0,
      requireSelfGenerated: true,
      requireFresh: true,
    },
  ]

  const result = evaluateCheckpointReadiness(requirements, [
    {
      conceptId: 'C001',
      dimension: 'listening',
      success: true,
      hintLevel: 1,
      fresh: true,
    },
    {
      conceptId: 'C001',
      dimension: 'generated_use',
      success: true,
      hintLevel: 0,
      selfGenerated: true,
      fresh: false,
    },
  ])

  assert.equal(result.status, 'needs_more_evidence')
  assert.deepEqual(result.satisfiedKeys, [])
  assert.deepEqual(result.unresolvedKeys.sort(), ['C001-generated', 'C001-listening'])
})

test('Ready Check can require distinct manipulation contexts', () => {
  const requirement = [{
    key: 'C090-manipulation',
    conceptId: 'C090',
    dimension: 'manipulation',
    minSuccesses: 3,
    maxHintLevel: 0,
    requireSelfGenerated: true,
    requireFresh: true,
    distinctContextCount: 3,
  }]

  const repeated = evaluateCheckpointReadiness(requirement, [
    { conceptId: 'C090', dimension: 'manipulation', success: true, selfGenerated: true, fresh: true, contextKey: 'quiero>voy-a' },
    { conceptId: 'C090', dimension: 'manipulation', success: true, selfGenerated: true, fresh: true, contextKey: 'quiero>voy-a' },
    { conceptId: 'C090', dimension: 'manipulation', success: true, selfGenerated: true, fresh: true, contextKey: 'puedo>no-puedo' },
  ])

  assert.equal(repeated.status, 'needs_more_evidence')

  const varied = evaluateCheckpointReadiness(requirement, [
    { conceptId: 'C090', dimension: 'manipulation', success: true, selfGenerated: true, fresh: true, contextKey: 'quiero>voy-a' },
    { conceptId: 'C090', dimension: 'manipulation', success: true, selfGenerated: true, fresh: true, contextKey: 'puedo>no-puedo' },
    { conceptId: 'C090', dimension: 'manipulation', success: true, selfGenerated: true, fresh: true, contextKey: 'quiero>necesito' },
  ])

  assert.equal(varied.status, 'ready')
})

test('technical failure is separated from Spanish failure', () => {
  const requirements = [{
    key: 'C004-listening',
    conceptId: 'C004',
    dimension: 'listening',
    minSuccesses: 1,
    maxHintLevel: 0,
    requireFresh: true,
  }]

  const result = evaluateCheckpointReadiness(requirements, [{
    conceptId: 'C004',
    dimension: 'listening',
    technicalIssue: true,
    fresh: true,
  }])

  assert.equal(result.status, 'technical_issue')
  assert.deepEqual(result.technicalIssueKeys, ['C004-listening'])
})
