export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export function getClientToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("campushub_token") ?? "";
}

export async function apiClient<T>(path: string, init?: RequestInit, auth = false): Promise<T> {
  const token = getClientToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
