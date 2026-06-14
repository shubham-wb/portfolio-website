"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui";
import { seedSampleData } from "@/lib/admin/seed";

export function SeedButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handle() {
    if (
      !window.confirm(
        "Add sample posts, projects, skills, and settings? Existing collections are left alone.",
      )
    )
      return;
    setBusy(true);
    try {
      await seedSampleData();
      setDone(true);
      router.refresh();
    } catch {
      window.alert("Seeding failed — check your Firestore rules and sign-in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="secondary" onClick={handle} disabled={busy || done}>
      {busy ? "Seeding…" : done ? "Sample data added" : "Load sample data"}
    </Button>
  );
}
