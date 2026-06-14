"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { Button, Card, Field, TextInput, TextArea } from "./ui";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";
import { saveProject, deleteProject } from "@/lib/admin/db";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProjectEditor({ initial }: { initial?: Project | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [url, setUrl] = useState(initial?.url ?? "");
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl ?? "");
  const [order, setOrder] = useState(String(initial?.order ?? 1));
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [image, setImage] = useState<string | undefined>(initial?.image);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  async function handleSave() {
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setBusy(true);
    try {
      await saveProject({
        id: initial?.id,
        slug: slug || slugify(title),
        title: title.trim(),
        description,
        content,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        url: url || undefined,
        repoUrl: repoUrl || undefined,
        image,
        order: Number(order) || 0,
        featured,
      });
      router.push("/admin/projects");
      router.refresh();
    } catch {
      setError("Could not save. Check your connection and Firestore rules.");
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!window.confirm("Delete this project?")) return;
    setBusy(true);
    try {
      await deleteProject(initial.id);
      router.push("/admin/projects");
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
          <Link href="/admin/projects" className="text-sm text-muted transition-colors hover:text-accent">
            ← Projects
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {isEdit ? "Edit project" : "New project"}
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

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className="w-full bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted/50"
          />

          <Field label="Description" hint="Short meta description shown on the project card.">
            <TextArea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One-line summary…"
            />
          </Field>

          <div>
            <span className="mb-1.5 block text-sm font-medium">Details</span>
            <RichTextEditor
              value={initial?.content}
              onChange={setContent}
              uploadFolder="projects"
              onError={setError}
              placeholder="What it does, what it solves, screenshots…"
            />
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Cover image</h2>
            <ImageUpload value={image} onChange={setImage} folder="projects" label="image" />
          </Card>

          <Card className="space-y-4">
            <Field label="Slug" hint="Used in the project URL.">
              <TextInput
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="server-monitor"
              />
            </Field>
            <Field label="Live URL" hint="Optional.">
              <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
            </Field>
            <Field label="Repo URL" hint="Optional.">
              <TextInput value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/…" />
            </Field>
            <Field label="Tags" hint="Comma separated.">
              <TextInput value={tags} onChange={(e) => setTags(e.target.value)} placeholder="go, cli" />
            </Field>
            <Field label="Order" hint="Lower shows first.">
              <TextInput type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
            </Field>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm">Feature on homepage</span>
            </label>
          </Card>
        </aside>
      </div>
    </div>
  );
}
