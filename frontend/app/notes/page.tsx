"use client";

import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/client-api";
import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  course: string;
  university: string;
  price: number;
  downloads: number;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", course: "", university: "", price: "", fileUrl: "" });

  async function loadNotes() {
    try {
      const data = await apiClient<Note[]>("/notes");
      setNotes(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function uploadNote(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiClient(
        "/notes",
        {
          method: "POST",
          body: JSON.stringify({ ...form, price: Number(form.price) })
        },
        true
      );
      setForm({ title: "", course: "", university: "", price: "", fileUrl: "" });
      await loadNotes();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function purchaseNote(id: string) {
    try {
      await apiClient(`/notes/${id}/purchase`, { method: "POST" }, true);
      await loadNotes();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Study Notes</h1>

      <form onSubmit={uploadNote} className="mb-6 grid gap-3 rounded-xl bg-white p-5 shadow-soft md:grid-cols-2">
        <input className="rounded-lg border p-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="University" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="rounded-lg border p-3 md:col-span-2" placeholder="File URL (optional)" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
        <button className="rounded-lg bg-sky-600 px-4 py-2 text-white md:col-span-2" type="submit">Upload note</button>
      </form>

      {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <div className="card-grid">
        {notes.map((n) => (
          <article key={n.id} className="rounded-xl bg-white p-5 shadow-soft">
            <h2 className="font-semibold">{n.title}</h2>
            <p className="text-sm text-slate-600">{n.course} • {n.university}</p>
            <p className="mt-2 text-sm">Downloads: {n.downloads}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-semibold">${n.price}</p>
              <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => purchaseNote(n.id)}>
                Purchase
              </button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
