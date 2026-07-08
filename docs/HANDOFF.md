# Current Handoff

This is the current operational handoff for continuing the Dustooned.com rebuild.

## Project State

The repository root is the Astro project root.

Important files:

- `package.json`: scripts and dependencies
- `astro.config.mjs`: Astro site/base config
- `src/content.config.ts`: content collection schemas
- `src/config/site.ts`: site title, external links, nav items, active visual mood
- `src/config/content.ts`: content helpers, including base-path URL helper
- `src/layouts/BaseLayout.astro`: global shell
- `src/components/SiteHeader.astro`: desktop/mobile navigation
- `src/components/PageTransition.astro`: palette fade transitions
- `src/components/Hero.astro`: homepage hero (video/gif slot + placeholder fallback)
- `src/components/BubbleInteraction.astro`: renders randomized background bubbles with independent per-bubble parallax
- `src/components/MotionLightbox.astro`: video modal, supports single video or multi-episode toggle
- `src/styles/moods.css`: handmade visual direction, bubble field styles
- `.github/workflows/deploy.yml`: GitHub Pages deploy workflow

## Next Instruction

Live deploy is confirmed working, and Motion is fully populated with real content. Next up: replace a placeholder Illustration project with a real one. This should test:

- real thumbnail
- real hero image
- real title
- short description
- year
- role
- tags
- optional gallery images

Then run `npm run build`, commit the content change, and push.

Interactive still has placeholder content too — same treatment once real projects are ready.

## Current Active Design

The active visual mood is `poster`.

Change it in:

```txt
src/config/site.ts
```

Available values:

```txt
clean
poster
sketchbook
comic
```

Only `poster` has been actively tuned.

## Deployment

GitHub Pages Source is confirmed set to `GitHub Actions` in repository settings (Settings -> Pages -> Build and deployment -> Source). This was a real footgun: GitHub was previously set to `Deploy from a branch`, which runs an automatic legacy Jekyll `pages-build-deployment` workflow in parallel with our custom `Deploy to GitHub Pages` workflow on every push. Both targeted the same Pages environment, so which one "won" was a race condition — it usually happened to be ours, but the Jekyll workflow eventually failed outright (it's not a Jekyll site). Switching Source to `GitHub Actions` stops the Jekyll workflow from running at all.

If this setting ever reverts (e.g. after a repo transfer or Pages reset), redo that switch before debugging anything else — a "plain/static text" live site or a failing `pages-build-deployment` run is the symptom.

Temporary URL:

```txt
https://dustooned.github.io/dustooned/
```

Final intended URL:

```txt
https://www.dustooned.com
```

## How To Continue Safely

Before making changes:

```sh
git status --short --branch
npm install
npm run build
```

After changes:

```sh
npm run build
git status --short
```

Commit small conceptual chunks.

## Current Content Model

Projects:

```txt
src/content/projects/*.md
```

Journal:

```txt
src/content/journal/*.mdx
```

Public assets:

```txt
public/images/{section}/{slug}/
```

Prefer one Markdown/MDX file per content item and predictable asset names.

Motion projects support an optional `episodes` field (array of `{ label, videoUrl }`) for
projects with more than one video. The lightbox only shows the episode toggle row when a
project has 2+ episodes; single-video projects are unaffected. Motion thumbnails are pulled
directly from YouTube (`https://img.youtube.com/vi/{id}/hqdefault.jpg`) rather than custom
assets, since the video itself is the source image. Lightbox videos do not autoplay.

## Known Placeholder Areas

Done:

- Motion: 12 real projects with real YouTube videos, thumbnails, and descriptions
- About page: real bio
- Homepage: hero, organic bubble background, "What's New" journal feed

Still unfinished:

- Illustration: real thumbnails, hero images, descriptions
- Interactive: real thumbnails, hero images, descriptions
- Contact page copy
- CV page text
- Resume page text
- newsletter provider/integration (currently a static callout)
- final logo assets
- final custom domain setup

## Design Cautions

- Preserve the handmade grid and bubble direction unless intentionally redesigning.
- Keep body copy readable with the clean system body font.
- Avoid making every navigation animation heavy.
- Keep mobile first: 1-column grids by default, tap targets at least 44px.
- Keep animations optional for reduced-motion users.

## Student Work Caution

Do not publish student work until permissions, attribution preferences, accessibility requirements, and relevant institutional policies are confirmed.
