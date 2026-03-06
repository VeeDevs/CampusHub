"use client";

import { AppShell } from "@/components/app-shell";
import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";

type Notification = {
  id: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState("");

  async function loadNotifications() {
    const token = localStorage.getItem("campushub_token") ?? "";
    if (!token) {
      setError("Login first to view notifications.");
      return;
    }

    const res = await fetch(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      setError("Failed to load notifications.");
      return;
    }

    const data = (await res.json()) as Notification[];
    setNotifications(data);
    setError("");
  }

  async function markRead(id: string) {
    const token = localStorage.getItem("campushub_token") ?? "";
    await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
    await loadNotifications();
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button className="rounded-lg bg-slate-800 px-3 py-2 text-white" onClick={loadNotifications}>Refresh</button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-rose-700">{error}</p>}

      <div className="space-y-3">
        {notifications.map((n) => (
          <article key={n.id} className="rounded-xl bg-white p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-slate-500">{n.type}</p>
            <p className="mt-1">{n.content}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</p>
              {!n.read && (
                <button className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm text-white" onClick={() => markRead(n.id)}>
                  Mark as read
                </button>
              )}
            </div>
          </article>
        ))}
        {notifications.length === 0 && !error && (
          <p className="rounded-xl bg-white p-6 text-slate-600 shadow-soft">No notifications yet.</p>
        )}
      </div>
    </AppShell>
  );
}
