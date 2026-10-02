import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="shell landing">
      <div className="brand-row"><span className="brand">BORAO</span><span className="working">working name</span></div>
      <section className="hero">
        <p className="eyebrow">SPANISH THAT GETS STUCK IN YOUR HEAD</p>
        <h1>Learn through music, stories, games, and actual use.</h1>
        <p className="lede">A first Borao prototype: hear a natural scene, retrieve the language, then make it yours.</p>
        <Link className="primary" href="/today">Enter Borao</Link>
      </section>
    </main>
  )
}
