import { readFile, writeFile } from "node:fs/promises";

function yamlList(key, items) {
  if (items.length === 0) return "";
  return `${key}:\n${items.map((i) => `  - "${i}"`).join("\n")}\n`;
}

function paths(slug, from, to) {
  const out = [];
  for (let i = from; i <= to; i++) {
    out.push(`/images/motion/${slug}/storyboards/storyboard-${String(i).padStart(3, "0")}.webp`);
  }
  return out;
}

const jobs = [
  {
    slug: "hell-on-wheels",
    storyboards: [],
    conceptArt: paths("hell-on-wheels", 1, 2)
  },
  {
    slug: "caracol-cruzando",
    storyboards: paths("caracol-cruzando", 1, 17),
    conceptArt: []
  },
  {
    slug: "lcx-2017",
    storyboards: paths("lcx-2017", 1, 52),
    conceptArt: paths("lcx-2017", 53, 56)
  },
  {
    slug: "doctors-for-immigrants",
    storyboards: paths("doctors-for-immigrants", 1, 190),
    conceptArt: []
  }
];

for (const { slug, storyboards, conceptArt } of jobs) {
  const mdPath = `src/content/projects/${slug}.md`;
  const content = await readFile(mdPath, "utf8");

  // Remove the old `gallery:` block (a `gallery:` line followed by `  - "..."` lines)
  const withoutOldGallery = content.replace(/gallery:\n(?:  - "[^"]*"\n)+/, "");

  const block = yamlList("storyboards", storyboards) + yamlList("conceptArt", conceptArt);

  const updated = withoutOldGallery.replace(/\norder: (\d+)\n---/, `\n${block}order: $1\n---`);

  if (updated === content) {
    console.error(`${slug}: no changes made, check pattern`);
    continue;
  }

  await writeFile(mdPath, updated, "utf8");
  console.log(`${slug}: storyboards=${storyboards.length} conceptArt=${conceptArt.length}`);
}
