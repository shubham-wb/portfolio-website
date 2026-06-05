"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { Button, Card, Field, TextInput, TextArea } from "./ui";

export function ProjectEditor({ initial }: { initial?: Project | null }) {
  const isEdit = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [url, setUrl] = useState(initial?.url ?? "");
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl ?? "");
  const [order, setOrder] = useState(String(initial?.order ?? 1));
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function handleSave() {
    const payload = {
      title,
      description,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      url: url || undefined,
      repoUrl: repoUrl || undefined,
      order: Number(order) || 0,
      featured,
    };
    // Firebase write goes here in the next pass.
    // eslint-disable-next-line no-console
    console.log("Save project (mock):", payload);
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/projects"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            ← Projects
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {isEdit ? "Edit project" : "New project"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && (
            <span className="text-xs text-muted">Saved {savedAt} (mock)</span>
          )}
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>

      <Card className="space-y-5">
        <Field label="Title">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project name"
          />
        </Field>
        <Field label="Description">
          <TextArea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is it?"
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Live URL" hint="Optional.">
            <TextInput
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <Field label="Repo URL" hint="Optional.">
            <TextInput
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/…"
            />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Tags" hint="Comma separated.">
            <TextInput
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="go, cli"
            />
          </Field>
          <Field label="Order" hint="Lower shows first.">
            <TextInput
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </Field>
        </div>
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
    </div>
  );
}
