import Link from 'next/link'
import { signup } from '../login/actions'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{error?: string; message?: string}> }) {
  const params = await searchParams
  return (
    <main className="shell">
      <section className="card lesson auth-card">
        <p className="eyebrow">BORAO · CREATE ACCOUNT</p>
        <h1>Start learning.</h1>
        <form className="auth-form" action={signup}>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
          <div className="auth-actions">
            <button className="primary" type="submit">Create account</button>
          </div>
          {params.error && <p className="feedback">{params.error}</p>}
          {params.message && <p className="feedback">{params.message}</p>}
        </form>
        <p className="auth-switch">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  )
}
