import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import { db } from "./firebase/client";
import type {
  About,
  Contact,
  Post,
  Project,
  SiteSettings,
  Skill,
  SocialLink,
} from "./types";
import { siteConfig } from "./site";

/**
 * Read layer. Every accessor reads from Firestore but is wrapped so a missing
 * collection, empty database, or blocked read during setup degrades to a sane
 * fallback instead of crashing the page. Signatures are unchanged from the
 * earlier mock layer, so pages and components did not need to change.
 */

function rows<T>(snap: QuerySnapshot<DocumentData>): T[] {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[data] read failed:", err);
    return fallback;
  }
}

// ---------- Posts ----------

export async function getPosts(): Promise<Post[]> {
  return safe(async () => {
    const snap = await getDocs(collection(db, "posts"));
    return rows<Post>(snap)
      .filter((p) => p.published)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, []);
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const all = await getPosts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getPost(slug: string): Promise<Post | null> {
  return safe(async () => {
    const snap = await getDocs(
      query(collection(db, "posts"), where("slug", "==", slug)),
    );
    const post = rows<Post>(snap).find((p) => p.published);
    return post ?? null;
  }, null);
}

export async function getAllTags(): Promise<string[]> {
  const all = await getPosts();
  return Array.from(new Set(all.flatMap((p) => p.tags ?? []))).sort();
}

// ---------- Projects ----------

export async function getProjects(): Promise<Project[]> {
  return safe(async () => {
    const snap = await getDocs(collection(db, "projects"));
    return rows<Project>(snap).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, []);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProject(slug: string): Promise<Project | null> {
  return safe(async () => {
    const snap = await getDocs(
      query(collection(db, "projects"), where("slug", "==", slug)),
    );
    return rows<Project>(snap)[0] ?? null;
  }, null);
}

// ---------- Skills ----------

export async function getSkills(): Promise<Skill[]> {
  return safe(async () => {
    const snap = await getDocs(collection(db, "skills"));
    return rows<Skill>(snap).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, []);
}

// ---------- Social links ----------

export async function getSocialLinks(): Promise<SocialLink[]> {
  return safe(async () => {
    const snap = await getDoc(doc(db, "site", "social"));
    const links = (snap.data()?.links ?? []) as SocialLink[];
    return [...links].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, []);
}

// ---------- Singletons (site/{about,contact,settings}) ----------

export async function getAbout(): Promise<About> {
  return safe(
    async () => {
      const snap = await getDoc(doc(db, "site", "about"));
      return snap.exists()
        ? (snap.data() as About)
        : { heading: "", body: "" };
    },
    { heading: "", body: "" },
  );
}

export async function getContact(): Promise<Contact> {
  const fallback: Contact = {
    heading: "Contact",
    body: "The best ways to reach me.",
  };
  return safe(async () => {
    const snap = await getDoc(doc(db, "site", "contact"));
    return snap.exists() ? (snap.data() as Contact) : fallback;
  }, fallback);
}

export async function getSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
  };
  return safe(async () => {
    const snap = await getDoc(doc(db, "site", "settings"));
    return snap.exists()
      ? ({ ...fallback, ...(snap.data() as SiteSettings) })
      : fallback;
  }, fallback);
}
