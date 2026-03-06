"use client";

import { AppShell } from "@/components/app-shell";
import { API_URL } from "@/lib/api";
import { useState } from "react";

type SearchResult = {
  services: Array<{ id: string; title: string; price: number; university: string }>;
  items: Array<{ id: string; title: string; price: number; university: string }>;
  notes: Array<{ id: string; title: string; price: number; university: string }>;
  jobs: Array<{ id: string; title: string; company: string; pay: number }>;
};

const emptyResults: SearchResult = { services: [], items: [], notes: [], jobs: [] };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [university, setUniversity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [results, setResults] = useState<SearchResult>(emptyResults);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (university) params.set("university", university);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const res = await fetch(`${API_URL}/search?${params.toString()}`);
    const data = (await res.json()) as SearchResult;
    setResults(data);
  }

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Global Search</h1>
      <form onSubmit={runSearch} className="mb-6 grid gap-3 rounded-2xl bg-white p-5 shadow-soft md:grid-cols-4">
        <input className="rounded-lg border p-3" placeholder="Search services, items, notes, jobs" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input className="rounded-lg border p-3" placeholder="Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input className="rounded-lg border p-3" placeholder="University (optional)" value={university} onChange={(e) => setUniversity(e.target.value)} />
        <input className="rounded-lg border p-3" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-white md:col-span-4">Search</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl bg-white p-5 shadow-soft">
          <h2 className="mb-3 text-lg font-semibold">Services ({results.services.length})</h2>
          <ul className="space-y-2 text-sm">
            {results.services.map((s) => <li key={s.id}>{s.title} • ${s.price} • {s.university}</li>)}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-soft">
          <h2 className="mb-3 text-lg font-semibold">Items ({results.items.length})</h2>
          <ul className="space-y-2 text-sm">
            {results.items.map((i) => <li key={i.id}>{i.title} • ${i.price} • {i.university}</li>)}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-soft">
          <h2 className="mb-3 text-lg font-semibold">Notes ({results.notes.length})</h2>
          <ul className="space-y-2 text-sm">
            {results.notes.map((n) => <li key={n.id}>{n.title} • ${n.price} • {n.university}</li>)}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-soft">
          <h2 className="mb-3 text-lg font-semibold">Jobs ({results.jobs.length})</h2>
          <ul className="space-y-2 text-sm">
            {results.jobs.map((j) => <li key={j.id}>{j.title} • {j.company} • ${j.pay}</li>)}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
