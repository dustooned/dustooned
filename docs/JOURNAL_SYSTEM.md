# Journal System

Journal posts are MDX files in `src/content/journal/`.

Required fields:

- `title`
- `date`
- `excerpt`

Optional fields:

- `thumbnail`
- `tags`
- `featured`

Use `RawPostInsert.astro` for intentionally custom inserted blocks.

Do not execute arbitrary external scripts by default. Iframes and embeds should be reviewed before publishing.
