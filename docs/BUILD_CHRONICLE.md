# Build Chronicle

This document records how the current Dustooned Astro site skeleton was built and why the major decisions were made.

## Starting Brief

The project began from `docs/Dustooned_Master_Codex_Website_Infrastructure_Spec.md`.

The goal was to create a static-first Astro + MDX portfolio infrastructure for Dustooned.com with clean content editing, predictable asset folders, responsive navigation, and enough documentation for another coding tool or developer to continue safely.

## Initial Infrastructure

The first scaffold created:

- Astro 7 with MDX
- TypeScript config
- Astro Content Collections using the current `src/content.config.ts` format
- `projects` collection for Motion, Illustration, and Interactive
- `journal` collection for MDX posts
- Global CSS split into tokens, layout, cards, navigation, lightbox, and moods
- Placeholder SVG image assets
- Placeholder logo SVGs
- Sample content for 2 Motion, 2 Illustration, 2 Interactive, and 2 Journal entries
- Static About and Contact pages
- CV and Resume placeholder pages
- Documentation in `docs/`

The site was first built in a nested `dustooned-site/` folder, then promoted to the repository root so deploy tools can treat the repo as a normal Astro site.

## Main Routes

Current routes:

- `/`
- `/motion`
- `/illustration`
- `/illustration/[slug]`
- `/interactive`
- `/interactive/[slug]`
- `/journal`
- `/journal/[slug]`
- `/about`
- `/contact`
- `/cv`
- `/resume`

External navigation:

- Sequential -> `https://www.staytoonedgfx.com/`
- Education -> `https://github.com/dustooned/lbcc-student-work`

## Homepage Hero

The homepage no longer has a manually-curated "Featured Work" grid. Instead:

- `src/components/Hero.astro` — full-bleed hero with a video/gif slot (`HERO.videoSrc` in
  `src/config/site.ts`), white welcome text over a dark gradient scrim, and two CTAs (Journal
  and an in-page anchor to Explore). Falls back to an animated gradient placeholder until a
  real video/gif is dropped in.
- "Explore" — the section gateway cards, doubling as the primary "how to look around" nav.
- "What's New" — latest 3 journal posts, since journal is the actual latest-activity feed.

## Design Direction

The visual system started neutral and then moved toward a handmade/crafted direction.

Current active mood:

```ts
export const VISUAL_MOOD = "poster";
```

This is controlled in `src/config/site.ts`.

The active `poster` mood currently includes:

- warm paper background
- colored graph/grid background
- rising bubble layer
- slight mouse-reactive bubble offset
- stronger hand-framed card borders
- darker box shadows
- Walter Turncoat display font through Google Fonts
- clean system body font for readable copy

The mood styles live in `src/styles/moods.css`.

## Background Bubbles

Originally a single CSS `body::before` layer with baked-in radial-gradient positions, animated
as one unit. Reworked into independent DOM elements because a single shared layer made every
bubble shift together on pointer move, which read as mechanical rather than organic.

`src/components/BubbleInteraction.astro` now server-renders ~18 `<span class="bubble">`
elements at build time, each with randomized (via `Math.random()`) size, horizontal position,
rise duration/delay, wobble duration/delay, and — the key part — its own `--parallax`
multiplier (roughly -1.6 to 1.6, mixed sign). A single pointer-tracked `--bubble-mouse-x`
CSS var is set on `documentElement`; each bubble multiplies that shared value by its own
parallax factor, so pointer movement scatters bubbles independently instead of shifting them
as one block. Rise motion animates `bottom`, wobble animates `margin-left`, and parallax
animates `transform` — three separate properties so none of the animations fight each other.

Styles live in `src/styles/moods.css` (`.bubble-field`, `.bubble`, `.bubble--a`/`.bubble--b`).
Reduced-motion users get no animation and no parallax transform.

## Page Transitions

The transition system lives in `src/components/PageTransition.astro` and `src/styles/global.css`.

History:

1. Started as a white fade.
2. Tested a turbulent torn ellipse wipe.
3. Reverted to a faster palette fade because the torn wipe made routine navigation feel heavy.

Current behavior:

- internal links fade out with a deterministic palette color
- next page fades in using that same color
- external links, downloads, new-tab links, and same-page hash links are ignored
- reduced-motion users navigate immediately

## Motion Content

All 12 Motion sample/placeholder projects have been replaced with real projects (real titles,
descriptions, and YouTube videos). Two schema/behavior additions came out of this:

- **Episodes**: `episodes?: { label: string; videoUrl: string }[]` on the projects schema.
  When a project has 2+ episodes, `MotionLightbox.astro` renders a row of pill toggle buttons
  that swap the embedded video without closing the modal. Projects with 0-1 episodes show no
  toggle row. Used for multi-part videos (e.g. "The ReUp", "Diaspora Rising").
- **Thumbnails from YouTube**: motion project `thumbnail` fields point directly at
  `https://img.youtube.com/vi/{id}/hqdefault.jpg` rather than custom-drawn assets — the video
  itself is the source image, so there's no separate thumbnail to keep in sync.
- Lightbox videos do **not** autoplay (`youtubeEmbedUrl()` no longer appends `?autoplay=1`).
- Lightbox body text (title, meta, description, tags, episode toggle row) is centered with a
  56ch max-width on paragraphs, since several real descriptions run longer than the original
  one-line placeholders.

## Newsletter

`src/components/NewsletterSignup.astro` renders a global newsletter placeholder above the footer on every page.

It currently includes:

- placeholder image
- subscription invitation
- "No spam ever" copy
- placeholder button linking to Contact

This is intentionally not wired to a provider yet.

The media icon originally scaled with its grid column (`minmax(240px, 0.42fr)`), which made it
balloon to 500px+ on wide viewports. It's now capped at a fixed 160px square
(`.newsletter-band__media` in `src/styles/layout.css`), with `justify-items: start` on the
copy column so the button doesn't stretch to fill the now-wider column (CSS grid stretches
children by default).

## GitHub Pages

The repo deploys through GitHub Actions, not branch-root publishing.

Workflow:

```txt
.github/workflows/deploy.yml
```

The workflow builds Astro and uploads `dist/` as the Pages artifact.

For the temporary project URL, the workflow sets:

```txt
SITE_URL=https://dustooned.github.io
BASE_PATH=/dustooned
```

This is required because the temporary Pages URL is:

```txt
https://dustooned.github.io/dustooned/
```

Without that base path, the site appears as unstyled/static text because CSS, JS, images, and internal links point to the wrong root.

When the final custom domain is ready, update the deployment setup so the site builds for:

```txt
https://www.dustooned.com
```

### Jekyll workflow conflict (resolved)

Repository Settings -> Pages -> Source was set to `Deploy from a branch`, which made GitHub
run its own automatic Jekyll `pages-build-deployment` workflow on every push, in parallel with
our custom `Deploy to GitHub Pages` Actions workflow. Both targeted the same `github-pages`
Pages environment, so which deploy actually went live was a race condition. It usually worked
out (ours tended to finish and "win"), but the Jekyll workflow eventually failed outright on a
manual re-run, since this isn't a Jekyll site. Fixed by switching Source to `GitHub Actions` in
repo settings, which stops the Jekyll workflow from running at all. See `docs/HANDOFF.md`
Deployment section for the recovery steps if this setting ever reverts.

## Commit Timeline

Commit history moves fast; `git log --oneline` is the source of truth. Meaningful milestones
since the initial scaffold: homepage hero + organic per-bubble motion, real About bio, 12 real
Motion projects with multi-episode lightbox support, YouTube-derived thumbnails, no-autoplay
lightbox, centered lightbox text, newsletter band resize, and the GitHub Pages Source fix
above.

## Current Validation

Current known-good command:

```sh
npm run build
```

The build generates 15 static pages.

For local development:

```sh
npm install
npm run dev
```

Local URL:

```txt
http://127.0.0.1:4321/
```

## 2026-07-15: Illustration simplification, GIF thumbnail fix, hero sizing, logo

Several small fixes landed together:

- **`links` schema field added to projects** (`src/content.config.ts`): an array of
  `{ label, href }` rendered as extra `ExternalLinkButton`s on a project's detail page
  (`ProjectLayout.astro`), on top of the existing single `projectUrl`/`videoUrl` buttons.
  Walo and Masks were rewritten to use it — cover image + description only (no page-by-page
  gallery), with buttons pointing out to Kickstarter/StayToonedGFX/Motion instead. Masks now
  also has no internal comic gallery; it's a pointer out to StayToonedGFX plus the existing
  Motion trailer. `illustration/index.astro`'s routing condition changed from
  `gallery.length > 0` to `gallery.length > 0 || links.length > 0`, since a `links`-only
  project (empty gallery) still needs a real detail page to show its buttons on.

- **Animated GIF thumbnails were being frozen.** `scripts/generate-smart-thumbnails.mjs`
  always passed `{ animated: false }` to sharp for GIF sources, baking a single static frame
  into `thumb.webp`. Since `JournalLayout.astro` reuses `thumbnail` as the journal post's
  hero image (not just the grid card), this froze GIF-sourced posts both in the `/journal`
  grid and on the post page itself. Fixed to generate an animated webp
  (`sharp(src, { animated: true })`, `position: "centre"` since attention-crop doesn't
  support animated sources) when the source is a `.gif`. Regenerated thumbnails for all
  affected assets: `it-gif`, `dos-alas-studios-gifs`, `grandmas-room`, `grandmas-room-1`,
  `paiz-animation`, `riddickula`, `some-more-roughs`, `tucker-animation`.

- **Oversized portrait hero images on desktop.** Illustration entries with
  `heroAspect: "auto"` (book covers) had no aspect-ratio constraint and rendered at
  `width: 100%` of the ~1040px wide-shell, which could push a tall cover to 1500px+ of
  height. Added `.project-hero__image:not([data-aspect])` in `src/styles/layout.css`
  capping to `max-width: min(100%, 480px); max-height: 70vh; object-fit: contain;`, centered.
  Fixed-aspect heroes (16:9/4:3/4:5/1:1) were untouched.

- **YouTube-sourced journal thumbnails.** "Dialog Boxes" and "Tik Tok Men - Luke Warm" journal
  posts had no thumbnail; both embed a YouTube video via `RawPostInsert`, so their
  `thumbnail` now points directly at `https://img.youtube.com/vi/{id}/hqdefault.jpg`, same
  convention Motion already used — no local asset generated.

- **Final logo dropped in.** `public/logos/logo.svg` replaced with a real vector export
  (`viewBox 0 0 1500 1502`, no embedded raster). No code changes needed — nav CSS already
  auto-sizes the logo (`height: 44px`/`38px`; `width: auto`).

See `docs/CONTENT_MODEL.md`, `docs/ASSET_GUIDE.md`, `docs/JOURNAL_SYSTEM.md`, and
`docs/HANDOFF.md` for the corresponding reference docs and gotchas.

## 2026-07-15 (later): Fix animated-GIF thumbnail lag, decouple journal hero from grid thumb

Follow-up to the same day's GIF-thumbnail-freeze fix — the fix itself introduced a
performance regression, plus a separate long-standing issue surfaced:

- **GIF thumbnails were lagging/loading slowly** (reported specifically on Tucker Animation
  and Paiz Animation). Root cause: the earlier fix generated animated `thumb.webp` at the
  same 1600x1200 size used for static thumbnails. Animated-webp cost scales with pixel count
  per frame, so this produced multi-megabyte files — Paiz Animation's thumbnail alone was
  ~8MB, Grandma's Room ~10.5MB. Added a separate, much smaller target specifically for GIF
  sources in `scripts/generate-smart-thumbnails.mjs` (`GIF_THUMB_W/H = 640x480`, quality 65
  vs. 1600x1200/82 for static sources) and regenerated all affected thumbnails — sizes
  dropped roughly 4-6x across the board (e.g. Tucker Animation 3.4MB → 892KB, Paiz Animation
  8MB → 1.77MB).

- **Journal post pages were showing the cropped grid thumbnail as the hero, not the original
  image.** `JournalLayout.astro` had always rendered `data.thumbnail` — the same cropped
  1600x1200 "cover"-fit asset used in the `/journal` grid — as the large image at the top of
  the post itself. Added a new optional `image` field to the journal schema
  (`src/content.config.ts`) pointing at the original, unresized `image-1.*` source file.
  `generate-smart-thumbnails.mjs` now writes both `thumbnail` and `image` frontmatter fields
  for any journal post with a local source image; `JournalLayout.astro` renders
  `data.image ?? data.thumbnail`, falling back to the grid thumbnail only for video-embed
  posts that have no local image (e.g. Dialog Boxes, Tik Tok Men — Luke Warm, which use a
  YouTube thumbnail instead). The post hero already gets the desktop-width/height cap added
  earlier (`.project-hero__image:not([data-aspect])` in `layout.css`), so this doesn't
  reintroduce the oversized-image problem.

See `docs/ASSET_GUIDE.md` and `docs/JOURNAL_SYSTEM.md` for the updated reference docs.

## Next Best Work

Recommended next steps:

- replace placeholder Illustration projects with real ones (thumbnail, hero, gallery, description)
- replace placeholder Interactive projects with real ones
- replace Contact, CV, and Resume placeholder copy
- choose final newsletter provider or keep it as a static callout
- review mobile behavior with real content
- update final custom domain deployment once DNS is ready
