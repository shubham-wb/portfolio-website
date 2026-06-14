// Shared domain types for the blog. These mirror the documents we will later
// store in Firestore, so the UI never has to change when we swap the data
// source from the local mock layer to Firebase.

export interface Post {
  id: string;
  slug: string;
  title: string;
  /** Short summary shown in listings. */
  excerpt: string;
  /** Full HTML body (produced by the TipTap editor in the admin panel). */
  content: string;
  tags: string[];
  /** ISO date string, e.g. "2026-05-21". */
  date: string;
  /** Estimated reading time in minutes. */
  readingTime: number;
  /** Whether the post is publicly visible. */
  published: boolean;
  /** Pin to the homepage "featured" area. */
  featured?: boolean;
  coverImage?: string;
}

export interface Project {
  id: string;
  /** URL slug for the project detail page. */
  slug: string;
  title: string;
  /** Short meta description shown on the project card. */
  description: string;
  /** Full HTML body for the detail page (what it solves, screenshots, etc.). */
  content?: string;
  /** Tech / topic tags. */
  tags: string[];
  /** Primary link (repo or live site). */
  url?: string;
  repoUrl?: string;
  /** Cover/preview image URL (uploaded to Cloudinary). */
  image?: string;
  /** Ordering weight (lower shows first). */
  order: number;
  featured?: boolean;
}

export type SocialPlatform =
  | "github"
  | "gitlab"
  | "twitter"
  | "mastodon"
  | "linkedin"
  | "email"
  | "rss"
  | "website";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  /** Logo image URL (uploaded to Firebase Storage). */
  logo?: string;
  /** Short one-liner about the skill / proficiency. */
  summary: string;
  order: number;
}

export interface About {
  /** Headline shown on the about page. */
  heading: string;
  /** Rich HTML bio body. */
  body: string;
  location?: string;
  avatar?: string;
}

export interface Contact {
  heading: string;
  /** Intro blurb shown above the contact links. */
  body: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  /** Résumé file URL (uploaded to Firebase Storage). */
  resumeUrl?: string;
}
