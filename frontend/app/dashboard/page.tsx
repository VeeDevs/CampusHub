import { AppShell } from "@/components/app-shell";
import { API_URL } from "@/lib/api";

async function getStats() {
  const [services, notes, jobs, items] = await Promise.all([
    fetch(`${API_URL}/services`, { cache: "no-store" }).then((r) => r.json()),
    fetch(`${API_URL}/notes`, { cache: "no-store" }).then((r) => r.json()),
    fetch(`${API_URL}/jobs`, { cache: "no-store" }).then((r) => r.json()),
    fetch(`${API_URL}/items`, { cache: "no-store" }).then((r) => r.json())
  ]);
  return { services, notes, jobs, items };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">CampusHub Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Services</p><p className="text-2xl font-semibold">{stats.services.length}</p></div>
        <div className="rounded-xl bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Notes</p><p className="text-2xl font-semibold">{stats.notes.length}</p></div>
        <div className="rounded-xl bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Jobs</p><p className="text-2xl font-semibold">{stats.jobs.length}</p></div>
        <div className="rounded-xl bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Items</p><p className="text-2xl font-semibold">{stats.items.length}</p></div>
      </div>
    </AppShell>
  );
}
