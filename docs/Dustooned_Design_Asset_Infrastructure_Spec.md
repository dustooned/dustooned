# Dustooned Site Design Infrastructure Spec

Use this as the design/build brief for Codex first, then Claude Code later.

Project target: a simple, fast, static-first Astro + MDX portfolio site with clean global styling, predictable asset dimensions, and a navigation system that works well on desktop and mobile.

---

## 1. Core Site Structure

```txt
Dustooned.com
├── /motion
│   └── thumbnail grid → YouTube lightbox
├── /illustration
│   └── thumbnail grid → focused project pages
├── Sequential
│   └── external link to https://www.staytoonedgfx.com/
├── /interactive
│   └── thumbnail grid → focused project pages / embeds / external links
├── /journal
│   └── post cards → MDX posts with RawPostInsert blocks
├── /about
└── /contact
```

Main navigation labels:

```txt
Motion
Illustration
Sequential
Interactive
Journal
About
Contact
```

Sequential is an external link, not an internal collection.

---

## 2. Design Goals

The site should feel:

- clean
- readable
- visual-first
- easy to navigate
- artist-facing, not corporate
- consistent across all sections
- lightweight enough to maintain manually

The design system should prioritize:

1. predictable image dimensions
2. simple card grids
3. mobile-first spacing
4. global typography and color variables
5. easy asset preparation
6. easy content insertion through Markdown/MDX

---

## 3. Recommended Tech Stack

```txt
Astro
TypeScript
MDX
Astro Content Collections
Global CSS
Static deployment
```

No required backend.

Optional later:

- image optimization plugin
- search/filtering
- tag pages
- newsletter integration
- analytics
- contact form service

---

## 4. Breakpoint System

Use these breakpoints consistently.

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

Implementation breakpoints:

```css
/* mobile default: 0–767px */
/* tablet: 768px+ */
/* laptop: 1024px+ */
/* desktop: 1280px+ */
/* wide: 1536px+ */
```

Layout behavior:

| Viewport | Layout |
|---|---|
| 320–479px | single-column, compact nav |
| 480–767px | single-column with larger cards |
| 768–1023px | two-column grids |
| 1024–1279px | three-column grids |
| 1280px+ | three/four-column grids depending section |
| 1536px+ | max-width container, no endless stretching |

---

## 5. Global Layout Measurements

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

Page shell:

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

## 6. Asset Dimension System

### 6.1 Principle

Do **not** design every section with random image sizes.

Use a few standardized image shapes:

1. **Project thumbnails**
2. **Hero images**
3. **Gallery images**
4. **Journal thumbnails**
5. **Logo assets**
6. **Open Graph / social share images**

The site should use CSS `aspect-ratio` so images translate cleanly to mobile.

---

## 7. Master Asset Dimensions

### 7.1 Project Thumbnail

Used for:

- Motion grid
- Illustration grid
- Interactive grid
- Featured projects
- related project cards

Recommended source export:

```txt
1600 × 1200 px
Aspect ratio: 4:3
Format: JPG or WebP
```

CSS display:

```css
.project-card__media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.project-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Why 4:3:
- works for art thumbnails
- fits motion stills acceptably
- feels less cramped than 16:9 on mobile
- keeps grid rhythm unified

If a video still is cinematic, crop it intentionally into the 4:3 thumbnail.

---

### 7.2 Motion Video Thumbnail

Primary site thumbnail should still be 4:3 for grid consistency.

Optional video-native thumbnail:

```txt
1920 × 1080 px
Aspect ratio: 16:9
```

Use this inside the lightbox if needed.

Recommended files:

```txt
motion-project-thumb.webp       1600 × 1200
motion-project-video-poster.webp 1920 × 1080
```

---

### 7.3 Project Hero Image

Used at the top of focused project pages.

Recommended source export:

```txt
2400 × 1350 px
Aspect ratio: 16:9
Format: JPG or WebP
```

CSS:

```css
.project-hero__image {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
}
```

Alternative for vertical artwork:
- allow `heroAspect: "4:5"` or `heroAspect: "auto"` in frontmatter.

---

### 7.4 Illustration Detail Image

For single artwork/project detail pages.

Recommended source exports:

```txt
Portrait artwork: 1600 × 2000 px, 4:5
Landscape artwork: 2000 × 1500 px, 4:3
Square artwork: 1800 × 1800 px, 1:1
```

Inside project pages, do **not** force all images to crop. Use object containment when viewing artwork.

```css
.artwork-viewer img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
```

---

### 7.5 Gallery Images

Recommended max export:

```txt
Long edge: 2000–2400 px
Short edge: flexible
Format: WebP preferred, JPG acceptable
```

Rules:

- Keep originals separately.
- Use compressed web copies in the repo.
- Do not upload massive 6000 px images unless needed.
- Use descriptive filenames.

Example:

```txt
public/images/projects/masks/gallery/masks-page-01.webp
public/images/projects/masks/gallery/masks-page-02.webp
```

---

### 7.6 Journal Thumbnail

Use the same as project cards for consistency.

```txt
1600 × 1200 px
Aspect ratio: 4:3
```

CSS:

```css
.journal-card__media {
  aspect-ratio: 4 / 3;
}
```

---

### 7.7 Open Graph / Social Image

For link previews.

```txt
1200 × 630 px
Aspect ratio: 1.91:1
```

Filename:

```txt
public/og/dustooned-default-og.jpg
public/og/project-slug-og.jpg
```

---

### 7.8 Favicon / App Icons

Recommended:

```txt
favicon.svg
favicon.ico
apple-touch-icon.png       180 × 180
android-chrome-192.png     192 × 192
android-chrome-512.png     512 × 512
```

---

### 7.9 Logo Assets

Preferred:

```txt
logo.svg
logo-mark.svg
logo-wordmark.svg
```

Optional raster backups:

```txt
logo-wordmark-640.png
logo-mark-512.png
```

Recommended logo working dimensions:

| Asset | Suggested artboard | Use |
|---|---:|---|
| Wordmark | 640 × 180 px | desktop header |
| Logo mark | 512 × 512 px | favicon/mobile/icon |
| Horizontal lockup | 900 × 240 px | large header/footer |
| SVG | scalable | preferred |

---

## 8. Asset Folder Structure

Use predictable folders so asset building is easy.

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

Optional source-only folder not deployed:

```txt
_assets-source/
├── motion/
├── illustration/
├── interactive/
├── journal/
└── logo/
```

Do not rely on `_assets-source` in production code.

---

## 9. File Naming Rules

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

Recommended pattern:

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

## 10. Image Compression Targets

Suggested target sizes:

| Asset | Target file size |
|---|---:|
| Project thumbnail | 150–400 KB |
| Journal thumbnail | 150–400 KB |
| Hero image | 300–800 KB |
| Gallery image | 250 KB–1.2 MB |
| OG image | 150–500 KB |
| Logo SVG | under 100 KB |

Use WebP by default.

Fallback JPG only if needed.

---

## 11. Global Style System

Create:

```txt
src/styles/global.css
src/styles/tokens.css
src/styles/layout.css
src/styles/cards.css
src/styles/nav.css
src/styles/lightbox.css
```

Or use one global file first, then split later if it gets too large.

---

## 12. CSS Token System

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

These are placeholders. Final colors can be changed globally.

---

## 13. Typography Rules

### Desktop

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
```

### Mobile

Use the same clamp values. Avoid separate mobile type unless necessary.

Line length:

```css
.prose {
  max-width: 68ch;
}
```

---

## 14. Card System

Cards should be unified across:

- Motion
- Illustration
- Interactive
- Journal
- Featured work
- Related projects

### Base Card

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

### Project Grid

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
```

Optional four-column grid only on very wide screens:

```css
@media (min-width: 1536px) {
  .project-grid--dense {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

---

## 15. Section Page Layout

Each section page should follow the same structure.

```txt
Page Intro
Filter/description text
Project Grid
Optional footer note / related link
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

---

## 16. Project Page Layout

Unified focused project page.

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

Recommended dimensions:

- page max width: 1040px
- text max width: 760px
- media max width: 1280px

Structure:

```astro
<ProjectLayout>
  <BackLink />
  <ProjectHeader />
  <ProjectHero />
  <ProseContent />
  <MediaGallery />
  <RelatedProjects />
</ProjectLayout>
```

---

## 17. Motion Lightbox Design

Motion should not require a full page unless desired.

Behavior:

1. User clicks thumbnail.
2. Modal/lightbox opens.
3. YouTube embed loads only after opening.
4. Description appears below video.
5. ESC closes.
6. Click backdrop closes.
7. Close button visible and keyboard accessible.

Lightbox layout:

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

CSS:

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

- modal width: `calc(100vw - 1rem)`
- close button: minimum 44 × 44 px tap target
- video stays 16:9

---

## 18. Navigation Bar Design

### 18.1 Desktop Navigation

Desktop layout:

```txt
┌──────────────────────────────────────────────────────┐
│ LOGO                              Motion Illustration │
│                                   Sequential ...      │
└──────────────────────────────────────────────────────┘
```

Logo orientation:
- left-aligned
- vertically centered
- clickable to home

Nav links:
- right-aligned
- horizontal
- compact
- no dropdowns initially

CSS:

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

Desktop logo size:
- visual height: 40–48px
- header height: 72–80px

---

### 18.2 Mobile Navigation

Mobile goal:
- logo should feel centered or clearly anchored
- nav should not feel cramped
- tap targets should be easy
- menu should be one thumb-friendly panel

Recommended mobile layout:

```txt
┌─────────────────────────────┐
│        DUSTOONED LOGO    ☰  │
└─────────────────────────────┘
```

The logo is visually centered, while the menu button sits on the right.

To center the logo despite the menu button:

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
}
```

Mobile logo size:
- wordmark height: 32–38px
- mark-only option: 36–44px
- tap target: minimum 44 × 44px

Mobile menu panel:

```txt
┌─────────────────────────────┐
│ Motion                      │
│ Illustration                │
│ Sequential ↗                │
│ Interactive                 │
│ Journal                     │
│ About                       │
│ Contact                     │
└─────────────────────────────┘
```

CSS:

```css
.mobile-menu {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.mobile-menu a {
  min-height: 48px;
  display: flex;
  align-items: center;
  font-size: var(--step-1);
}
```

At `768px+`, switch to desktop nav.

---

### 18.3 Mobile Nav Behavior

Requirements:

- hamburger button opens/closes menu
- ESC closes menu
- click outside closes menu
- menu closes when a link is selected
- active page link is visually indicated
- Sequential link shows external-link indicator
- nav remains keyboard accessible
- body scroll should not lock unless full-screen menu is used

Accessible button:

```html
<button
  type="button"
  aria-label="Open navigation menu"
  aria-expanded="false"
  aria-controls="mobile-menu"
>
  Menu
</button>
```

---

## 19. Header Component Requirements

Create:

```txt
src/components/SiteHeader.astro
src/components/MobileNavToggle.tsx or vanilla JS
```

Props:

```ts
type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};
```

Nav items:

```ts
const navItems = [
  { label: "Motion", href: "/motion" },
  { label: "Illustration", href: "/illustration" },
  { label: "Sequential", href: "https://www.staytoonedgfx.com/", external: true },
  { label: "Interactive", href: "/interactive" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];
```

External link attributes:

```html
target="_blank" rel="noopener noreferrer"
```

---

## 20. Footer Design

Footer should be simple.

```txt
Dustooned
Motion / Illustration / Sequential / Interactive / Journal / About / Contact
Social links
© Year Dustin / Dustooned
```

Footer layout:
- mobile: stacked
- desktop: two or three columns

---

## 21. Journal Design

Journal page:

```txt
Journal
Process notes, updates, experiments, scraps, and project development.

[Post Card]
thumbnail
title
date
excerpt
tags
```

Journal card should use same 4:3 media as project cards.

Journal post layout:

```txt
Title
Date / tags
Thumbnail or hero image
Prose content
RawPostInsert area
Related posts
```

---

## 22. RawPostInsert Component

Purpose:
Allow fast insertion of custom content, embeds, HTML-like blocks, or experimental snippets inside journal posts.

Component:

```txt
src/components/RawPostInsert.astro
```

Usage in MDX:

```mdx
---
title: "Painting Leftovers"
date: "2026-07-07"
thumbnail: "/images/journal/painting-leftovers/thumb.webp"
excerpt: "A short process note."
tags:
  - process
  - painting
---

import RawPostInsert from "../../components/RawPostInsert.astro";

Some normal post text.

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

## 23. Content Collections

### Project Collection

```ts
const projectSchema = z.object({
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
  featured: z.boolean().default(false),
  order: z.number().optional()
});
```

### Journal Collection

```ts
const journalSchema = z.object({
  title: z.string(),
  date: z.date(),
  thumbnail: z.string().optional(),
  excerpt: z.string(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false)
});
```

---

## 24. Content File Examples

### Motion project

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

### Illustration project

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
  - "/images/illustration/masks-cover/gallery-01.webp"
  - "/images/illustration/masks-cover/gallery-02.webp"
featured: true
order: 1
---

Longer project description goes here.
```

### Interactive project

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

## 25. Homepage Design

Homepage structure:

```txt
Hero intro
Featured project cards
Section gateway cards
Recent journal posts
Footer
```

Recommended homepage hero:

```txt
Dustooned
Motion, illustration, sequential art, and interactive experiments by Dustin / T’.
```

Homepage should not be overloaded.

Suggested homepage sections:

```txt
1. Hero
2. Featured Work
3. Explore
   - Motion
   - Illustration
   - Sequential ↗
   - Interactive
4. Recent Journal
```

---

## 26. Section Gateway Cards

Gateway card dimensions:
- same 4:3 media ratio
- simple title and one-sentence description

Example:

```txt
Motion
Animation, film, loops, and motion experiments.

Illustration
Images, covers, drawings, design, and visual development.

Sequential
Comics and visual narratives at StayToonedGFX.

Interactive
Games, prototypes, digital toys, and web experiments.
```

---

## 27. Mobile Usability Rules

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
- hidden hover-only information
- lightbox controls under 44px
- text over busy images without overlay
- forced landscape layouts on phones

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

## 28. Accessibility Requirements

- All images must have alt text.
- Decorative images can use empty alt text.
- Lightbox must be keyboard closable.
- Menu button must expose `aria-expanded`.
- External Sequential link should have visible indicator or accessible label.
- Color contrast should be readable.
- Focus states should be visible.
- Do not rely only on hover.

---

## 29. Developer Experience Requirements

Make asset building easy.

Add documentation:

```txt
docs/ASSET_GUIDE.md
docs/DESIGN_SYSTEM.md
docs/NAVIGATION.md
docs/CONTENT_MODEL.md
```

Add sample files:

```txt
content/projects/sample-motion.md
content/projects/sample-illustration.md
content/projects/sample-interactive.md
content/journal/sample-post.mdx
```

Add helper checklist:

```md
# New Project Checklist

- [ ] Create folder in `public/images/{section}/{slug}/`
- [ ] Add `thumb.webp` at 1600 × 1200
- [ ] Add `hero.webp` if needed
- [ ] Add gallery images if needed
- [ ] Create `content/projects/{slug}.md`
- [ ] Fill title, section, thumbnail, description
- [ ] Add videoUrl/projectUrl/embedUrl if needed
- [ ] Run build
- [ ] Check mobile view
```

---

## 30. Codex Build Prompt Addendum

Add this to the existing Codex prompt.

```md
Extend the Astro + MDX portfolio infrastructure with a detailed design and asset system.

Requirements:

1. Add centralized CSS design tokens:
   - colors
   - typography
   - spacing
   - max widths
   - card radius
   - nav heights
   - shadows
   - breakpoints

2. Build a fully responsive `SiteHeader`:
   - desktop: logo left, nav links right
   - mobile: logo visually centered, menu button right
   - hamburger menu opens a vertical mobile menu
   - menu links use minimum 44px tap targets
   - Sequential link points externally to https://www.staytoonedgfx.com/
   - external link indicator should be visible
   - active page state should be styled
   - accessible aria attributes required

3. Add logo asset support:
   - `/public/logos/logo.svg`
   - `/public/logos/logo-mark.svg`
   - `/public/logos/logo-wordmark.svg`
   - use SVG by default

4. Build unified card components:
   - ProjectCard
   - JournalCard
   - SectionGatewayCard
   - all use 4:3 thumbnail aspect ratio
   - all support title, description/excerpt, tags, and metadata

5. Add responsive grids:
   - 1 column mobile
   - 2 columns tablet
   - 3 columns desktop
   - optional 4 columns wide screens

6. Add Motion lightbox:
   - thumbnail opens YouTube iframe
   - 16:9 video frame
   - title and description below
   - ESC close
   - backdrop click close
   - close button 44px minimum
   - iframe loads only when opened

7. Add asset guide:
   - project thumbnails: 1600 × 1200, 4:3
   - motion video posters: 1920 × 1080, 16:9
   - hero images: 2400 × 1350, 16:9
   - illustration detail images: 1600 × 2000, 4:5 or 2000 × 1500, 4:3
   - journal thumbnails: 1600 × 1200, 4:3
   - OG images: 1200 × 630
   - logo SVG preferred

8. Add docs:
   - docs/ASSET_GUIDE.md
   - docs/DESIGN_SYSTEM.md
   - docs/NAVIGATION.md

9. Add New Project Checklist to README.

10. Ensure the site builds cleanly and remains static-first.
```

---

## 31. Build Acceptance Criteria

The infrastructure is ready when:

- Desktop nav has logo left and nav right.
- Mobile nav has visually centered logo and right menu button.
- Mobile menu is readable and thumb-friendly.
- Cards are visually consistent across all sections.
- Motion thumbnails open YouTube lightbox.
- Illustration and Interactive thumbnails lead to project pages.
- Journal posts use consistent cards and MDX pages.
- RawPostInsert works inside MDX.
- Asset dimensions are documented.
- New content can be added by creating one Markdown/MDX file and adding assets to a predictable folder.
- Site passes `npm run build`.
- Site remains easy to hand off to Claude Code.
