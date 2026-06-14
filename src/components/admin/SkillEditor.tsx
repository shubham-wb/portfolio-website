"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Skill } from "@/lib/types";
import { Button, Card, Field, TextInput, TextArea } from "./ui";
import { saveSkill, deleteSkill } from "@/lib/admin/db";
import { uploadFile } from "@/lib/upload";

export function SkillEditor({ initial }: { initial?: Skill | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [logo, setLogo] = useState(initial?.logo ?? "");
  const [order, setOrder] = useState(String(initial?.order ?? 1));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogo(file: File) {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFile(`skills/${Date.now()}-${file.name}`, file);
      setLogo(url);
    } catch {
      setError("Logo upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setError(null);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setBusy(true);
    try {
      await saveSkill({
        id: initial?.id,
        name: name.trim(),
        summary,
        logo: logo || undefined,
        order: Number(order) || 0,
      });
      router.push("/admin/skills");
      router.refresh();
    } catch {
      setError("Could not save. Check your connection and Firestore rules.");
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!window.confirm("Delete this skill?")) return;
    setBusy(true);
    try {
      await deleteSkill(initial.id);
      router.push("/admin/skills");
      router.refresh();
    } catch {
      setError("Could not delete.");
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/skills"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            ← Skills
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {isEdit ? "Edit skill" : "New skill"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <Button variant="danger" onClick={handleDelete} disabled={busy}>
              Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <Card className="space-y-5">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-background">
            {logo ? (
              <Image src={logo} alt="" width={48} height={48} className="object-contain" />
            ) : (
              <span className="text-xs text-muted">logo</span>
            )}
          </span>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-card-hover">
            {uploading ? "Uploading…" : logo ? "Replace logo" : "Upload logo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleLogo(f);
              }}
            />
          </label>
        </div>

        <Field label="Name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="TypeScript" />
        </Field>
        <Field label="Summary" hint="A short one-liner.">
          <TextArea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Typed JavaScript I reach for on every project."
          />
        </Field>
        <Field label="Order" hint="Lower shows first.">
          <TextInput type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
        </Field>
      </Card>
    </div>
  );
}
