"use client";

import { AppShell } from "@/components/app-shell";
import { API_URL } from "@/lib/api";
import { getClientToken } from "@/lib/client-api";
import { io } from "socket.io-client";
import { useEffect, useMemo, useState } from "react";

type Me = {
  id: string;
  name: string;
};

export default function MessagesPage() {
  const [chatId, setChatId] = useState("");
  const [senderId, setSenderId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState("");

  const socket = useMemo(() => io(API_URL.replace("/api", "")), []);

  useEffect(() => {
    async function loadMe() {
      const token = getClientToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const me = (await res.json()) as Me;
        setSenderId(me.id);
      }
    }

    loadMe();

    socket.on("new_message", (msg) => setMessages((prev) => [...prev, msg]));
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  function join() {
    if (!chatId) {
      setError("Enter chat ID first");
      return;
    }
    socket.emit("join_chat", chatId);
    setError("");
  }

  function send() {
    if (!chatId || !senderId || !message) {
      setError("Chat ID, sender, and message are required");
      return;
    }

    socket.emit("send_message", { chatId, senderId, message });
    setMessage("");
    setError("");
  }

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Messaging</h1>
      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-soft">
        <input className="w-full rounded-lg border p-3" placeholder="Chat ID" value={chatId} onChange={(e) => setChatId(e.target.value)} />
        <input className="w-full rounded-lg border p-3" placeholder="Sender User ID" value={senderId} onChange={(e) => setSenderId(e.target.value)} />
        <button className="rounded-lg bg-slate-800 px-3 py-2 text-white" onClick={join}>Join chat</button>
        <div className="flex gap-2">
          <input className="flex-1 rounded-lg border p-3" placeholder="Type message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className="rounded-lg bg-sky-600 px-4 py-2 text-white" onClick={send}>Send</button>
        </div>
        {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <pre className="rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(messages, null, 2)}</pre>
      </div>
    </AppShell>
  );
}
