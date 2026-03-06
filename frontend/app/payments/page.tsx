"use client";

import { AppShell } from "@/components/app-shell";
import { apiClient } from "@/lib/client-api";
import { useState } from "react";

type CheckoutResponse = {
  clientSecret?: string;
  message?: string;
  transaction: {
    id: string;
    amount: number;
    status: string;
    platformFee: number;
    sellerNet: number;
  };
};

export default function PaymentsPage() {
  const [form, setForm] = useState({ sellerId: "", amount: "", type: "service" });
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [error, setError] = useState("");

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await apiClient<CheckoutResponse>(
        "/payments/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            sellerId: form.sellerId,
            amount: Number(form.amount),
            type: form.type
          })
        },
        true
      );
      setResult(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function confirm(txId: string) {
    try {
      const data = await apiClient(`/payments/${txId}/confirm`, { method: "POST" }, true);
      setResult((prev) => (prev ? { ...prev, transaction: data as CheckoutResponse["transaction"] } : prev));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Payments</h1>

      <form onSubmit={checkout} className="grid gap-3 rounded-xl bg-white p-5 shadow-soft md:grid-cols-3">
        <input className="rounded-lg border p-3" placeholder="Seller user ID" value={form.sellerId} onChange={(e) => setForm({ ...form, sellerId: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input className="rounded-lg border p-3" placeholder="Type (service/note/item)" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
        <button className="rounded-lg bg-sky-600 px-4 py-2 text-white md:col-span-3" type="submit">Create checkout</button>
      </form>

      {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {result && (
        <div className="mt-6 rounded-xl bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Transaction</h2>
          <p className="mt-1 text-sm">ID: {result.transaction.id}</p>
          <p className="text-sm">Status: {result.transaction.status}</p>
          <p className="text-sm">Amount: ${result.transaction.amount}</p>
          <p className="text-sm">Platform Fee: ${result.transaction.platformFee}</p>
          <p className="text-sm">Seller Net: ${result.transaction.sellerNet}</p>
          {result.clientSecret && <p className="mt-2 text-xs text-slate-500">Stripe client secret returned.</p>}
          {result.message && <p className="mt-2 text-xs text-slate-500">{result.message}</p>}
          {result.transaction.status !== "succeeded" && (
            <button className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-white" onClick={() => confirm(result.transaction.id)}>
              Confirm payment
            </button>
          )}
        </div>
      )}
    </AppShell>
  );
}
