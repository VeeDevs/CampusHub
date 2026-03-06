export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className="mt-3 text-slate-600">Email founders@campushub.app</p>
      <form className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-soft">
        <input className="w-full rounded-lg border p-3" placeholder="Name" />
        <input className="w-full rounded-lg border p-3" placeholder="Email" />
        <textarea className="w-full rounded-lg border p-3" placeholder="Message" rows={5} />
        <button className="rounded-xl bg-sky-600 px-4 py-2 text-white" type="button">Send</button>
      </form>
    </main>
  );
}
