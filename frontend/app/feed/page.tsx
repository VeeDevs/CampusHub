"use client";

import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/client-api";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  content: string;
  likes: number;
  comments?: Array<{ id: string }>;
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function loadFeed() {
    try {
      const data = await apiClient<Post[]>("/feed");
      setPosts(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiClient("/feed", { method: "POST", body: JSON.stringify({ content }) }, true);
      setContent("");
      await loadFeed();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function likePost(id: string) {
    try {
      await apiClient(`/feed/${id}/like`, { method: "POST" }, true);
      await loadFeed();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Campus Social Feed</h1>

      <form onSubmit={createPost} className="mb-6 rounded-xl bg-white p-5 shadow-soft">
        <textarea className="w-full rounded-lg border p-3" placeholder="Share an update, event, or question" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="mt-3 rounded-lg bg-sky-600 px-4 py-2 text-white" type="submit">Post update</button>
      </form>

      {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-xl bg-white p-5 shadow-soft">
            <p>{post.content}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Likes: {post.likes} • Comments: {post.comments?.length ?? 0}</p>
              <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => likePost(post.id)}>Like</button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
