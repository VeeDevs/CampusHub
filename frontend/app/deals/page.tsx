"use client";

import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/client-api";
import { useEffect, useState } from "react";

type Deal = {
  id: string;
  businessName: string;
  title: string;
  description: string;
  discount: string;
  location: string;
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    businessName: "",
    title: "",
    description: "",
    discount: "",
    location: "",
    expiryDate: ""
  });

  async function loadDeals() {
    try {
      const data = await apiClient<Deal[]>("/deals");
      setDeals(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function createDeal(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiClient("/deals", { method: "POST", body: JSON.stringify(form) }, true);
      setForm({ businessName: "", title: "", description: "", discount: "", location: "", expiryDate: "" });
      await loadDeals();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadDeals();
  }, []);

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Business Deals</h1>

      <form onSubmit={createDeal} className="mb-6 grid gap-3 rounded-xl bg-white p-5 shadow-soft md:grid-cols-2">
        <input className="rounded-lg border p-3" placeholder="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Deal title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Discount (e.g. 20%)" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="rounded-lg border p-3 md:col-span-2" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
        <textarea className="rounded-lg border p-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="rounded-lg bg-sky-600 px-4 py-2 text-white md:col-span-2" type="submit">Publish deal (business/admin)</button>
      </form>

      {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <div className="card-grid">
        {deals.map((deal) => (
          <article key={deal.id} className="rounded-xl bg-white p-5 shadow-soft">
            <p className="text-sm uppercase tracking-wide text-slate-500">{deal.businessName}</p>
            <h2 className="mt-1 font-semibold">{deal.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{deal.description}</p>
            <p className="mt-3 font-semibold">{deal.discount}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
