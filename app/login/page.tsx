import { login, signup } from './actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{error?: string; message?: string}> }) {
  const params = await searchParams
  return (
    <main className="shell">
      <section className="card lesson auth-card">
        <p className="eyebrow">BORAO · DEVELOPMENT ACCESS</p>
        <h1>Sign in to learn.</h1>
        <form className="auth-form">
          <label>Email<input name="email" type="email" required /></label>
          <label>Password<input name="password" type="password" minLength={8} required /></label>
          <div className="auth-actions">
            <button className="primary" formAction={login}>Sign in</button>
            <button className="secondary" formAction={signup}>Create account</button>
          </div>
          {params.error && <p className="feedback">{params.error}</p>}
          {params.message && <p className="feedback">{params.message}</p>}
        </form>
      </section>
    </main>
  )
}
