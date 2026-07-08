# Deployment Notes

This project is deployed as a static Astro site.

## Local Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages

GitHub Pages must deploy through GitHub Actions.

In repository settings:

```txt
Settings -> Pages -> Source -> GitHub Actions
```

Do not use `Deploy from a branch` for this Astro site. This is confirmed set correctly as of
2026-07-08 — it was previously misconfigured as `Deploy from a branch`, which caused GitHub's
automatic Jekyll `pages-build-deployment` workflow to run in parallel with the real deploy
workflow on every push (race condition, eventually failed outright since this isn't a Jekyll
site). If a live deploy ever looks stale or a `pages-build-deployment` run appears in Actions,
re-check this setting first.

## Workflow

Deployment workflow:

```txt
.github/workflows/deploy.yml
```

The workflow:

1. checks out the repo
2. installs Node 22
3. runs `npm ci`
4. runs `npm run build`
5. uploads `dist/`
6. deploys the Pages artifact

## Temporary GitHub Pages URL

Current temporary project URL:

```txt
https://dustooned.github.io/dustooned/
```

Because this is a project page, the workflow builds with:

```txt
SITE_URL=https://dustooned.github.io
BASE_PATH=/dustooned
```

The `BASE_PATH` is important. Without it, built CSS/JS/image links point to `/` and the deployed site can look like plain static text.

## Final Custom Domain

Intended final domain:

```txt
https://www.dustooned.com
```

When moving to the custom domain, update deployment settings and verify whether the workflow should remove `BASE_PATH` and use:

```txt
SITE_URL=https://www.dustooned.com
BASE_PATH=/
```

Also configure DNS and GitHub Pages custom domain settings at that time.

## Validation

Before pushing deployment-related changes:

```sh
npm run build
```

To test the project-page build locally from PowerShell:

```powershell
$env:SITE_URL='https://dustooned.github.io'
$env:BASE_PATH='/dustooned'
npm run build
Remove-Item Env:\SITE_URL
Remove-Item Env:\BASE_PATH
```

After that build, inspect `dist/index.html` and confirm asset links begin with:

```txt
/dustooned/
```
