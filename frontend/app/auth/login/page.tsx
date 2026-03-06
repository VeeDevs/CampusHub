"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("student@campushub.app");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      localStorage.setItem("campushub_token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-7 shadow-soft">
        <h1 className="text-2xl font-bold">Login</h1>
        <input className="w-full rounded-lg border p-3" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full rounded-lg border p-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-xl bg-sky-600 px-4 py-2 text-white" type="submit">Sign in</button>
      </form>
    </main>
  );
}
