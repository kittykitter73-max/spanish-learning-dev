const test = require('node:test')
const assert = require('node:assert/strict')
const {analyzeProductionJob} = require('../.test-dist/lib/studio/production-overview.js')
const version = () => ({lyrics:'Quiero salir',hooks:['Cinco minutos','Ya voy'],music_prompt:'Latin indie pop',
 exercises:[{kind:'dialogue',prompt:'Vale: ¿Ya bajas?'},{kind:'listening',prompt:'Identify the speaker'},{kind:'transfer',prompt:'Explain a new plan without notes'}]})
const passes = () => ['language','pedagogy','creative'].map(dimension=>({dimension,verdict:'pass',version:2}))
test('content ready still needs human reviews',()=>{
 const out=analyzeProductionJob({current_version:2,status:'drafting'},version(),[],undefined)
 assert.equal(out.phase,'in_review')
 assert.equal(out.passedReviews,0)
 assert.equal(out.missingReviews.length,3)
})
test('approved flag alone cannot bypass missing database approval',()=>{
 const out=analyzeProductionJob({current_version:2,status:'approved'},version(),passes(),undefined)
 assert.equal(out.phase,'founder_queue')
})
test('prior version approval and reviews do not count',()=>{
 const out=analyzeProductionJob({current_version:3,status:'drafting'},version(),passes(),2)
 assert.equal(out.phase,'in_review')
})
test('only current approved version with complete content and reviews is approved',()=>{
 const out=analyzeProductionJob({current_version:2,status:'approved'},version(),passes(),2)
 assert.equal(out.phase,'approved')
})
test('revision request overrides passing reviews',()=>{
 const out=analyzeProductionJob({current_version:2,status:'needs_revision'},version(),[...passes(),{dimension:'language',verdict:'revise',version:2}],undefined)
 assert.equal(out.phase,'revision_required')
})
test('missing dialogue and one incomplete hook block readiness',()=>{
 const v=version();v.hooks[1]=' ';v.exercises=v.exercises.filter(e=>e.kind!=='dialogue')
 const out=analyzeProductionJob({current_version:2,status:'drafting'},v,passes())
 assert.equal(out.phase,'content_blocked')
 assert.ok(out.blockers.includes('Spoken dialogue missing'))
 assert.ok(out.blockers.includes('Two completed hooks required'))
})
test('unavailable saved version never looks complete',()=>{
 assert.equal(analyzeProductionJob({current_version:2,status:'drafting'},null,passes()).phase,'data_unavailable')
})
