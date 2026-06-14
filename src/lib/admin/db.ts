import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/client";
import type {
  About,
  Contact,
  Post,
  Project,
  SiteSettings,
  Skill,
  SocialLink,
} from "../types";

/**
 * Write layer — used by the admin panel (client side, requires auth).
 * Create vs update is decided by whether an `id` is present.
 */

type WithoutId<T> = Omit<T, "id">;

async function upsert<T extends { id?: string }>(
  collectionName: string,
  data: WithoutId<T> & { id?: string },
): Promise<string> {
  const { id, ...rest } = data;
  if (id) {
    await updateDoc(doc(db, collectionName, id), rest as Record<string, unknown>);
    return id;
  }
  const created = await addDoc(collection(db, collectionName), rest as Record<string, unknown>);
  return created.id;
}

// ---------- Posts ----------
export const savePost = (post: WithoutId<Post> & { id?: string }) =>
  upsert<Post>("posts", post);
export const deletePost = (id: string) => deleteDoc(doc(db, "posts", id));

// ---------- Projects ----------
export const saveProject = (project: WithoutId<Project> & { id?: string }) =>
  upsert<Project>("projects", project);
export const deleteProject = (id: string) => deleteDoc(doc(db, "projects", id));

// ---------- Skills ----------
export const saveSkill = (skill: WithoutId<Skill> & { id?: string }) =>
  upsert<Skill>("skills", skill);
export const deleteSkill = (id: string) => deleteDoc(doc(db, "skills", id));

// ---------- Singletons ----------
export const saveAbout = (about: About) =>
  setDoc(doc(db, "site", "about"), about);

export const saveContact = (contact: Contact) =>
  setDoc(doc(db, "site", "contact"), contact);

export const saveSettings = (settings: Partial<SiteSettings>) =>
  setDoc(doc(db, "site", "settings"), settings, { merge: true });

export const saveSocialLinks = (links: SocialLink[]) =>
  setDoc(doc(db, "site", "social"), { links });
