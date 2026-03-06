"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    role: "student"
  });
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setMessage(res.ok ? "Account created. You can now login." : "Registration failed.");
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-7 shadow-soft">
        <h1 className="text-2xl font-bold">Create account</h1>
        <input className="w-full rounded-lg border p-3" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded-lg border p-3" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-lg border p-3" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input className="w-full rounded-lg border p-3" placeholder="University" onChange={(e) => setForm({ ...form, university: e.target.value })} />
        <select className="w-full rounded-lg border p-3" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="business">Business</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full rounded-xl bg-sky-600 px-4 py-2 text-white" type="submit">Create account</button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </form>
    </main>
  );
}
