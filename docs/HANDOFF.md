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

Live deploy is confirmed working, and Motion is fully populated with real content. Walo and
Masks (Illustration) are now real, simplified entries (cover image + external `links` buttons,
see `docs/CONTENT_MODEL.md`) rather than full internal galleries — their StayToonedGFX/
Kickstarter links are placeholders (`href: "#"`) until StayToonedGFX itself is built. Next up:
replace the remaining placeholder Illustration/Interactive projects with real content. This
should test:

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

Live URL (custom domain, cut over 2026-07-15 from Squarespace/GoDaddy):

```txt
https://www.dustooned.com
```

The old temporary project-pages URL (`https://dustooned.github.io/dustooned/`) is no longer
what the build targets — see `docs/DEPLOYMENT.md` for the full DNS/custom-domain setup,
including which GoDaddy DNS records are safe to touch and which run live Google Workspace
email for the domain (do not touch those without checking that doc first).

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

- Illustration: most entries still need real thumbnails/heroes/descriptions (Walo and Masks
  are done; see `docs/CONTENT_MODEL.md` for their `links`-based pattern)
- Interactive: real thumbnails, hero images, descriptions
- Contact page copy
- CV page text
- Resume page text
- newsletter provider/integration (currently a static callout)
- StayToonedGFX comics site (Walo/Masks external links are placeholders until this exists)

Done:

- final logo (`public/logos/logo.svg`, real vector SVG, nav CSS auto-sizes it — see
  `docs/ASSET_GUIDE.md`)
- custom domain (`https://www.dustooned.com`, cut over from Squarespace/GoDaddy — see
  `docs/DEPLOYMENT.md`)

## Gotchas (read before touching thumbnails, project heroes, or the logo)

- **Regenerate thumbnails with the script, never by hand.** `node
  scripts/generate-smart-thumbnails.mjs` is the only path that produces correct output for
  GIF sources (small animated webp, 640x480) vs static sources (1600x1200 cropped webp via
  attention-crop). Hand-exporting a `thumb.webp` will silently freeze any GIF-sourced
  thumbnail, or — if you export it oversized — reintroduce the multi-megabyte grid-lag bug.
  See `docs/ASSET_GUIDE.md` for both fixes and the exact size constants.
- **Journal `thumbnail` (grid card) and `image` (post hero) are separate fields/assets.**
  `JournalLayout.astro` renders `data.image` (the original, uncropped source) as the post
  hero and only falls back to `thumbnail` for video-only posts with no local image. The
  generator script writes both automatically — see `docs/JOURNAL_SYSTEM.md`.
- **Portrait/cover project heroes (`heroAspect: "auto"`) are width- and height-capped** in
  `src/styles/layout.css` (`.project-hero__image:not([data-aspect])`) so a tall book cover
  doesn't render 1500px+ tall on desktop. Fixed-aspect heroes (`16:9`/`4:3`/`4:5`/`1:1`) are
  unaffected — don't "fix" this by touching the fixed-aspect rules.
  - `illustration/index.astro` only routes a project to its own `/illustration/[slug]` page
    if it has a non-empty `gallery` **or** a non-empty `links` array — otherwise it renders
    as a lightbox-only card with no detail page. See `docs/CONTENT_MODEL.md`.
- **The nav logo auto-sizes via CSS** (`height: 44px`/`38px`; `width: auto` in
  `src/styles/nav.css`) — never manually resize a logo file before dropping it into
  `public/logos/`. Prefer SVG; check a fresh export isn't a raster image smuggled inside an
  `<svg>` wrapper (defeats scaling).
- **Never test `BASE_PATH`/`SITE_URL` overrides in Git Bash on Windows.** MSYS silently
  mangles `BASE_PATH=/` into a Windows filesystem path before Node sees it, which breaks
  static-path generation for at least one route with a confusing `Missing parameter: slug`
  error. Use PowerShell, or just `npm run build` with no overrides (the defaults already
  match production). See `docs/DEPLOYMENT.md`.
- **The live domain's GoDaddy DNS zone also carries active Google Workspace email** (MX/SPF/
  DKIM/DMARC) plus several GoDaddy email/payment CNAMEs. Only the 4 apex `A` records and the
  `www` `CNAME` are website-related — see `docs/DEPLOYMENT.md` for the full list of what not
  to touch before making any DNS change.

## Design Cautions

- Preserve the handmade grid and bubble direction unless intentionally redesigning.
- Keep body copy readable with the clean system body font.
- Avoid making every navigation animation heavy.
- Keep mobile first: 1-column grids by default, tap targets at least 44px.
- Keep animations optional for reduced-motion users.

## Student Work Caution

Do not publish student work until permissions, attribution preferences, accessibility requirements, and relevant institutional policies are confirmed.
