"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "🏠" },
  { href: "/dashboard/meta", label: "Meta API", icon: "📣" },
  { href: "/dashboard/ai", label: "AI Tools", icon: "🤖" },
  { href: "/dashboard/voice", label: "Voice (ElevenLabs)", icon: "🎙️" },
];

const adminItems = [{ href: "/dashboard/admin", label: "User Admin", icon: "👥" }];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <span className="text-lg font-bold text-slate-900">Marketing Hub</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <p className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Admin
            </p>
            <ul className="space-y-1">
              {adminItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-900">
              {session?.user?.name}
            </p>
            <p className="truncate text-xs text-slate-500">
              {session?.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  );
}
