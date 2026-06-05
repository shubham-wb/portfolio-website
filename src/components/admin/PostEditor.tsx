"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { Button, Card, Field, TextInput, TextArea } from "./ui";
import {
  BoldIcon,
  ItalicIcon,
  CodeIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  ImageIcon,
} from "@/components/icons";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * NOTE: The content area below is a lightweight contentEditable placeholder so
 * the editor layout and toolbar are real. In the Firebase pass this whole
 * <Editor /> block gets swapped for a TipTap instance — the surrounding form,
 * state, and save payload stay the same.
 */
export function PostEditor({ initial }: { initial?: Post | null }) {
  const isEdit = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [published, setPublished] = useState(initial?.published ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  // Seed the editable region once on mount.
  useEffect(() => {
    if (editorRef.current && initial?.content) {
      editorRef.current.innerHTML = initial.content;
    }
  }, [initial]);

  // Keep slug in sync with the title until the user edits it manually.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  function exec(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }

  function format(block: string) {
    exec("formatBlock", block);
  }

  function addLink() {
    const url = window.prompt("Link URL");
    if (url) exec("createLink", url);
  }

  function addImage() {
    const url = window.prompt("Image URL");
    if (url) exec("insertImage", url);
  }

  function handleSave() {
    const payload = {
      title,
      slug,
      excerpt,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      content: editorRef.current?.innerHTML ?? "",
      published,
      featured,
    };
    // Firebase write goes here in the next pass.
    // eslint-disable-next-line no-console
    console.log("Save post (mock):", payload);
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/posts"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            ← Posts
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {isEdit ? "Edit post" : "New post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && (
            <span className="text-xs text-muted">Saved {savedAt} (mock)</span>
          )}
          <Button variant="secondary">Save draft</Button>
          <Button onClick={handleSave}>{published ? "Publish" : "Save"}</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main column */}
        <div className="space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted/50"
          />

          <Field label="Excerpt" hint="A one-line summary shown in listings.">
            <TextArea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary…"
            />
          </Field>

          <div>
            <span className="mb-1.5 block text-sm font-medium">Content</span>
            <div className="overflow-hidden rounded-lg border border-border">
              <Toolbar
                onBold={() => exec("bold")}
                onItalic={() => exec("italic")}
                onH2={() => format("h2")}
                onH3={() => format("h3")}
                onParagraph={() => format("p")}
                onUl={() => exec("insertUnorderedList")}
                onOl={() => exec("insertOrderedList")}
                onQuote={() => format("blockquote")}
                onCode={() => format("pre")}
                onLink={addLink}
                onImage={addImage}
              />
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Start writing…"
                className="prose min-h-[320px] max-w-none px-4 py-4 outline-none empty:before:text-muted/50 empty:before:content-[attr(data-placeholder)]"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted">
              Placeholder editor — will be replaced by TipTap when Firebase is
              wired up. Output is stored as HTML.
            </p>
          </div>
        </div>

        {/* Settings sidebar */}
        <aside className="space-y-4">
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Publish
            </h2>
            <Toggle
              label="Published"
              checked={published}
              onChange={setPublished}
            />
            <Toggle
              label="Featured on home"
              checked={featured}
              onChange={setFeatured}
            />
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
              <TextInput
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ai, self-hosting"
              />
            </Field>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Toolbar(props: {
  onBold: () => void;
  onItalic: () => void;
  onH2: () => void;
  onH3: () => void;
  onParagraph: () => void;
  onUl: () => void;
  onOl: () => void;
  onQuote: () => void;
  onCode: () => void;
  onLink: () => void;
  onImage: () => void;
}) {
  const btn =
    "grid h-8 min-w-8 place-items-center rounded px-1.5 text-muted transition-colors hover:bg-card-hover hover:text-foreground";
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-card px-2 py-1.5">
      <button type="button" onClick={props.onBold} className={btn} title="Bold">
        <BoldIcon className="h-4 w-4" />
      </button>
      <button type="button" onClick={props.onItalic} className={btn} title="Italic">
        <ItalicIcon className="h-4 w-4" />
      </button>
      <Divider />
      <button type="button" onClick={props.onH2} className={`${btn} text-sm font-semibold`} title="Heading 2">
        H2
      </button>
      <button type="button" onClick={props.onH3} className={`${btn} text-sm font-semibold`} title="Heading 3">
        H3
      </button>
      <button type="button" onClick={props.onParagraph} className={`${btn} text-sm`} title="Paragraph">
        P
      </button>
      <Divider />
      <button type="button" onClick={props.onUl} className={btn} title="Bullet list">
        <ListIcon className="h-4 w-4" />
      </button>
      <button type="button" onClick={props.onOl} className={btn} title="Numbered list">
        <ListOrderedIcon className="h-4 w-4" />
      </button>
      <button type="button" onClick={props.onQuote} className={btn} title="Quote">
        <QuoteIcon className="h-4 w-4" />
      </button>
      <button type="button" onClick={props.onCode} className={btn} title="Code block">
        <CodeIcon className="h-4 w-4" />
      </button>
      <Divider />
      <button type="button" onClick={props.onLink} className={btn} title="Link">
        <LinkIcon className="h-4 w-4" />
      </button>
      <button type="button" onClick={props.onImage} className={btn} title="Image">
        <ImageIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" aria-hidden />;
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
