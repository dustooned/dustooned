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

The bubble background is CSS-driven and lives on `body::before` in `src/styles/moods.css`.

Behavior:

- bubbles rise upward infinitely on the Y axis
- movement is passive and decorative
- a tiny script offsets the bubble layer on the X axis in response to pointer movement
- the offset eases back toward normal flow
- reduced-motion users do not get animation/interactivity

The pointer script is `src/components/BubbleInteraction.astro`, loaded from `src/layouts/BaseLayout.astro`.

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

## Newsletter

`src/components/NewsletterSignup.astro` renders a global newsletter placeholder above the footer on every page.

It currently includes:

- placeholder image
- subscription invitation
- "No spam ever" copy
- placeholder button linking to Contact

This is intentionally not wired to a provider yet.

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

## Commit Timeline

Recent meaningful commits:

```txt
3957592 Initial Astro portfolio scaffold
df8e7d5 Tune handmade background and shadows
e4041a3 Make background bubbles rise upward
80cfcf6 Add turbulent ellipse page transition
cba0099 Simplify page transition to palette fade
8cad469 Add passive mouse interaction to background bubbles
8c81fbc Add GitHub Pages deploy workflow
23764e4 Fix GitHub Pages base paths
```

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

## Next Best Work

Recommended next steps:

- replace placeholder projects with one real Illustration project
- test real images in cards and detail pages
- replace placeholder Motion YouTube URLs
- replace About, Contact, CV, and Resume placeholder copy
- choose final newsletter provider or keep it as a static callout
- review mobile behavior with real content
- update final custom domain deployment once DNS is ready
