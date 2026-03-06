import Link from "next/link";

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold">Platform Features</h1>
      <p className="mt-3 text-slate-600">Marketplace + jobs + social + AI tools in one unified student product.</p>
      <div className="mt-8 card-grid">
        {["Services marketplace", "Notes monetization", "Job board", "Item trading", "Real-time chat", "AI study assistant", "Business discounts", "Admin analytics"].map((f) => (
          <div key={f} className="rounded-xl bg-white p-5 shadow-soft">
            <h2 className="font-semibold">{f}</h2>
          </div>
        ))}
      </div>
      <Link className="mt-10 inline-block rounded-xl bg-sky-600 px-5 py-2.5 text-white" href="/auth/register">Create account</Link>
    </main>
  );
}
