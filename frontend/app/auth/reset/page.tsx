"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    });
    setMessage(res.ok ? "Password reset successful." : "Password reset failed.");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-7 shadow-soft">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <input className="w-full rounded-lg border p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-lg border p-3" type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button className="w-full rounded-xl bg-sky-600 px-4 py-2 text-white" type="submit">Reset</button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </form>
    </main>
  );
}
