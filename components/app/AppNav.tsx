import Link from 'next/link'
import { logout } from '@/app/login/actions'

export default function AppNav({ active }: { active?: 'today' | 'learn' }) {
  return (
    <nav className="app-nav" aria-label="Primary">
      <Link className="nav-brand" href="/today">BORAO</Link>
      <div className="nav-links">
        <Link className={active === 'today' ? 'active' : ''} href="/today">Today</Link>
        <Link className={active === 'learn' ? 'active' : ''} href="/learn">Learn</Link>
        <span className="nav-disabled" aria-disabled="true">Music</span>
        <span className="nav-disabled" aria-disabled="true">Drift</span>
      </div>
      <form action={logout}><button className="nav-logout" type="submit">Log out</button></form>
    </nav>
  )
}
