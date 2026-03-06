import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl bg-white p-6 shadow-soft">{children}</div>;
}
