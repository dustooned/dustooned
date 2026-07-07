# Dustooned Site

Static-first Astro + MDX portfolio infrastructure for Dustooned.com.

## What This Site Does

This project is a clean portfolio skeleton for:

- Motion: thumbnail grid with YouTube lightbox
- Illustration: thumbnail grid with project detail pages
- Sequential: external link to StayToonedGFX
- Interactive: thumbnail grid with project detail pages, embeds, and external links
- Education: external link to a future LBCC student-work archive
- Journal: MDX posts with optional custom insert blocks
- About and Contact: static pages

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Add a Motion Project

1. Create `public/images/motion/{slug}/`.
2. Add a 4:3 thumbnail, ideally 1600 x 1200.
3. Create `src/content/projects/{slug}.md`.
4. Set `section: "motion"` and add `videoUrl`.
5. Run `npm run build`.

## Add an Illustration Project

1. Create `public/images/illustration/{slug}/`.
2. Add `thumb` and optional `hero` / `gallery` assets.
3. Create `src/content/projects/{slug}.md`.
4. Set `section: "illustration"`.
5. Run `npm run build`.

## Add an Interactive Project

1. Create `public/images/interactive/{slug}/`.
2. Add `thumb` and optional `hero`.
3. Create `src/content/projects/{slug}.md`.
4. Set `section: "interactive"`.
5. Add `projectUrl` and/or `embedUrl` if needed.
6. Run `npm run build`.

## Add a Journal Post

1. Create `public/images/journal/{slug}/` if the post needs images.
2. Create `src/content/journal/{slug}.mdx`.
3. Add title, date, excerpt, tags, and optional thumbnail.
4. Import and use `<RawPostInsert />` only for intentional custom blocks.
5. Run `npm run build`.

## Asset Dimensions

| Asset | Recommended Size | Ratio |
|---|---:|---:|
| Project thumbnail | 1600 x 1200 | 4:3 |
| Journal thumbnail | 1600 x 1200 | 4:3 |
| Motion poster | 1920 x 1080 | 16:9 |
| Project hero | 2400 x 1350 | 16:9 |
| Portrait illustration | 1600 x 2000 | 4:5 |
| Landscape illustration | 2000 x 1500 | 4:3 |
| Open Graph | 1200 x 630 | 1.91:1 |

Use WebP or JPG for final artwork and SVG for logos.

## External URLs

Update external links in `src/config/site.ts`.

- Sequential: `https://www.staytoonedgfx.com/`
- Education: `https://github.com/dustooned/lbcc-student-work`

## Education / Student Work Note

The Education link points to a future LBCC student-work archive. Before publishing student work, confirm permissions, attribution preferences, accessibility requirements, and any relevant institutional policies. Avoid publishing private student information.

## New Project Checklist

- [ ] Decide section: motion, illustration, or interactive
- [ ] Create folder in `public/images/{section}/{slug}/`
- [ ] Add `thumb.webp` at 1600 x 1200
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

## New Journal Post Checklist

- [ ] Create folder in `public/images/journal/{slug}/`
- [ ] Add `thumb.webp` at 1600 x 1200 if needed
- [ ] Create `src/content/journal/{slug}.mdx`
- [ ] Add title
- [ ] Add date
- [ ] Add excerpt
- [ ] Add tags
- [ ] Write post content
- [ ] Use `<RawPostInsert>` only when custom embed/code block is needed
- [ ] Run `npm run build`
- [ ] Check post on mobile
