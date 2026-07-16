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

## Custom Domain (live as of 2026-07-15)

The site is live at the custom domain:

```txt
https://www.dustooned.com
```

The workflow builds with:

```txt
SITE_URL=https://www.dustooned.com
BASE_PATH=/
```

`public/CNAME` (contents: `www.dustooned.com`) is committed to the repo and gets copied into
`dist/CNAME` on every build — GitHub Pages reads this from the deployed artifact to know the
custom domain. Repo Settings -> Pages -> Custom domain is also set to `www.dustooned.com`
(this is a separate, manual step in GitHub's UI; it's what triggers DNS verification and SSL
certificate provisioning, and isn't something a code change can do).

The site previously ran as a GitHub Pages *project* site at
`https://dustooned.github.io/dustooned/`, which required `BASE_PATH=/dustooned` — without
that prefix, built CSS/JS/image links pointed at `/` and the deployed site looked like plain
static text. That prefix requirement is gone now that a custom domain is configured; GitHub
Pages serves custom-domain sites from the root regardless of project-vs-user repo. If you ever
see the live site rendering unstyled with 404s on paths like `/dustooned/_astro/...css`, that
means `BASE_PATH` got reverted to `/dustooned` (or `SITE_URL` reverted to the `.github.io`
URL) — check `.github/workflows/deploy.yml` first.

### DNS (GoDaddy)

DNS is hosted at GoDaddy (`ns15`/`ns16.domaincontrol.com`). The apex `dustooned.com` points at
GitHub Pages via 4 A records, and `www` is a CNAME to GitHub's project subdomain:

```txt
A       @     185.199.108.153
A       @     185.199.109.153
A       @     185.199.110.153
A       @     185.199.111.153
CNAME   www   dustooned.github.io.
```

Before this, those 4 A records pointed at Squarespace's IPs (`198.185.159.144/145`,
`198.49.23.144/145`) and `www` CNAME'd to `ext-sq.squarespace.com.` — the domain was
previously serving a Squarespace site.

**Do not touch any other record in that DNS zone without confirming first.** The zone also
carries live Google Workspace email (MX to `aspmx.l.google.com` + friends, SPF, DKIM, DMARC),
a Microsoft 365 tenant-verification TXT, and several GoDaddy email/payment CNAMEs (`mail`,
`smtp`, `pop`, `imap`, `webmail`, `mobilemail`, `pda`, `pay`, `e`, `email`, `ftp`,
`k2._domainkey`, `k3._domainkey`). None of that is related to which server serves the
website — it's all mail routing/auth and GoDaddy account infrastructure. Editing it risks
breaking `@dustooned.com` email. One inert leftover, `pnlxgpx4zcf5a5333cyx` CNAME ->
`verify.squarespace.com.`, is a dead Squarespace ownership-verification record — harmless,
safe to delete later, not required for anything.

## Validation

Before pushing deployment-related changes:

```sh
npm run build
```

To test with explicit `SITE_URL`/`BASE_PATH` overrides locally, **use PowerShell, not Git
Bash**:

```powershell
$env:SITE_URL='https://www.dustooned.com'
$env:BASE_PATH='/'
npm run build
Remove-Item Env:\SITE_URL
Remove-Item Env:\BASE_PATH
```

### Gotcha: Git Bash on Windows silently mangles `BASE_PATH=/`

MSYS (Git Bash's POSIX layer) auto-converts command-line/env-var values that look like POSIX
paths into Windows paths before the child process ever sees them. `BASE_PATH=/ npm run build`
in Git Bash does **not** set `BASE_PATH` to `"/"` — it silently becomes something like
`C:/Program Files/Git/`, which breaks `getStaticPaths` for at least one route (symptom:
`TypeError: Missing parameter: slug` on a specific `/illustration/[slug]` page during build,
non-deterministic-looking because it depends on which route the mangled base happens to
corrupt). Confirm with `BASE_PATH=/ node -e "console.log(process.env.BASE_PATH)"` if you ever
see this — if it prints a Windows path instead of `/`, that's the cause, not a real bug in the
site. Use PowerShell (as above) or plain `npm run build` (defaults already resolve to the
custom-domain values) for local testing instead.

After a build, inspect `dist/index.html` and confirm asset links are root-relative:

```txt
/_astro/...
```

not prefixed with `/dustooned/`.

### Gotcha: a browser tab can look "still broken" after a successful deploy

After the domain cutover, the live server was serving the corrected build (verified via a
cache-busted `fetch(..., { cache: "no-store" })`), but an already-open browser tab kept
re-requesting the old cached HTML/asset paths and looked broken. This is a normal browser
caching artifact, not a deploy failure — a hard refresh (Ctrl+Shift+R) or a fresh tab resolves
it. Don't assume a "still looks broken" report means the deploy failed; check the server
response directly (or a fresh incognito load) before debugging the workflow.
