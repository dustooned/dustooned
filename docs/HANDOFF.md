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
- `src/components/BubbleInteraction.astro`: passive mouse interaction for background bubbles
- `src/styles/moods.css`: handmade visual direction
- `.github/workflows/deploy.yml`: GitHub Pages deploy workflow

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

GitHub Pages should use:

```txt
Source: GitHub Actions
```

Do not use:

```txt
Deploy from a branch
```

The branch-root mode will not correctly serve the Astro build.

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

## Known Placeholder Areas

These are intentionally unfinished:

- real project thumbnails and hero images
- real project descriptions
- Motion YouTube URLs
- About page copy
- Contact page copy
- CV page text
- Resume page text
- newsletter provider/integration
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
