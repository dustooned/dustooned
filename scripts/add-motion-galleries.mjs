import { readFile, writeFile, readdir } from "node:fs/promises";

const slugs = ["hell-on-wheels", "caracol-cruzando", "lcx-2017", "doctors-for-immigrants"];

for (const slug of slugs) {
  const dir = `public/images/motion/${slug}/storyboards`;
  const files = (await readdir(dir)).filter((f) => f.endsWith(".webp")).sort();
  const galleryLines = files.map((f) => `  - "/images/motion/${slug}/storyboards/${f}"`).join("\n");

  const mdPath = `src/content/projects/${slug}.md`;
  const content = await readFile(mdPath, "utf8");

  if (content.includes("\ngallery:")) {
    console.log(`${slug}: already has a gallery field, skipping`);
    continue;
  }

  const updated = content.replace(/\norder: (\d+)\n---/, `\ngallery:\n${galleryLines}\norder: $1\n---`);

  if (updated === content) {
    console.error(`${slug}: pattern not matched, no changes made`);
    continue;
  }

  await writeFile(mdPath, updated, "utf8");
  console.log(`${slug}: added ${files.length} gallery images`);
}
