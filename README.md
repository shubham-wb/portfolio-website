# Personal blog

A minimalist personal blog + project log, inspired by the Hugo **Archie** theme
but built on **Next.js 16 + Tailwind CSS v4**. All content is designed to be
managed from a built-in admin panel and stored in **Firebase** (wiring up next).

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** (CSS-based config, class-based dark mode)
- **Firebase** — Firestore (content), Auth (admin), Storage (images) — _planned_
- **TipTap** — rich-text editor in the admin panel — _planned_

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Project structure

```
src/
├── app/
│   ├── (site)/              # Public site (shares Header + Footer)
│   │   ├── page.tsx         # Home
│   │   ├── posts/           # Post list + [slug] detail
│   │   ├── projects/        # Projects
│   │   ├── about/           # About
│   │   └── contact/         # Contact
│   ├── admin/
│   │   ├── (panel)/         # Admin shell (sidebar): dashboard, posts, projects, settings
│   │   └── login/           # Standalone login (no sidebar)
│   ├── layout.tsx           # Root layout + no-flash theme script
│   └── globals.css          # Design tokens + prose styles
├── components/
│   ├── Header, Footer, ThemeToggle, PostListItem, ProjectCard, Tag, icons
│   └── admin/               # AdminSidebar, PostEditor, ProjectEditor, SettingsForm, ui
└── lib/
    ├── types.ts             # Domain models (mirror future Firestore docs)
    ├── data.ts              # Async accessors over mock data (swap for Firebase)
    ├── site.ts              # Static config + nav
    └── format.ts            # Date helpers
```

## Theming

Light/dark themes are driven by CSS variables in [`globals.css`](src/app/globals.css).
The toggle adds/removes a `.dark` class on `<html>`; an inline script in the root
layout applies the stored/system preference before paint to avoid a flash.

## What's mocked (the next pass replaces these)

The data layer in [`lib/data.ts`](src/lib/data.ts) returns mock content from
**async** functions whose signatures match the future Firebase layer — so pages
and components won't change when we connect Firestore. Specifically next:

1. **Firebase**: add `lib/firebase.ts`, env config, and replace the bodies of
   `getPosts`, `getProjects`, `getAbout`, `getSettings`, `getSocialLinks`.
2. **Auth**: real sign-in in [`admin/login`](src/app/admin/login/page.tsx) +
   middleware/guard on `/admin`.
3. **TipTap**: replace the placeholder contentEditable in
   [`PostEditor`](src/components/admin/PostEditor.tsx) with a TipTap instance
   (output is already stored as HTML).
4. **Writes**: the `handleSave` handlers in the admin editors currently
   `console.log` their payload — point them at Firestore.
