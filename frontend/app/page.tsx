import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <nav className="mb-12 flex items-center justify-between rounded-2xl bg-white/80 px-6 py-4 shadow-soft backdrop-blur">
        <h1 className="text-xl font-semibold">CampusHub</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/universities">Universities</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/auth/login" className="rounded-full bg-sky-600 px-4 py-1.5 text-white">Login</Link>
        </div>
      </nav>

      <section className="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-blue-100 p-10 shadow-soft">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-sky-700">Student Economy OS</p>
        <h2 className="max-w-3xl text-5xl font-bold leading-tight">Earn, learn, work and trade on one campus-native platform.</h2>
        <p className="mt-5 max-w-2xl text-slate-600">
          CampusHub combines services, jobs, notes, marketplace, social and AI study tools into one startup-grade SaaS for universities.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/auth/register" className="rounded-xl bg-sky-600 px-6 py-3 text-white">Start Free</Link>
          <Link href="/dashboard" className="rounded-xl border border-slate-300 bg-white px-6 py-3">View App</Link>
        </div>
      </section>

      <section className="mt-10 card-grid">
        {[
          "Sell services and notes",
          "Find student jobs",
          "Trade campus items",
          "Message in real-time",
          "Use AI study assistant",
          "Discover student discounts"
        ].map((feature) => (
          <div key={feature} className="rounded-2xl bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold">{feature}</h3>
            <p className="mt-2 text-sm text-slate-600">Built for practical campus outcomes and real income opportunities.</p>
          </div>
        ))}
      </section>
    </main>
  );
}
