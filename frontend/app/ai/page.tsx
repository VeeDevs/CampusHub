"use client";

import { AppShell } from "@/components/app-shell";
import { API_URL } from "@/lib/api";
import { useState } from "react";

export default function AIPage() {
  const [topic, setTopic] = useState("Linear Algebra");
  const [result, setResult] = useState("Results appear here");

  async function call(path: string, body: Record<string, string>) {
    const token = localStorage.getItem("campushub_token") ?? "";
    const res = await fetch(`${API_URL}/ai/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">AI Study Assistant</h1>
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <input className="w-full rounded-lg border p-3" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-lg bg-sky-600 px-4 py-2 text-white" onClick={() => call("summarize", { text: topic })}>Summarize</button>
          <button className="rounded-lg bg-sky-600 px-4 py-2 text-white" onClick={() => call("quiz", { topic })}>Generate Quiz</button>
          <button className="rounded-lg bg-sky-600 px-4 py-2 text-white" onClick={() => call("flashcards", { topic })}>Flashcards</button>
          <button className="rounded-lg bg-sky-600 px-4 py-2 text-white" onClick={() => call("study-plan", { goals: topic })}>Study Plan</button>
        </div>
        <pre className="mt-6 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{result}</pre>
      </div>
    </AppShell>
  );
}
