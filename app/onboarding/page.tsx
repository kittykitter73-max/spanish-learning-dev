import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { completeOnboarding } from './actions'

const genres = [
  ['pop','Pop'],['hip_hop','Hip-hop / rap'],['reggaeton_latin_pop','Reggaeton / Latin pop'],['rnb','R&B'],
  ['indie_alt','Indie / alternative'],['rock','Rock'],['country_pop','Country-pop'],['electronic','Electronic / dance'],
  ['acoustic','Acoustic'],['throwback','Throwback / 2000s'],['workout','Workout / high-energy'],['chill','Chill / atmospheric'],
]
const modes = [['drive','Drive'],['energy','Energy'],['zone_out','Zone out'],['talk','Talk'],['play','Play'],['wind_down','Wind down']]

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{error?: string}> }) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) redirect('/login')

  const { data: profile } = await supabase.from('learner_profiles').select('onboarding_completed_at').eq('id', userId).maybeSingle()
  if (profile?.onboarding_completed_at) redirect('/today')
  const params = await searchParams

  return <main className="onboarding-shell">
    <div className="brand-row"><span className="brand">BORAO</span><span className="working">development</span></div>
    <section className="onboarding-head">
      <p className="eyebrow">MAKE IT YOURS</p>
      <h1>What kind of Spanish should find you first?</h1>
      <p className="lede">The curriculum stays rigorous. These choices change the music, contexts, pacing, and way Borao brings the same useful Spanish back to you.</p>
    </section>
    <form action={completeOnboarding} className="onboarding-form">
      <fieldset className="choice-section">
        <legend>Why Spanish?</legend>
        <div className="tile-grid goals-grid">
          {[['daily_life','Daily life'],['conversation','Conversation'],['travel','Travel'],['family_household','Family / household'],['work','Work'],['music_media','Music / media']].map(([value,label]) =>
            <label className="choice-tile" key={value}><input type="radio" name="goal" value={value} required/><span>{label}</span></label>)}
        </div>
      </fieldset>
      <fieldset className="choice-section">
        <legend>What would you actually listen to?</legend>
        <p className="field-help">Pick a few. Genre changes delivery, never the learning standard.</p>
        <div className="tile-grid genre-grid">
          {genres.map(([value,label]) => <label className="choice-tile" key={value}><input type="checkbox" name="genres" value={value}/><span>{label}</span></label>)}
        </div>
      </fieldset>
      <fieldset className="choice-section">
        <legend>How might you use Borao?</legend>
        <div className="tile-grid mode-grid">
          {modes.map(([value,label]) => <label className="choice-tile" key={value}><input type="checkbox" name="modes" value={value}/><span>{label}</span></label>)}
        </div>
      </fieldset>
      <fieldset className="choice-section">
        <legend>How much English support feels good right now?</legend>
        <div className="support-options">
          {[['3','A lot — keep me comfortable'],['2','Some — default beginner support'],['1','A little — make me infer more'],['0','Minimal — let me struggle productively']].map(([value,label]) =>
            <label key={value}><input type="radio" name="english_support" value={value} defaultChecked={value==='2'}/><span>{label}</span></label>)}
        </div>
      </fieldset>
      {params.error && <p className="feedback">{params.error}</p>}
      <button className="primary onboarding-submit" type="submit">Build my first mix</button>
    </form>
  </main>
}
