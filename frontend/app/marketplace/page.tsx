"use client";

import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/client-api";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  university: string;
  status: string;
};

export default function MarketplacePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Textbooks",
    university: "",
    images: ""
  });

  async function loadItems() {
    try {
      const data = await apiClient<Item[]>("/items");
      setItems(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function listItem(e: React.FormEvent) {
    e.preventDefault();
    try {
      const images = form.images
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      await apiClient(
        "/items",
        {
          method: "POST",
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            price: Number(form.price),
            category: form.category,
            university: form.university,
            images,
            status: "available"
          })
        },
        true
      );

      setForm({ title: "", description: "", price: "", category: "Textbooks", university: "", images: "" });
      await loadItems();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Student Marketplace</h1>

      <form onSubmit={listItem} className="mb-6 grid gap-3 rounded-xl bg-white p-5 shadow-soft md:grid-cols-2">
        <input className="rounded-lg border p-3" placeholder="Item title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="University" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="rounded-lg border p-3 md:col-span-2" placeholder="Image URLs (comma-separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <textarea className="rounded-lg border p-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="rounded-lg bg-sky-600 px-4 py-2 text-white md:col-span-2" type="submit">List item</button>
      </form>

      {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <div className="card-grid">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl bg-white p-5 shadow-soft">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            <p className="mt-2 text-sm">{item.category} • {item.university} • {item.status}</p>
            <p className="mt-1 font-semibold">${item.price}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
