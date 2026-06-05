"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/site";
import { AdminNavIcon, EyeIcon, LogOutIcon } from "@/components/icons";

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-card md:h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-sm font-bold text-on-accent">
          S
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Admin</p>
          <p className="text-xs text-muted">Content studio</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
              isActive(item.href)
                ? "bg-accent/10 font-medium text-accent"
                : "text-muted hover:bg-card-hover hover:text-foreground"
            }`}
          >
            <AdminNavIcon href={item.href} className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden flex-col gap-1 border-t border-border p-3 md:flex">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground"
        >
          <EyeIcon className="h-4 w-4" />
          View site
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground"
        >
          <LogOutIcon className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
