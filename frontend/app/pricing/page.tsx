export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold">Startup Pricing</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[{t:"Student",p:"Free"},{t:"Business",p:"$29/mo"},{t:"Campus",p:"Custom"}].map((x)=>(
          <div key={x.t} className="rounded-2xl bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold">{x.t}</h2>
            <p className="mt-3 text-3xl font-bold">{x.p}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
