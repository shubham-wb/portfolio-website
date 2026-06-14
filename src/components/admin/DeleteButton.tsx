"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/icons";
import { deletePost, deleteProject, deleteSkill } from "@/lib/admin/db";

const deleters = {
  post: deletePost,
  project: deleteProject,
  skill: deleteSkill,
} as const;

export function DeleteButton({
  id,
  kind,
  label,
}: {
  id: string;
  kind: keyof typeof deleters;
  label?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handle() {
    if (!window.confirm(`Delete ${label ?? "this item"}? This can't be undone.`))
      return;
    setBusy(true);
    try {
      await deleters[kind](id);
      router.refresh();
    } catch {
      window.alert("Delete failed.");
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handle}
      disabled={busy}
      aria-label="Delete"
      className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
