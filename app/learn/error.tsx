'use client'

export default function LearnError({ reset }: { reset: () => void }) {
  return <main className="shell"><section className="card lesson error-card"><p className="eyebrow">WE HIT A SNAG</p><h1>Your progress is safe.</h1><p className="lede">The lesson did not load cleanly. Try it again before we change anything about your learning state.</p><button className="primary" onClick={reset}>Reload lesson</button></section></main>
}
