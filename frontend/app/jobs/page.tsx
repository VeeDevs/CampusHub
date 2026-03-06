"use client";

import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/client-api";
import { useEffect, useState } from "react";

type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  pay: number;
  location: string;
  type: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    pay: "",
    location: "",
    type: "part_time"
  });
  const [resumeUrl, setResumeUrl] = useState("https://example.com/resume.pdf");

  async function loadJobs() {
    try {
      const data = await apiClient<Job[]>("/jobs");
      setJobs(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function postJob(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiClient(
        "/jobs",
        {
          method: "POST",
          body: JSON.stringify({ ...form, pay: Number(form.pay) })
        },
        true
      );
      setForm({ title: "", company: "", description: "", pay: "", location: "", type: "part_time" });
      await loadJobs();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function apply(jobId: string) {
    try {
      await apiClient(`/jobs/${jobId}/apply`, { method: "POST", body: JSON.stringify({ resumeUrl }) }, true);
      alert("Application submitted");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Student Jobs</h1>

      <form onSubmit={postJob} className="mb-6 grid gap-3 rounded-xl bg-white p-5 shadow-soft md:grid-cols-2">
        <input className="rounded-lg border p-3" placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Pay" value={form.pay} onChange={(e) => setForm({ ...form, pay: e.target.value })} />
        <select className="rounded-lg border p-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="part_time">Part time</option>
          <option value="full_time">Full time</option>
          <option value="internship">Internship</option>
          <option value="gig">Gig</option>
        </select>
        <input className="rounded-lg border p-3" placeholder="Resume URL for applying" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} />
        <textarea className="rounded-lg border p-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="rounded-lg bg-sky-600 px-4 py-2 text-white md:col-span-2" type="submit">Post job (business/admin)</button>
      </form>

      {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <div className="space-y-4">
        {jobs.map((j) => (
          <article key={j.id} className="rounded-xl bg-white p-5 shadow-soft">
            <h2 className="text-xl font-semibold">{j.title}</h2>
            <p className="text-slate-600">{j.company} • {j.location} • {j.type}</p>
            <p className="mt-2 text-sm text-slate-600">{j.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-semibold">${j.pay} / hr</p>
              <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => apply(j.id)}>Apply</button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
