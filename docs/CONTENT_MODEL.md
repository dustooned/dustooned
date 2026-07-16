# Content Model

Astro Content Collections power projects and journal posts.

## Projects

Projects live in `src/content/projects/`.

Supported sections:

- `motion`
- `illustration`
- `interactive`

Motion projects use `videoUrl`. Illustration and Interactive projects use generated detail pages.

### External link buttons (`links`)

Any project can carry a `links` array for custom-labeled external buttons on its detail page,
in addition to (or instead of) `projectUrl`/`videoUrl`:

```yaml
links:
  - label: "Successfully Backed on Kickstarter"
    href: "https://..."
  - label: "Official Website"
    href: "https://..."
```

`ProjectLayout.astro` renders one `ExternalLinkButton` per entry, after the `projectUrl`/
`videoUrl` buttons. Use this for projects that live primarily elsewhere (e.g. Walo and Masks
point out to StayToonedGFX) instead of building out a full internal gallery page. Placeholder
links can use `href: "#"` until the real URL exists — swap them in later, no schema change
needed.

### Gotcha: `links` changes which grid a project renders as

`src/pages/illustration/index.astro` decides whether a card links to a full detail page or
opens as an inline image lightbox:

```js
project.data.gallery.length > 0 || project.data.links.length > 0
  ? /* links to /illustration/[slug] detail page */
  : /* isImageLightbox card, opens hero/thumbnail in a modal, no detail page */
```

A project with an empty `gallery` and no `links` never gets a routable detail page — adding a
`links` entry (even a single placeholder) is what turns a plain lightbox card into a real page
with buttons. This is how Walo/Masks work: `gallery: []` (just a cover image as the hero, no
page-by-page gallery) but `links: [...]` still routes them to a real `/illustration/[slug]`
page.

## Journal

Journal posts live in `src/content/journal/` as MDX.

Use MDX when a post needs custom blocks, imports, or future embeds.
