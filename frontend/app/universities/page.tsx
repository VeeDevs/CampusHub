export default function UniversitiesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold">Partner Universities</h1>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {["University of Cape Town", "University of Pretoria", "Wits", "Stellenbosch", "University of Johannesburg", "University of Nairobi"].map((u)=>(
          <li key={u} className="rounded-xl bg-white p-4 shadow-soft">{u}</li>
        ))}
      </ul>
    </main>
  );
}
