"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "./AuthProvider";
import { AdminSidebar } from "./AdminSidebar";

function Guard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted">
        Loading…
      </div>
    );
  }

  if (!user) return null; // redirecting

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Guard>{children}</Guard>
    </AuthProvider>
  );
}
