import Link from 'next/link'
import { sendMagicLink } from '../login/actions'

export default async function MagicLoginPage({ searchParams }: { searchParams: Promise<{error?: string; message?: string}> }) {
  const params = await searchParams

  return (
    <main className="shell">
      <section className="card lesson auth-card">
        <p className="eyebrow">BORAO · EMAIL SIGN-IN</p>
        <h1>Sign in without a password.</h1>
        <p>Enter the email you used for Borao and we’ll send you a secure sign-in link.</p>

        <form className="auth-form" action={sendMagicLink}>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <div className="auth-actions">
            <button className="primary" type="submit">Email me a sign-in link</button>
          </div>
          {params.error && <p className="feedback">{params.error}</p>}
          {params.message && <p className="feedback">{params.message}</p>}
        </form>

        <p className="auth-switch">
          Prefer a password? <Link href="/login">Use password sign in</Link>
        </p>
      </section>
    </main>
  )
}
