import Link from 'next/link'
import { login } from './actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{error?: string; message?: string}> }) {
  const params = await searchParams
  return (
    <main className="shell">
      <section className="card lesson auth-card">
        <p className="eyebrow">BORAO · DEVELOPMENT ACCESS</p>
        <h1>Sign in to learn.</h1>
        <form className="auth-form" action={login}>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
          <div className="auth-actions">
            <button className="primary" type="submit">Sign in</button>
          </div>
          {params.error && <p className="feedback">{params.error}</p>}
          {params.message && <p className="feedback">{params.message}</p>}
        </form>
        <p className="auth-switch">
          Trouble with your password? <Link href="/magic-login">Email me a sign-in link</Link>
        </p>
        <p className="auth-switch">
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  )
}
