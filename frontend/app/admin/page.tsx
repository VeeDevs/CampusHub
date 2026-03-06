"use client";

import { AppShell } from "@/components/app-shell";
import { API_URL } from "@/lib/api";
import { useState } from "react";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState("Admin analytics will appear here");

  async function load() {
    const res = await fetch(`${API_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.text();
    setData(body);
  }

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <input className="w-full rounded-lg border p-3" placeholder="Admin JWT token" value={token} onChange={(e) => setToken(e.target.value)} />
        <button className="mt-3 rounded-lg bg-sky-600 px-4 py-2 text-white" onClick={load}>Load analytics</button>
        <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{data}</pre>
      </div>
    </AppShell>
  );
}
