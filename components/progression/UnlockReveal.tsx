import Link from 'next/link'
import { markUnlockSeen } from '@/app/today/actions'

type UnlockRevealProps = {
  id: string
  kind: 'content' | 'collection' | 'game' | 'feature'
  title: string
  subtitle: string
  href?: string
}

export default function UnlockReveal({
  id,
  kind,
  title,
  subtitle,
  href,
}: UnlockRevealProps) {
  const label =
    kind === 'collection'
      ? 'ALBUM UNLOCKED'
      : kind === 'game'
        ? 'NEW GAME'
        : kind === 'content'
          ? 'NEW TRACK'
          : 'NEW UNLOCK'

  return (
    <section className="unlock-reveal" aria-label={label}>
      <div className="unlock-disc" aria-hidden="true">
        <span>♪</span>
      </div>
      <div className="unlock-reveal-copy">
        <p>{label}</p>
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>
      <div className="unlock-reveal-actions">
        {href && <Link href={href}>Open</Link>}
        <form action={markUnlockSeen}>
          <input type="hidden" name="unlockId" value={id} />
          <button type="submit">Nice</button>
        </form>
      </div>
    </section>
  )
}
