"use client";

import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/client-api";
import { useEffect, useState } from "react";

type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  university: string;
  category: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Tutoring",
    university: ""
  });

  async function loadServices() {
    try {
      const data = await apiClient<Service[]>("/services");
      setServices(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiClient(
        "/services",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            price: Number(form.price)
          })
        },
        true
      );
      setForm({ title: "", description: "", price: "", category: "Tutoring", university: "" });
      await loadServices();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function bookService(id: string) {
    try {
      await apiClient(`/services/${id}/book`, { method: "POST" }, true);
      alert("Service booked successfully");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Student Services</h1>

      <form onSubmit={createService} className="mb-6 grid gap-3 rounded-xl bg-white p-5 shadow-soft md:grid-cols-2">
        <input className="rounded-lg border p-3" placeholder="Service title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="University" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <textarea className="rounded-lg border p-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="rounded-lg bg-sky-600 px-4 py-2 text-white md:col-span-2" type="submit">Create service</button>
      </form>

      {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <div className="card-grid">
        {services.map((s) => (
          <article key={s.id} className="rounded-xl bg-white p-5 shadow-soft">
            <h2 className="font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{s.description}</p>
            <p className="mt-3 text-sm">{s.category} • {s.university}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-semibold">${s.price}</p>
              <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => bookService(s.id)}>
                Book
              </button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
