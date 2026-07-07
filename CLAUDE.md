# Claude Code Handoff Notes

This is the Dustooned.com Astro + MDX portfolio rebuild.

Start by reading:

1. `docs/HANDOFF.md`
2. `docs/BUILD_CHRONICLE.md`
3. `docs/DEPLOYMENT.md`

Immediate next task:

1. Verify the live GitHub Pages deployment at `https://dustooned.github.io/dustooned/`.
2. Confirm the latest `Deploy to GitHub Pages` workflow passed in GitHub Actions.
3. If the site is plain/static text, set repository Settings -> Pages -> Source to `GitHub Actions`.
4. Once live deploy is confirmed, replace one placeholder Illustration project with a real project and validate with `npm run build`.

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
- GitHub Pages must deploy through GitHub Actions, not branch-root publishing.
- The temporary GitHub Pages URL uses `/dustooned/` as its base path.
- Preserve reduced-motion support for transitions and background animation.

Current active visual direction:

- `VISUAL_MOOD = "poster"` in `src/config/site.ts`
- handmade grid background
- rising bubble layer with passive mouse interaction
- palette fade page transitions
- Walter Turncoat display font for large type and card titles

Before finishing any change:

```sh
npm run build
git status --short --branch
```
