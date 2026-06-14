"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/types";
import { Button, Card, Field, TextInput, TextArea } from "./ui";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";
import { savePost, deletePost } from "@/lib/admin/db";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function estimateReadingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const today = () => new Date().toISOString().slice(0, 10);

export function PostEditor({ initial }: { initial?: Post | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [date, setDate] = useState(initial?.date ?? today());
  const [published, setPublished] = useState(initial?.published ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [coverImage, setCoverImage] = useState<string | undefined>(initial?.coverImage);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  async function handleSave(publishNow?: boolean) {
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const willPublish = publishNow ?? published;
    setBusy(true);
    try {
      await savePost({
        id: initial?.id,
        title: title.trim(),
        slug: slug || slugify(title),
        excerpt,
        content,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        date,
        readingTime: estimateReadingTime(content),
        published: willPublish,
        featured,
        coverImage,
      });
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("Could not save. Check your connection and Firestore rules.");
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!window.confirm("Delete this post?")) return;
    setBusy(true);
    try {
      await deletePost(initial.id);
      router.push("/admin/posts");
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
          <Link href="/admin/posts" className="text-sm text-muted transition-colors hover:text-accent">
            ← Posts
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {isEdit ? "Edit post" : "New post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <Button variant="danger" onClick={handleDelete} disabled={busy}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={() => handleSave(false)} disabled={busy}>
            Save draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={busy}>
            {busy ? "Saving…" : "Publish"}
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
            placeholder="Post title"
            className="w-full bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted/50"
          />

          <Field label="Excerpt" hint="Short meta description shown on cards & listings.">
            <TextArea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary…"
            />
          </Field>

          <div>
            <span className="mb-1.5 block text-sm font-medium">Content</span>
            <RichTextEditor
              value={initial?.content}
              onChange={setContent}
              uploadFolder="posts"
              onError={setError}
              placeholder="Write your post… (the image button uploads to Cloudinary)"
            />
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Publish</h2>
            <Toggle label="Published" checked={published} onChange={setPublished} />
            <Toggle label="Featured on home" checked={featured} onChange={setFeatured} />
            <Field label="Date">
              <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </Card>

          <Card className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Cover image</h2>
            <ImageUpload value={coverImage} onChange={setCoverImage} folder="posts" label="cover" />
          </Card>

          <Card className="space-y-4">
            <Field label="Slug" hint="Used in the post URL.">
              <TextInput
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="my-post"
              />
            </Field>
            <Field label="Tags" hint="Comma separated.">
              <TextInput value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ai, self-hosting" />
            </Field>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </label>
  );
}
