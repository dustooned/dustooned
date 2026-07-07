# Dustooned.com Master Website Infrastructure Spec for Codex

> Copy this entire document into Codex as the project brief.  
> Goal: build a clean, static-first Astro + MDX portfolio site infrastructure for Dustooned.com.  
> Priority: durable structure, easy asset management, clean navigation, unified visual system, and future handoff to Claude Code.

---

## 0. Project Summary

Build a new independent website for **Dustooned.com** that replaces the current Squarespace-style archive with a simpler, cleaner portfolio system.

The site should be organized around a few main sections:

```txt
Motion
Illustration
Sequential ↗
Interactive
Education ↗
Journal
About
Contact
```

Important behavior:

- **Motion**: thumbnail grid → YouTube lightbox.
- **Illustration**: thumbnail grid → focused project/detail pages.
- **Sequential**: external link to StayToonedGFX.com.
- **Interactive**: thumbnail grid → focused project/detail pages or external/embed pages.
- **Education**: external/future link to an LBCC GitHub/GitHub Pages student-work/final-projects site.
- **Journal**: MDX post system with easy custom insert blocks.
- **About** and **Contact**: simple static pages.

Do **not** attempt to preserve Squarespace backend logic.  
Use the old site only as a content and asset source later.

---

## 1. Recommended Stack

Use:

```txt
Astro
TypeScript
MDX
Astro Content Collections
Global CSS
Static deployment
```

Do not add a backend unless necessary.

Optional future integrations:
- newsletter service
- contact form provider
- image optimization
- simple search/filtering
- analytics
- tag pages

---

## 2. Core Build Philosophy

This should be:

- static-first
- fast
- visually unified
- easy to update manually
- asset-friendly
- mobile-first
- easy to hand off to Claude Code later
- simple enough to maintain without a CMS

The site should work by adding:

1. images into predictable folders
2. one Markdown/MDX file per project/post
3. frontmatter metadata
4. optional gallery/embed content

---

## 3. Primary Site Map

```txt
/
├── /motion
├── /illustration
│   └── /illustration/[slug]
├── Sequential ↗
│   └── https://www.staytoonedgfx.com/
├── /interactive
│   └── /interactive/[slug]
├── Education ↗
│   └── configurable GitHub/GitHub Pages URL
├── /journal
│   └── /journal/[slug]
├── /about
└── /contact
```

Sequential and Education are **external top-navigation links**, not content collections.

---

## 4. Navigation Requirements

### 4.1 Main Navigation Labels

```txt
Motion
Illustration
Sequential ↗
Interactive
Education ↗
Journal
About
Contact
```

### 4.2 External URLs

Create a central config file:

```ts
// src/config/site.ts

export const SITE = {
  title: "Dustooned",
  description: "Motion, illustration, interactive experiments, journal notes, and teaching work by Dustin / T'.",
  url: "https://www.dustooned.com"
};

export const EXTERNAL_LINKS = {
  sequential: "https://www.staytoonedgfx.com/",
  education: "https://github.com/dustooned/lbcc-student-work"
};
```

Future likely Education URLs:

```txt
https://dustooned.github.io/lbcc-student-work/
https://github.com/dustooned/lbcc-student-work
```

Use the placeholder GitHub repo URL for now:

```txt
https://github.com/dustooned/lbcc-student-work
```

### 4.3 Nav Item Data

```ts
const navItems = [
  { label: "Motion", href: "/motion" },
  { label: "Illustration", href: "/illustration" },
  { label: "Sequential", href: EXTERNAL_LINKS.sequential, external: true },
  { label: "Interactive", href: "/interactive" },
  { label: "Education", href: EXTERNAL_LINKS.education, external: true, future: true },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];
```

External links must use:

```html
target="_blank" rel="noopener noreferrer"
```

---

## 5. Header / Navigation Design

### 5.1 Desktop Header

Desktop layout:

```txt
┌──────────────────────────────────────────────────────────────┐
│ LOGO                    Motion Illustration Sequential ↗ ... │
└──────────────────────────────────────────────────────────────┘
```

Requirements:

- sticky header
- logo left
- nav links right
- horizontal nav
- no dropdowns for initial build
- active page state
- visible external-link indicator for Sequential and Education
- logo links to home

Desktop logo:
- use SVG by default
- visual height: 40–48px
- header height: 72–80px

### 5.2 Mobile Header

Mobile layout:

```txt
┌─────────────────────────────┐
│        DUSTOONED LOGO    ☰  │
└─────────────────────────────┘
```

Requirements:

- logo visually centered
- menu button on right
- mobile menu opens vertically
- links have minimum 44px tap target
- no tiny cramped links
- menu closes when selecting a link
- ESC closes menu
- accessible `aria-expanded`
- mobile logo can use wordmark or mark

Mobile menu:

```txt
Motion
Illustration
Sequential ↗
Interactive
Education ↗
Journal
About
Contact
```

### 5.3 Header CSS Baseline

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.site-nav {
  min-height: var(--nav-height-desktop);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
}

.site-logo {
  display: inline-flex;
  align-items: center;
  min-width: max-content;
}

.site-logo img,
.site-logo svg {
  height: 44px;
  width: auto;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.4vw, 1.5rem);
}

.nav-links a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

Mobile centering approach:

```css
.mobile-nav {
  position: relative;
  min-height: var(--nav-height-mobile);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.mobile-menu-button {
  position: absolute;
  right: var(--space-4);
  min-width: 44px;
  min-height: 44px;
}
```

---

## 6. Breakpoint System

Use mobile-first CSS.

```css
:root {
  --bp-xs: 360px;
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
}
```

Behavior:

| Viewport | Layout |
|---|---|
| 320–479px | single-column, compact mobile nav |
| 480–767px | single-column with larger cards |
| 768–1023px | two-column grids |
| 1024–1279px | three-column grids |
| 1280px+ | three/four-column grids depending section |
| 1536px+ | max-width container, no endless stretching |

---

## 7. Global Layout System

Use centralized CSS variables.

```css
:root {
  --site-max-width: 1280px;
  --content-max-width: 760px;
  --wide-content-max-width: 1040px;

  --page-padding-mobile: 1rem;
  --page-padding-tablet: 1.5rem;
  --page-padding-desktop: 2rem;

  --section-gap-mobile: 3rem;
  --section-gap-desktop: 5rem;

  --card-gap-mobile: 1rem;
  --card-gap-desktop: 1.5rem;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;

  --nav-height-desktop: 80px;
  --nav-height-mobile: 68px;
}
```

Shell utilities:

```css
.site-shell {
  width: min(100% - 2rem, var(--site-max-width));
  margin-inline: auto;
}

.content-shell {
  width: min(100% - 2rem, var(--content-max-width));
  margin-inline: auto;
}

.wide-shell {
  width: min(100% - 2rem, var(--wide-content-max-width));
  margin-inline: auto;
}
```

---

## 8. Global Style Tokens

Create:

```txt
src/styles/global.css
src/styles/tokens.css
src/styles/layout.css
src/styles/cards.css
src/styles/nav.css
src/styles/lightbox.css
```

It is okay to begin with one `global.css`, then split later.

### 8.1 CSS Tokens

```css
:root {
  /* Color */
  --color-bg: #f8f4ec;
  --color-surface: #ffffff;
  --color-text: #181512;
  --color-muted: #6f665e;
  --color-border: rgba(24, 21, 18, 0.16);
  --color-accent: #e84b2a;
  --color-accent-soft: #ffe1d8;

  /* Typography */
  --font-body: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-heading: var(--font-body);
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;

  /* Type scale */
  --step--1: clamp(0.82rem, 0.80rem + 0.10vw, 0.88rem);
  --step-0: clamp(1rem, 0.96rem + 0.18vw, 1.1rem);
  --step-1: clamp(1.2rem, 1.08rem + 0.55vw, 1.5rem);
  --step-2: clamp(1.44rem, 1.20rem + 1vw, 2rem);
  --step-3: clamp(1.73rem, 1.34rem + 1.7vw, 2.7rem);
  --step-4: clamp(2.07rem, 1.48rem + 2.6vw, 3.6rem);

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;

  /* Radius */
  --radius-card: 18px;
  --radius-media: 14px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-card: 0 8px 24px rgba(0, 0, 0, 0.08);
}
```

Colors are placeholders. Final colors can be changed globally.

---

## 9. Typography Rules

```css
h1 {
  font-size: var(--step-4);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

h2 {
  font-size: var(--step-3);
  line-height: 1;
  letter-spacing: -0.03em;
}

h3 {
  font-size: var(--step-2);
  line-height: 1.1;
}

body {
  font-size: var(--step-0);
  line-height: 1.6;
}

.prose {
  max-width: 68ch;
}
```

Use clamp values so typography translates cleanly to mobile.

---

## 10. Asset Dimension System

### 10.1 Principle

Do **not** design each section with random image sizes.

Use standardized image shapes:

1. Project thumbnails
2. Motion video posters
3. Project hero images
4. Illustration detail images
5. Gallery images
6. Journal thumbnails
7. Logo assets
8. Open Graph images

Use CSS `aspect-ratio` wherever possible.

---

### 10.2 Master Asset Dimensions

| Asset Type | Recommended Export | Aspect Ratio | Use |
|---|---:|---:|---|
| Project thumbnail | 1600 × 1200 | 4:3 | Motion, Illustration, Interactive, featured work |
| Journal thumbnail | 1600 × 1200 | 4:3 | Journal cards |
| Motion video poster | 1920 × 1080 | 16:9 | Lightbox poster/video reference |
| Project hero | 2400 × 1350 | 16:9 | Project page hero |
| Portrait illustration | 1600 × 2000 | 4:5 | Detail/art pages |
| Landscape illustration | 2000 × 1500 | 4:3 | Detail/art pages |
| Square illustration | 1800 × 1800 | 1:1 | Detail/art pages |
| Gallery image | long edge 2000–2400 | flexible | Project galleries |
| Open Graph image | 1200 × 630 | 1.91:1 | Link previews |
| Apple icon | 180 × 180 | 1:1 | App icon |
| Android icon | 192 × 192 / 512 × 512 | 1:1 | App icon |
| Logo wordmark | 640 × 180 artboard | flexible | Header |
| Logo mark | 512 × 512 artboard | 1:1 | Mobile/icon/favicon |

Preferred image format:
- WebP for site assets
- JPG acceptable for photos
- SVG for logo

---

### 10.3 Project Thumbnail CSS

```css
.card__media,
.project-card__media,
.journal-card__media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-media);
  background: var(--color-border);
}

.card__media img,
.project-card__media img,
.journal-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

### 10.4 Hero CSS

```css
.project-hero__image {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
}
```

For vertical artwork, allow frontmatter override:

```yaml
heroAspect: "4:5"
```

or:

```yaml
heroAspect: "auto"
```

---

### 10.5 Artwork Viewing

For focused artwork pages, do not crop the artwork.

```css
.artwork-viewer img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
```

---

### 10.6 Image Compression Targets

| Asset | Target File Size |
|---|---:|
| Project thumbnail | 150–400 KB |
| Journal thumbnail | 150–400 KB |
| Hero image | 300–800 KB |
| Gallery image | 250 KB–1.2 MB |
| OG image | 150–500 KB |
| Logo SVG | under 100 KB |

---

## 11. Asset Folder Structure

```txt
public/
├── images/
│   ├── motion/
│   │   ├── gas-drawls/
│   │   │   ├── thumb.webp
│   │   │   ├── poster.webp
│   │   │   └── gallery/
│   │   └── mr-bundt/
│   ├── illustration/
│   │   ├── masks-cover/
│   │   │   ├── thumb.webp
│   │   │   ├── hero.webp
│   │   │   └── gallery/
│   ├── interactive/
│   │   ├── drumagery/
│   │   │   ├── thumb.webp
│   │   │   ├── hero.webp
│   │   │   └── screenshots/
│   └── journal/
│       ├── painting-leftovers/
│       │   ├── thumb.webp
│       │   └── inline/
├── logos/
│   ├── logo.svg
│   ├── logo-mark.svg
│   └── logo-wordmark.svg
├── og/
│   ├── dustooned-default-og.jpg
│   └── projects/
└── icons/
```

Optional source-only folder not used by production code:

```txt
_assets-source/
├── motion/
├── illustration/
├── interactive/
├── journal/
└── logo/
```

---

## 12. File Naming Rules

Use lowercase kebab-case.

Good:

```txt
gas-drawls-thumb.webp
masks-cover-hero.webp
painting-leftovers-inline-01.webp
```

Avoid:

```txt
IMG_2345.JPG
Final Final 2.png
newimage copy.jpg
```

Pattern:

```txt
{project-slug}-{asset-type}-{number}.{ext}
```

Examples:

```txt
masks-cover-thumb.webp
masks-cover-hero.webp
masks-cover-gallery-01.webp
masks-cover-gallery-02.webp
```

---

## 13. Content Collections

Use Astro Content Collections.

Create:

```txt
src/content/config.ts
src/content/projects/
src/content/journal/
```

### 13.1 Project Collection Schema

One `projects` collection powers:

- Motion
- Illustration
- Interactive

Sequential and Education are external links and should not be in this collection.

```ts
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    section: z.enum(["motion", "illustration", "interactive"]),
    thumbnail: z.string(),
    description: z.string(),
    year: z.string().optional(),
    role: z.string().optional(),
    tags: z.array(z.string()).default([]),
    videoUrl: z.string().url().optional(),
    projectUrl: z.string().url().optional(),
    embedUrl: z.string().url().optional(),
    gallery: z.array(z.string()).default([]),
    hero: z.string().optional(),
    heroAspect: z.enum(["16:9", "4:3", "4:5", "1:1", "auto"]).optional(),
    featured: z.boolean().default(false),
    order: z.number().optional()
  })
});

const journal = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    thumbnail: z.string().optional(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false)
  })
});

export const collections = {
  projects,
  journal
};
```

---

## 14. Content File Examples

### 14.1 Motion Project

```md
---
title: "GAS DRAWLS"
section: "motion"
thumbnail: "/images/motion/gas-drawls/thumb.webp"
description: "Animated short / motion experiment."
year: "2024"
role: "Animation, direction, design"
tags:
  - animation
  - motion
videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID"
featured: true
order: 1
---
```

Motion projects can be metadata-only if the lightbox contains the YouTube video and description.

---

### 14.2 Illustration Project

```md
---
title: "Masks Cover"
section: "illustration"
thumbnail: "/images/illustration/masks-cover/thumb.webp"
hero: "/images/illustration/masks-cover/hero.webp"
description: "Book cover design for a self-published graphic novel."
year: "2024"
role: "Illustration, design"
tags:
  - cover
  - illustration
gallery:
  - "/images/illustration/masks-cover/gallery/masks-cover-gallery-01.webp"
  - "/images/illustration/masks-cover/gallery/masks-cover-gallery-02.webp"
featured: true
order: 1
---

Longer project description goes here.
```

---

### 14.3 Interactive Project

```md
---
title: "Drumagery"
section: "interactive"
thumbnail: "/images/interactive/drumagery/thumb.webp"
hero: "/images/interactive/drumagery/hero.webp"
description: "Interactive rhythm/image experiment."
year: "2025"
role: "Design, prototype, code"
tags:
  - interactive
  - prototype
projectUrl: "https://example.com"
embedUrl: "https://example.com/embed"
featured: false
order: 2
---

Project notes go here.
```

---

### 14.4 Journal Post

Use MDX.

```mdx
---
title: "Painting Leftovers"
date: "2026-07-07"
thumbnail: "/images/journal/painting-leftovers/thumb.webp"
excerpt: "A short process note about leftover painting fragments and visual scraps."
tags:
  - process
  - painting
featured: true
---

import RawPostInsert from "../../components/RawPostInsert.astro";

A normal paragraph of journal writing.

<RawPostInsert>
  <div class="custom-post-block">
    <p>Custom inserted content, embed, iframe, or archived Squarespace-style block goes here.</p>
  </div>
</RawPostInsert>
```

---

## 15. Section Behavior

### 15.1 Motion

Route:

```txt
/motion
```

Behavior:

- Display motion projects only.
- Use responsive thumbnail grid.
- Clicking a thumbnail opens a lightbox.
- Lightbox embeds YouTube video.
- Show title, description, year, role, tags.
- Do not create full project pages for motion unless later requested.

Motion card:
- 4:3 thumbnail
- play indicator overlay
- title
- description/meta

Lightbox:
- 16:9 video frame
- iframe loads only after the lightbox opens
- ESC closes
- backdrop click closes
- visible close button
- close button minimum 44 × 44 px

### 15.2 Illustration

Route:

```txt
/illustration
/illustration/[slug]
```

Behavior:

- Display illustration projects only.
- Responsive thumbnail grid.
- Clicking thumbnail opens focused project page.
- Project page supports hero image, text, gallery.

### 15.3 Sequential

Behavior:

- Top nav only.
- External link to:

```txt
https://www.staytoonedgfx.com/
```

Use external indicator:

```txt
Sequential ↗
```

### 15.4 Interactive

Route:

```txt
/interactive
/interactive/[slug]
```

Behavior:

- Display interactive projects only.
- Responsive thumbnail grid.
- Project page supports:
  - external project link
  - iframe embed
  - screenshots/gallery
  - description
  - notes

### 15.5 Education

Behavior:

- Top nav link.
- External or future-external link to configurable GitHub/GitHub Pages URL.
- Intended to host:
  - LBCC student work
  - final projects
  - class archives
  - class showcases
  - course exhibitions

Use external indicator:

```txt
Education ↗
```

Temporary URL:

```txt
https://github.com/dustooned/lbcc-student-work
```

Optional internal placeholder:

If the GitHub site is not ready, it is acceptable to create:

```txt
/education
```

with:

```txt
Education
A future LBCC student work and final-projects archive is in development.

[Visit GitHub Repository]
```

But the final preferred behavior is a direct external nav link.

### 15.6 Journal

Route:

```txt
/journal
/journal/[slug]
```

Behavior:

- Display MDX posts.
- Cards show thumbnail, title, date, excerpt, tags.
- Post pages use a consistent layout.
- Support `RawPostInsert` component for fast custom content insertion.

### 15.7 About

Route:

```txt
/about
```

Simple static page.

### 15.8 Contact

Route:

```txt
/contact
```

Simple static page.  
Can use `mailto:` link first.  
No backend form needed initially.

---

## 16. Card System

Cards should be unified across:

- Motion
- Illustration
- Interactive
- Journal
- Featured work
- Related projects
- Section gateways

### 16.1 Base Card CSS

```css
.card {
  display: grid;
  gap: var(--space-3);
  text-decoration: none;
  color: inherit;
}

.card__media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-media);
  background: var(--color-border);
}

.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 180ms ease;
}

.card:hover .card__media img {
  transform: scale(1.025);
}

.card__title {
  font-size: var(--step-1);
  line-height: 1.1;
}

.card__meta {
  color: var(--color-muted);
  font-size: var(--step--1);
}
```

### 16.2 Project Grid CSS

```css
.project-grid {
  display: grid;
  gap: var(--card-gap-mobile);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--card-gap-desktop);
  }
}

@media (min-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1536px) {
  .project-grid--dense {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

---

## 17. Page Layouts

### 17.1 Section Page Layout

Each section page should follow the same pattern:

```txt
Page intro
Short description
Project/post grid
Optional footer note
```

Example:

```astro
<PageIntro
  eyebrow="Portfolio"
  title="Motion"
  description="Animation, film, loops, motion graphics, and moving-image experiments."
/>

<ProjectGrid projects={motionProjects} />
```

### 17.2 Project Page Layout

Unified focused project page:

```txt
Back link
Project title
Metadata row
Hero media
Description
Body content
Gallery / embeds
Related projects
```

Recommended widths:

```txt
page max width: 1040px
text max width: 760px
media max width: 1280px
```

### 17.3 Journal Post Layout

```txt
Title
Date / tags
Thumbnail or hero image
Prose content
RawPostInsert area if used
Related posts
```

---

## 18. Motion Lightbox

### 18.1 Lightbox Behavior

Requirements:

- user clicks thumbnail
- modal opens
- YouTube iframe loads only after modal opens
- title and description appear below video
- ESC closes
- backdrop click closes
- close button visible
- keyboard accessible
- focus should move into modal when opened
- focus should return to triggering card when closed if practical

### 18.2 Lightbox Layout

```txt
[dark overlay]
  ┌───────────────────────────────┐
  │ YouTube Embed 16:9             │
  ├───────────────────────────────┤
  │ Title                          │
  │ Description                    │
  │ Year / Role / Tags             │
  └───────────────────────────────┘
```

### 18.3 Lightbox CSS

```css
.video-frame {
  aspect-ratio: 16 / 9;
  width: min(100vw - 2rem, 960px);
}

.video-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
```

Mobile:

```txt
modal width: calc(100vw - 1rem)
close button: minimum 44 × 44 px
video remains 16:9
```

---

## 19. RawPostInsert Component

Purpose:
Allow fast insertion of custom content, embeds, HTML-like blocks, or experimental snippets inside journal posts.

Create:

```txt
src/components/RawPostInsert.astro
```

Usage:

```mdx
import RawPostInsert from "../../components/RawPostInsert.astro";

<RawPostInsert>
  <div class="custom-post-block">
    <p>Custom inserted content goes here.</p>
  </div>
</RawPostInsert>
```

Style:

```css
.raw-post-insert {
  margin-block: var(--space-6);
  padding: var(--space-4);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}
```

Important:
- Do not execute arbitrary external scripts by default.
- Allow iframes/embeds intentionally.
- Document safe embed practices.

---

## 20. Homepage Design

Homepage structure:

```txt
Hero intro
Featured project cards
Section gateway cards
Recent journal posts
Footer
```

Recommended hero copy placeholder:

```txt
Dustooned
Motion, illustration, interactive experiments, journal notes, and teaching work by Dustin / T’.
```

Suggested homepage sections:

```txt
1. Hero
2. Featured Work
3. Explore
   - Motion
   - Illustration
   - Sequential ↗
   - Interactive
   - Education ↗
4. Recent Journal
```

Section gateway descriptions:

```txt
Motion
Animation, film, loops, and motion experiments.

Illustration
Images, covers, drawings, design, and visual development.

Sequential
Comics and visual narratives at StayToonedGFX.

Interactive
Games, prototypes, digital toys, and web experiments.

Education
Student work, class showcases, and final projects hosted through a future LBCC GitHub site.
```

---

## 21. Footer Design

Footer should be simple.

```txt
Dustooned
Motion / Illustration / Sequential / Interactive / Education / Journal / About / Contact
Social links
© Year Dustin / Dustooned
```

Mobile:
- stacked

Desktop:
- two or three columns

---

## 22. Accessibility Requirements

- All images must have alt text.
- Decorative images can use empty alt text.
- Lightbox must be keyboard closable.
- Menu button must expose `aria-expanded`.
- External Sequential and Education links should have visible external indicators or accessible labels.
- Color contrast must be readable.
- Focus states must be visible.
- Do not rely only on hover.
- Tap targets should be minimum 44 × 44 px.
- Motion lightbox close button must be reachable by keyboard.
- Mobile menu must be keyboard accessible.

---

## 23. Mobile Usability Rules

Minimum tap target:

```txt
44 × 44 px
```

Recommended card gap:

```txt
16 px mobile
24 px desktop
```

Avoid:
- tiny nav text
- four-column layouts on tablet
- hover-only information
- lightbox controls under 44px
- text over busy images without overlay
- forced landscape layouts on phones
- cramped mobile menu

Mobile section page:

```txt
Title
Short description
One-column cards
Large tap targets
No sidebar
No hover dependency
```

---

## 24. Repo Structure

Build this structure:

```txt
dustooned-site/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── TODO.md
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── docs/
│   ├── PROJECT_BRIEF.md
│   ├── SITE_STRUCTURE.md
│   ├── CONTENT_MODEL.md
│   ├── DESIGN_SYSTEM.md
│   ├── ASSET_GUIDE.md
│   ├── NAVIGATION.md
│   ├── JOURNAL_SYSTEM.md
│   └── MIGRATION_NOTES.md
├── public/
│   ├── images/
│   │   ├── motion/
│   │   ├── illustration/
│   │   ├── interactive/
│   │   └── journal/
│   ├── logos/
│   │   ├── logo.svg
│   │   ├── logo-mark.svg
│   │   └── logo-wordmark.svg
│   ├── og/
│   └── icons/
├── src/
│   ├── components/
│   │   ├── SiteHeader.astro
│   │   ├── SiteFooter.astro
│   │   ├── PageIntro.astro
│   │   ├── ProjectGrid.astro
│   │   ├── ProjectCard.astro
│   │   ├── JournalCard.astro
│   │   ├── SectionGatewayCard.astro
│   │   ├── MotionLightbox.astro
│   │   ├── MediaGallery.astro
│   │   ├── TagList.astro
│   │   ├── RawPostInsert.astro
│   │   └── ExternalLinkButton.astro
│   ├── config/
│   │   └── site.ts
│   ├── content/
│   │   ├── config.ts
│   │   ├── projects/
│   │   └── journal/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ProjectLayout.astro
│   │   └── JournalLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── motion.astro
│   │   ├── illustration/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── interactive/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── journal/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── about.astro
│   │   └── contact.astro
│   └── styles/
│       ├── global.css
│       ├── tokens.css
│       ├── layout.css
│       ├── cards.css
│       ├── nav.css
│       └── lightbox.css
└── scripts/
    └── README.md
```

---

## 25. Required Components

Build:

```txt
SiteHeader
SiteFooter
PageIntro
ProjectGrid
ProjectCard
JournalCard
SectionGatewayCard
MotionLightbox
MediaGallery
TagList
RawPostInsert
ExternalLinkButton
```

### 25.1 ProjectCard

Props:

```ts
type ProjectCardProps = {
  title: string;
  href?: string;
  thumbnail: string;
  description?: string;
  year?: string;
  role?: string;
  tags?: string[];
  isMotion?: boolean;
};
```

Motion cards trigger lightbox.  
Illustration/Interactive cards link to pages.

### 25.2 JournalCard

Props:

```ts
type JournalCardProps = {
  title: string;
  href: string;
  thumbnail?: string;
  date: Date;
  excerpt: string;
  tags?: string[];
};
```

### 25.3 ExternalLinkButton

Use for:
- Sequential
- Education
- projectUrl
- GitHub links
- YouTube fallback links

---

## 26. Documentation Requirements

Create docs:

```txt
docs/PROJECT_BRIEF.md
docs/SITE_STRUCTURE.md
docs/CONTENT_MODEL.md
docs/DESIGN_SYSTEM.md
docs/ASSET_GUIDE.md
docs/NAVIGATION.md
docs/JOURNAL_SYSTEM.md
docs/MIGRATION_NOTES.md
```

### 26.1 README Must Include

- what the site does
- install instructions
- dev command
- build command
- how to add a Motion project
- how to add an Illustration project
- how to add an Interactive project
- how to add a Journal post
- asset dimensions
- folder structure
- how to update Sequential URL
- how to update Education URL
- privacy/safety note for student work

### 26.2 Student Work Privacy Note

In docs and README, include:

```md
## Education / Student Work Note

The Education link points to a future LBCC student-work archive. Before publishing student work, confirm permissions, attribution preferences, accessibility requirements, and any relevant institutional policies. Avoid publishing private student information.
```

---

## 27. New Project Checklist

Add this to README.

```md
# New Project Checklist

- [ ] Decide section: motion, illustration, or interactive
- [ ] Create folder in `public/images/{section}/{slug}/`
- [ ] Add `thumb.webp` at 1600 × 1200
- [ ] Add `hero.webp` if needed
- [ ] Add poster image if Motion needs one
- [ ] Add gallery images if needed
- [ ] Create `src/content/projects/{slug}.md`
- [ ] Fill title, section, thumbnail, description
- [ ] Add videoUrl/projectUrl/embedUrl if needed
- [ ] Add tags
- [ ] Run `npm run build`
- [ ] Check desktop layout
- [ ] Check mobile layout
```

---

## 28. New Journal Post Checklist

Add this to README.

```md
# New Journal Post Checklist

- [ ] Create folder in `public/images/journal/{slug}/`
- [ ] Add `thumb.webp` at 1600 × 1200 if needed
- [ ] Create `src/content/journal/{slug}.mdx`
- [ ] Add title
- [ ] Add date
- [ ] Add excerpt
- [ ] Add tags
- [ ] Write post content
- [ ] Use `<RawPostInsert>` only when custom embed/code block is needed
- [ ] Run `npm run build`
- [ ] Check post on mobile
```

---

## 29. Sample Content Requirements

Add at least:

```txt
2 motion projects
2 illustration projects
2 interactive projects
2 journal posts
```

Use placeholder images and placeholder YouTube URLs where needed.

Suggested sample project names:

```txt
Motion:
- GAS DRAWLS
- Motion Sample Two

Illustration:
- Masks Cover
- Illustration Sample Two

Interactive:
- Drumagery
- It’s A Good Life Beta

Journal:
- Painting Leftovers
- Process Note Sample
```

Use placeholders safely. The goal is infrastructure, not final content.

---

## 30. Migration Notes for Later

Later, Claude Code can help with:

- crawling current Squarespace public pages
- downloading public images/assets
- mapping old URLs to new routes
- cleaning project descriptions
- rebuilding galleries
- compressing images
- writing alt text
- creating redirects
- refining artist statement
- improving SEO metadata

Do not build a Squarespace clone.  
Build a clean independent codebase.

---

## 31. Codex Task: Build Prompt

Use this exact instruction as the main Codex task:

```md
Build the initial infrastructure for a new Astro + MDX portfolio site called `dustooned-site`.

Project goal:
Create a clean, simple artist/educator portfolio for Dustooned with these top-level sections:

- Motion
- Illustration
- Sequential
- Interactive
- Education
- Journal
- About
- Contact

Sequential should not be an internal content section. It should link externally to:
https://www.staytoonedgfx.com/

Education should not be an internal content section for now. It should link externally to a configurable GitHub/GitHub Pages URL for a future LBCC student-work and final-projects site. Use this placeholder:
https://github.com/dustooned/lbcc-student-work

Use Astro, TypeScript, MDX, Astro Content Collections, and global CSS. Prioritize clean infrastructure over visual polish. Keep the site static-first.

Required behavior:

1. Motion
   - Create `/motion`.
   - Display a responsive grid of motion project thumbnails.
   - Clicking a thumbnail opens a lightbox with an embedded YouTube video.
   - Include project title, description, year, role, and tags.
   - YouTube iframe should load only after the lightbox opens.
   - ESC, backdrop click, and visible close button should close the lightbox.

2. Illustration
   - Create `/illustration`.
   - Display a responsive grid of project thumbnails.
   - Clicking a thumbnail opens a focused project page.

3. Sequential
   - Add top-nav item `Sequential ↗`.
   - Link externally to https://www.staytoonedgfx.com/
   - Use target="_blank" and rel="noopener noreferrer".

4. Interactive
   - Create `/interactive`.
   - Display a responsive grid of project thumbnails.
   - Clicking a thumbnail opens a focused project page.
   - Support external project links and iframe embeds.

5. Education
   - Add top-nav item `Education ↗`.
   - Link externally to configurable GitHub/GitHub Pages URL:
     https://github.com/dustooned/lbcc-student-work
   - Put the URL in one config file so it can be changed later.
   - Use target="_blank" and rel="noopener noreferrer".

6. Journal
   - Create `/journal`.
   - Display journal post cards with thumbnail, title, date, excerpt, and tags.
   - Use MDX for journal posts.
   - Create a reusable `<RawPostInsert />` component that allows fast insertion of custom HTML/embed blocks inside a post.

7. About and Contact
   - Create simple placeholder pages.

8. Global style system
   - Create centralized global CSS.
   - Use CSS variables for colors, typography, spacing, max widths, border radius, card style, nav heights, and shadows.
   - All cards across Motion, Illustration, Interactive, and Journal should feel visually unified.

9. Responsive navigation
   - Desktop: logo left, nav links right.
   - Mobile: logo visually centered, menu button on the right.
   - Mobile menu opens vertically.
   - Minimum 44px tap targets.
   - Sequential and Education should show external-link indicators.
   - Active internal page state should be styled.
   - Accessible aria attributes required.

10. Logo support
   - Add `/public/logos/logo.svg`
   - Add `/public/logos/logo-mark.svg`
   - Add `/public/logos/logo-wordmark.svg`
   - Use SVG by default.
   - Placeholder SVGs are fine.

11. Unified card components
   - ProjectCard
   - JournalCard
   - SectionGatewayCard
   - all use 4:3 thumbnail aspect ratio
   - all support title, description/excerpt, tags, and metadata

12. Responsive grids
   - 1 column mobile
   - 2 columns tablet
   - 3 columns desktop
   - optional 4 columns on wide screens

13. Asset guide
   - project thumbnails: 1600 × 1200, 4:3
   - journal thumbnails: 1600 × 1200, 4:3
   - motion video posters: 1920 × 1080, 16:9
   - hero images: 2400 × 1350, 16:9
   - illustration detail images: 1600 × 2000, 4:5 or 2000 × 1500, 4:3
   - OG images: 1200 × 630
   - logo SVG preferred

14. Content collections
   - Create `projects` and `journal`.
   - Project fields:
     - title
     - section: motion | illustration | interactive
     - thumbnail
     - description
     - year
     - role
     - tags
     - videoUrl
     - projectUrl
     - embedUrl
     - gallery
     - hero
     - heroAspect
     - featured
     - order
   - Journal fields:
     - title
     - date
     - thumbnail
     - excerpt
     - tags
     - featured

15. Documentation
   - Create README.md.
   - Create AGENTS.md for Codex.
   - Create CLAUDE.md for future Claude Code handoff.
   - Create TODO.md.
   - Create:
     - docs/PROJECT_BRIEF.md
     - docs/SITE_STRUCTURE.md
     - docs/CONTENT_MODEL.md
     - docs/DESIGN_SYSTEM.md
     - docs/ASSET_GUIDE.md
     - docs/NAVIGATION.md
     - docs/JOURNAL_SYSTEM.md
     - docs/MIGRATION_NOTES.md
   - Include New Project Checklist.
   - Include New Journal Post Checklist.
   - Include Education / Student Work privacy note.

16. Sample content
   - Add at least:
     - 2 motion projects
     - 2 illustration projects
     - 2 interactive projects
     - 2 journal posts
   - Use placeholder images and placeholder YouTube URLs where needed.

17. Validation
   - Ensure `npm install`, `npm run dev`, and `npm run build` work.
   - Do not add unnecessary backend infrastructure.
   - Keep the site static-first.
```

---

## 32. CLAUDE.md Handoff Instructions

Create `CLAUDE.md` with:

```md
# Claude Code Handoff Notes

This is the Dustooned.com Astro + MDX portfolio rebuild.

Core sections:
- Motion: internal, YouTube lightbox grid
- Illustration: internal, project grid/pages
- Sequential: external link to StayToonedGFX
- Interactive: internal, project grid/pages
- Education: external link to future LBCC GitHub/GitHub Pages student-work site
- Journal: MDX posts with RawPostInsert
- About
- Contact

Important:
- Do not convert this into a heavy CMS.
- Keep content editable through Markdown/MDX.
- Keep assets in predictable folders.
- Preserve mobile-first design.
- Keep external links configurable.
- Do not publish student work without permissions/policy review.
- Prefer improving content, alt text, migration, and polish over changing the architecture.
```

---

## 33. AGENTS.md Instructions

Create `AGENTS.md` with:

```md
# Agent Instructions

Build and maintain this as a static-first Astro + MDX portfolio site.

Priorities:
1. Clean architecture
2. Reliable build
3. Simple content editing
4. Predictable asset folders
5. Mobile-first navigation
6. Unified card system
7. Accessible lightbox and menu
8. Documentation

Do not:
- Add backend services unless explicitly requested.
- Hard-code external URLs in multiple places.
- Store sensitive student data.
- Rely on hover-only interactions.
- Break Markdown/MDX content workflows.

Before finishing:
- Run build.
- Check TypeScript/content schema errors.
- Update README/TODO if architecture changes.
```

---

## 34. Acceptance Criteria

The build is ready when:

- `npm install` works.
- `npm run dev` works.
- `npm run build` works.
- Desktop nav has logo left and nav right.
- Mobile nav has visually centered logo and right menu button.
- Mobile menu is readable and thumb-friendly.
- Top navigation includes:
  - Motion
  - Illustration
  - Sequential
  - Interactive
  - Education
  - Journal
  - About
  - Contact
- Sequential links externally to StayToonedGFX.
- Education links externally to the configurable future LBCC GitHub/GitHub Pages URL.
- Cards are visually consistent across all sections.
- Motion thumbnails open YouTube lightbox.
- Illustration and Interactive thumbnails lead to project pages.
- Journal posts use consistent cards and MDX pages.
- RawPostInsert works inside MDX.
- Asset dimensions are documented.
- New content can be added by creating one Markdown/MDX file and adding assets to a predictable folder.
- Student work privacy note exists in documentation.
- Site remains easy to hand off to Claude Code.

---

## 35. Final Build Instruction

Build the infrastructure first.

Do not spend time over-polishing the visual design yet.  
The first completed version should be a working, documented skeleton with sample content, correct navigation, correct asset structure, responsive behavior, and successful build.

Visual refinement, migrated content, final colors, and final writing can happen later.
