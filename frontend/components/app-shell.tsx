"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const links = [
  ["/dashboard", "Dashboard"],
  ["/services", "Services"],
  ["/notes", "Notes"],
  ["/jobs", "Jobs"],
  ["/marketplace", "Marketplace"],
  ["/messages", "Messages"],
  ["/feed", "Feed"],
  ["/deals", "Deals"],
  ["/search", "Search"],
  ["/notifications", "Notifications"],
  ["/payments", "Payments"],
  ["/ai", "AI Study"],
  ["/admin", "Admin"]
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
      <aside className="hidden w-64 rounded-2xl bg-white p-5 shadow-soft md:block">
        <h2 className="mb-6 text-lg font-semibold">CampusHub</h2>
        <nav className="space-y-1 text-sm">
          {links.map(([href, label]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`block rounded-lg px-3 py-2 ${active ? "bg-sky-600 text-white" : "text-slate-700 hover:bg-slate-100"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
