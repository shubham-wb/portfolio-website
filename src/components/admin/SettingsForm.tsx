"use client";

import { useState } from "react";
import type {
  About,
  Contact,
  SiteSettings,
  SocialLink,
  SocialPlatform,
} from "@/lib/types";
import { Button, Card, Field, TextInput, TextArea } from "./ui";
import { RichTextEditor } from "./RichTextEditor";
import { SocialIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { uploadFile } from "@/lib/upload";
import {
  saveAbout,
  saveContact,
  saveSettings,
  saveSocialLinks,
} from "@/lib/admin/db";

const PLATFORMS: SocialPlatform[] = [
  "github",
  "gitlab",
  "twitter",
  "mastodon",
  "linkedin",
  "email",
  "rss",
  "website",
];

export function SettingsForm({
  settings,
  about,
  contact,
  socials,
}: {
  settings: SiteSettings;
  about: About;
  contact: Contact;
  socials: SocialLink[];
}) {
  const [site, setSite] = useState(settings);
  const [aboutState, setAboutState] = useState(about);
  const [contactState, setContactState] = useState(contact);
  const [links, setLinks] = useState(socials);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  function updateLink(id: string, patch: Partial<SocialLink>) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function addLink() {
    setLinks((prev) => [
      ...prev,
      {
        id: `tmp-${Date.now()}`,
        platform: "website",
        label: "",
        url: "",
        order: prev.length + 1,
      },
    ]);
  }
  function removeLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  async function handleResume(file: File) {
    setUploadingResume(true);
    setError(null);
    try {
      const url = await uploadFile(`resume/${Date.now()}-${file.name}`, file);
      setSite((s) => ({ ...s, resumeUrl: url }));
    } catch {
      setError("Résumé upload failed.");
    } finally {
      setUploadingResume(false);
    }
  }

  async function handleSave() {
    setBusy(true);
    setError(null);
    try {
      await Promise.all([
        saveSettings(site),
        saveAbout(aboutState),
        saveContact(contactState),
        saveSocialLinks(links.map((l, i) => ({ ...l, order: i + 1 }))),
      ]);
      setSavedAt(new Date().toLocaleTimeString());
    } catch {
      setError("Could not save. Check your connection and Firestore rules.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted">
            Site identity, résumé, about, contact, and social links.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && <span className="text-xs text-muted">Saved {savedAt}</span>}
          <Button onClick={handleSave} disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="space-y-6">
        {/* Site identity */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Site identity
          </h2>
          <Field label="Name">
            <TextInput value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <TextInput value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} />
          </Field>
          <Field label="Description" hint="Shown on the homepage and in metadata.">
            <TextArea
              rows={2}
              value={site.description}
              onChange={(e) => setSite({ ...site, description: e.target.value })}
            />
          </Field>
        </Card>

        {/* Résumé */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Résumé
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-card-hover">
              {uploadingResume ? "Uploading…" : "Upload PDF"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleResume(f);
                }}
              />
            </label>
            {site.resumeUrl ? (
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent underline"
              >
                Current résumé ↗
              </a>
            ) : (
              <span className="text-sm text-muted">No résumé uploaded yet.</span>
            )}
          </div>
        </Card>

        {/* About */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            About page
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Heading">
              <TextInput
                value={aboutState.heading}
                onChange={(e) => setAboutState({ ...aboutState, heading: e.target.value })}
              />
            </Field>
            <Field label="Location">
              <TextInput
                value={aboutState.location ?? ""}
                onChange={(e) => setAboutState({ ...aboutState, location: e.target.value })}
              />
            </Field>
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium">Body</span>
            <RichTextEditor
              value={about.body}
              onChange={(html) => setAboutState((s) => ({ ...s, body: html }))}
              uploadFolder="about"
              onError={setError}
              placeholder="Tell your story…"
            />
          </div>
        </Card>

        {/* Contact */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Contact page
          </h2>
          <Field label="Heading">
            <TextInput
              value={contactState.heading}
              onChange={(e) => setContactState({ ...contactState, heading: e.target.value })}
            />
          </Field>
          <div>
            <span className="mb-1.5 block text-sm font-medium">Intro</span>
            <RichTextEditor
              value={contact.body}
              onChange={(html) => setContactState((s) => ({ ...s, body: html }))}
              uploadFolder="contact"
              onError={setError}
              placeholder="Shown above the contact links…"
              compact
            />
          </div>
        </Card>

        {/* Social links */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Social links
            </h2>
            <Button variant="secondary" onClick={addLink}>
              <PlusIcon className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-card text-muted">
                  <SocialIcon platform={link.platform} />
                </span>
                <select
                  value={link.platform}
                  onChange={(e) =>
                    updateLink(link.id, { platform: e.target.value as SocialPlatform })
                  }
                  className="rounded-md border border-border bg-background px-2 py-2 text-sm capitalize outline-none focus:border-accent"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <input
                  value={link.label}
                  onChange={(e) => updateLink(link.id, { label: e.target.value })}
                  placeholder="Label"
                  className="w-28 rounded-md border border-border bg-background px-2 py-2 text-sm outline-none focus:border-accent"
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(link.id, { url: e.target.value })}
                  placeholder="https://…"
                  className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-2 text-sm outline-none focus:border-accent"
                />
                <button
                  onClick={() => removeLink(link.id)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                  aria-label="Remove link"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {links.length === 0 && (
              <p className="text-sm text-muted">No links yet — add one above.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
