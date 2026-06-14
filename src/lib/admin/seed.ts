import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/client";
import { saveAbout, saveContact, saveSettings, saveSocialLinks } from "./db";
import type { Post, Project, Skill, SocialLink } from "../types";

/**
 * One-time sample content so a fresh database isn't empty. Collections are only
 * seeded when empty (so clicking twice won't create duplicates); singletons are
 * (over)written.
 */

const posts: Omit<Post, "id">[] = [
  {
    slug: "running-ai-agents-with-systemd",
    title: "Running AI agents as systemd services",
    excerpt:
      "How I keep long-running local AI agents alive across reboots with a small set of systemd unit files.",
    content:
      "<p>I have a handful of small AI agents that run on my home server.</p><h2>Why systemd</h2><p>Restart-on-failure, logging, and ordering for free.</p>",
    tags: ["ai", "self-hosting", "linux"],
    date: "2026-05-28",
    readingTime: 4,
    published: true,
    featured: true,
  },
  {
    slug: "minimal-self-hosting-stack",
    title: "My minimal self-hosting stack in 2026",
    excerpt:
      "The short list of services I actually run, why I keep it small, and what I dropped this year.",
    content:
      "<p>Every year my self-hosting setup gets smaller, not bigger.</p><h2>The keepers</h2><ul><li>Caddy</li><li>Postgres</li><li>A media server</li></ul>",
    tags: ["self-hosting", "devops"],
    date: "2026-04-12",
    readingTime: 6,
    published: true,
    featured: true,
  },
];

const projects: Omit<Project, "id">[] = [
  {
    slug: "yams",
    title: "YAMS",
    description:
      "Yet Another Media Server — a one-command setup for a self-hosted media stack.",
    content:
      "<h2>What it solves</h2><p>Setting up a media server usually means wiring together half a dozen containers by hand. YAMS does it in one command.</p><h2>How it works</h2><p>A single script provisions the stack behind a reverse proxy with sensible defaults.</p>",
    tags: ["docker", "self-hosting", "bash"],
    repoUrl: "https://github.com/example/yams",
    url: "https://yams.media",
    order: 1,
    featured: true,
  },
  {
    slug: "forgellm",
    title: "ForgeLLM",
    description:
      "An editor plugin that runs AI-powered code reviews against your local changes.",
    content:
      "<h2>What it solves</h2><p>Catches bugs and smells before they reach a pull request, right inside your editor.</p>",
    tags: ["ai", "tooling"],
    repoUrl: "https://github.com/example/forgellm",
    order: 2,
    featured: true,
  },
];

const skills: Omit<Skill, "id">[] = [
  { name: "TypeScript", summary: "My default for anything that ships.", order: 1 },
  { name: "Next.js", summary: "React framework I build sites with.", order: 2 },
  { name: "Firebase", summary: "Auth, Firestore, and Storage for small apps.", order: 3 },
  { name: "Linux", summary: "Where all my self-hosting happens.", order: 4 },
];

const social: SocialLink[] = [
  { id: "1", platform: "github", label: "GitHub", url: "https://github.com/", order: 1 },
  { id: "2", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/", order: 2 },
  { id: "3", platform: "email", label: "Email", url: "mailto:hello@example.com", order: 3 },
];

async function isEmpty(name: string) {
  const snap = await getDocs(collection(db, name));
  return snap.empty;
}

export async function seedSampleData() {
  if (await isEmpty("posts")) {
    await Promise.all(posts.map((p) => addDoc(collection(db, "posts"), p)));
  }
  if (await isEmpty("projects")) {
    await Promise.all(projects.map((p) => addDoc(collection(db, "projects"), p)));
  }
  if (await isEmpty("skills")) {
    await Promise.all(skills.map((s) => addDoc(collection(db, "skills"), s)));
  }

  await Promise.all([
    saveSocialLinks(social),
    saveSettings({
      name: "Shubham Gupta",
      tagline: "Developer & Writer",
      description:
        "Personal blog and project log — notes on software, self-hosting, and building things.",
    }),
    saveAbout({
      heading: "Hi, I'm Shubham.",
      location: "India",
      body: "<p>I'm a developer who likes building small, durable things and writing about how they work.</p><p>This site is my corner of the internet — notes on software and self-hosting experiments.</p>",
    }),
    saveContact({
      heading: "Contact",
      body: "The best ways to reach me. I read everything, eventually.",
    }),
  ]);
}
