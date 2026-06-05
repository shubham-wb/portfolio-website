"use client";

import { useState } from "react";
import type { About, SiteSettings, SocialLink, SocialPlatform } from "@/lib/types";
import { Button, Card, Field, TextInput, TextArea } from "./ui";
import { SocialIcon, PlusIcon, TrashIcon } from "@/components/icons";

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
  socials,
}: {
  settings: SiteSettings;
  about: About;
  socials: SocialLink[];
}) {
  const [site, setSite] = useState(settings);
  const [aboutState, setAboutState] = useState(about);
  const [links, setLinks] = useState(socials);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function updateLink(id: string, patch: Partial<SocialLink>) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function addLink() {
    setLinks((prev) => [
      ...prev,
      {
        id: `tmp-${prev.length + 1}`,
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

  function handleSave() {
    // Firebase writes go here in the next pass.
    // eslint-disable-next-line no-console
    console.log("Save settings (mock):", { site, about: aboutState, links });
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted">
            Site identity, about page, and social links.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && (
            <span className="text-xs text-muted">Saved {savedAt} (mock)</span>
          )}
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Site identity */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Site identity
          </h2>
          <Field label="Name">
            <TextInput
              value={site.name}
              onChange={(e) => setSite({ ...site, name: e.target.value })}
            />
          </Field>
          <Field label="Tagline">
            <TextInput
              value={site.tagline}
              onChange={(e) => setSite({ ...site, tagline: e.target.value })}
            />
          </Field>
          <Field label="Description" hint="Shown on the homepage and in metadata.">
            <TextArea
              rows={2}
              value={site.description}
              onChange={(e) =>
                setSite({ ...site, description: e.target.value })
              }
            />
          </Field>
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
                onChange={(e) =>
                  setAboutState({ ...aboutState, heading: e.target.value })
                }
              />
            </Field>
            <Field label="Location">
              <TextInput
                value={aboutState.location ?? ""}
                onChange={(e) =>
                  setAboutState({ ...aboutState, location: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Body" hint="HTML. Will use the TipTap editor later.">
            <TextArea
              rows={6}
              value={aboutState.body}
              onChange={(e) =>
                setAboutState({ ...aboutState, body: e.target.value })
              }
              className="font-mono text-xs"
            />
          </Field>
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
                    updateLink(link.id, {
                      platform: e.target.value as SocialPlatform,
                    })
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
          </div>
        </Card>
      </div>
    </div>
  );
}
