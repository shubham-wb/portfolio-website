// Static site config. The dynamic equivalents (name, tagline, description) will
// eventually be editable from the admin panel and stored in Firestore, but we
// keep a static fallback here for metadata and build-time use.

export const siteConfig = {
  name: "Shubham Gupta",
  tagline: "Developer & Writer",
  description:
    "Personal blog and project log — notes on software, self-hosting, and building things.",
  // Used for absolute URLs (RSS, Open Graph) once deployed.
  url: "https://shubham.dev",
};

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "home", href: "/" },
  { label: "posts", href: "/posts" },
  { label: "projects", href: "/projects" },
  { label: "about", href: "/about" },
  { label: "contact", href: "/contact" },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Posts", href: "/admin/posts" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Settings", href: "/admin/settings" },
];
