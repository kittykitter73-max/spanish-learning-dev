import Link from 'next/link'
import { logout } from '@/app/login/actions'

type Active = 'home' | 'listen' | 'play' | 'speak' | 'library'

const items: Array<{key: Active; href: string; label: string}> = [
  { key: 'home', href: '/today', label: 'Home' },
  { key: 'listen', href: '/listen', label: 'Listen' },
  { key: 'play', href: '/play', label: 'Play' },
  { key: 'speak', href: '/speak', label: 'Speak' },
  { key: 'library', href: '/library', label: 'Library' },
]

export default function AppNav({ active }: { active?: Active }) {
  return (
    <>
      <nav className="app-nav" aria-label="Primary">
        <Link className="nav-brand" href="/today">BORAO</Link>
        <div className="nav-links">
          {items.map(item => (
            <Link
              key={item.key}
              className={active === item.key ? 'active' : ''}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <form action={logout}>
          <button className="nav-logout" type="submit">Log out</button>
        </form>
      </nav>

      <nav className="mobile-tab-bar" aria-label="Mobile primary">
        {items.map(item => (
          <Link
            key={item.key}
            className={active === item.key ? 'active' : ''}
            href={item.href}
          >
            <span className="mobile-tab-dot" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
