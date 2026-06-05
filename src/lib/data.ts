import type { About, Post, Project, SiteSettings, SocialLink } from "./types";

/**
 * Local mock data layer.
 *
 * Every accessor is async on purpose: the public surface matches what the
 * Firebase implementation will look like, so when we wire up Firestore we only
 * replace the bodies of these functions — pages and components stay untouched.
 */

const posts: Post[] = [
  {
    id: "1",
    slug: "running-ai-agents-with-systemd",
    title: "Running AI agents as systemd services",
    excerpt:
      "How I keep long-running local AI agents alive across reboots with a small set of systemd unit files.",
    content: `
      <p>I have a handful of small AI agents that run on my home server. They watch folders, summarize things, and poke APIs on a schedule. The problem with running them in a <code>tmux</code> session is obvious: one reboot and they're gone.</p>
      <h2>Why systemd</h2>
      <p>systemd gives us restart-on-failure, logging via <code>journalctl</code>, and dependency ordering for free. No extra process manager required.</p>
      <pre><code>[Unit]
Description=Summary agent
After=network-online.target

[Service]
ExecStart=/usr/bin/python3 /opt/agents/summary.py
Restart=on-failure
User=agents

[Install]
WantedBy=multi-user.target</code></pre>
      <p>Drop that in <code>/etc/systemd/system/</code>, run <code>systemctl enable --now summary-agent</code>, and you're done.</p>
      <blockquote>Keep each agent in its own unit file. It makes restarts and logs trivial to reason about.</blockquote>
    `,
    tags: ["ai", "self-hosting", "linux"],
    date: "2026-05-28",
    readingTime: 4,
    published: true,
    featured: true,
  },
  {
    id: "2",
    slug: "minimal-self-hosting-stack",
    title: "My minimal self-hosting stack in 2026",
    excerpt:
      "The short list of services I actually run, why I keep it small, and what I dropped this year.",
    content: `
      <p>Every year my self-hosting setup gets smaller, not bigger. Here's what survived the cut.</p>
      <h2>The keepers</h2>
      <ul>
        <li><strong>Caddy</strong> — reverse proxy and automatic TLS.</li>
        <li><strong>Postgres</strong> — one database to rule them all.</li>
        <li><strong>A media server</strong> — the one thing the whole household uses.</li>
      </ul>
      <p>Everything else is a single binary behind Caddy. If it needs more than that, I ask whether I really need it.</p>
    `,
    tags: ["self-hosting", "devops"],
    date: "2026-04-12",
    readingTime: 6,
    published: true,
    featured: true,
  },
  {
    id: "3",
    slug: "writing-with-tiptap",
    title: "Building a writing experience with TipTap",
    excerpt:
      "Notes on wiring up a clean, distraction-free editor for my own blog admin panel.",
    content: `
      <p>I wanted my own editor — no Markdown gymnastics, just type and it looks right. TipTap turned out to be the perfect base.</p>
      <h2>What I needed</h2>
      <p>Headings, lists, code blocks, links, and images. That's it. TipTap's extension model means I only ship what I use.</p>
      <p>The output is plain HTML, which I store directly and render with a single prose stylesheet.</p>
    `,
    tags: ["web", "react", "writing"],
    date: "2026-03-02",
    readingTime: 5,
    published: true,
  },
  {
    id: "4",
    slug: "owning-your-data",
    title: "On owning your own data",
    excerpt:
      "A short argument for keeping your writing and projects on infrastructure you control.",
    content: `
      <p>Platforms come and go. Your archive shouldn't go with them.</p>
      <p>This site is the simplest version of that idea: my words, my database, my domain. If a service disappears tomorrow, nothing of mine disappears with it.</p>
    `,
    tags: ["meta", "indieweb"],
    date: "2026-01-19",
    readingTime: 3,
    published: true,
  },
];

const projects: Project[] = [
  {
    id: "1",
    title: "YAMS",
    description:
      "Yet Another Media Server — a one-command setup for a self-hosted media stack.",
    tags: ["docker", "self-hosting", "bash"],
    repoUrl: "https://github.com/example/yams",
    url: "https://yams.media",
    order: 1,
    featured: true,
  },
  {
    id: "2",
    title: "ForgeLLM",
    description:
      "An editor plugin that runs AI-powered code reviews against your local changes.",
    tags: ["ai", "emacs", "tooling"],
    repoUrl: "https://github.com/example/forgellm",
    order: 2,
    featured: true,
  },
  {
    id: "3",
    title: "subscleaner",
    description:
      "Strips ads and junk lines out of downloaded subtitle files automatically.",
    tags: ["python", "cli"],
    repoUrl: "https://github.com/example/subscleaner",
    order: 3,
  },
  {
    id: "4",
    title: "calsync",
    description:
      "Two-way calendar sync between a self-hosted CalDAV server and the usual suspects.",
    tags: ["go", "self-hosting"],
    repoUrl: "https://github.com/example/calsync",
    order: 4,
  },
];

const socialLinks: SocialLink[] = [
  { id: "1", platform: "github", label: "GitHub", url: "https://github.com/", order: 1 },
  { id: "2", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/", order: 2 },
  { id: "3", platform: "twitter", label: "Twitter", url: "https://twitter.com/", order: 3 },
  { id: "4", platform: "email", label: "Email", url: "mailto:hello@example.com", order: 4 },
  { id: "5", platform: "rss", label: "RSS", url: "/rss.xml", order: 5 },
];

const about: About = {
  heading: "Hi, I'm Shubham.",
  location: "India",
  body: `
    <p>I'm a developer who likes building small, durable things and writing about how they work. Most of what I make is open source and runs on infrastructure I control.</p>
    <p>This site is my corner of the internet: a place for notes on software, self-hosting experiments, and the occasional opinion. Everything here is written and managed by hand — no algorithm deciding what you see.</p>
    <p>When I'm not at a keyboard you'll find me reading, walking, or quietly resisting the urge to refactor things that already work.</p>
  `,
};

const settings: SiteSettings = {
  name: "Shubham Gupta",
  tagline: "Developer & Writer",
  description:
    "Personal blog and project log — notes on software, self-hosting, and building things.",
};

// Simulate async I/O so the contract matches the future Firebase layer.
const ok = <T>(value: T): Promise<T> => Promise.resolve(value);

export async function getPosts(): Promise<Post[]> {
  return ok(
    [...posts]
      .filter((p) => p.published)
      .sort((a, b) => b.date.localeCompare(a.date)),
  );
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const all = await getPosts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getPost(slug: string): Promise<Post | null> {
  return ok(posts.find((p) => p.slug === slug && p.published) ?? null);
}

export async function getAllTags(): Promise<string[]> {
  const all = await getPosts();
  return Array.from(new Set(all.flatMap((p) => p.tags))).sort();
}

export async function getProjects(): Promise<Project[]> {
  return ok([...projects].sort((a, b) => a.order - b.order));
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return ok([...socialLinks].sort((a, b) => a.order - b.order));
}

export async function getAbout(): Promise<About> {
  return ok(about);
}

export async function getSettings(): Promise<SiteSettings> {
  return ok(settings);
}
