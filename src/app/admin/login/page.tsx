"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Field, TextInput } from "@/components/admin/ui";
import { signIn, watchAuth } from "@/lib/firebase/auth";
import { siteConfig } from "@/lib/site";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already signed in (e.g. returning with a persisted session), skip login.
  useEffect(() => {
    return watchAuth((user) => {
      if (user) router.replace("/admin");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch {
      setError("Invalid email or password.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-xl font-bold tracking-tight">
            {siteConfig.name}
          </Link>
          <p className="mt-1 text-sm text-muted">Sign in to the content studio</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email">
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </Field>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="hover:text-accent">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
