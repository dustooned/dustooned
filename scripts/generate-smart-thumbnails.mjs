import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const TARGET_W = 1600;
const TARGET_H = 1200;

async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function generateThumb(srcPath, outPath) {
  const isGif = srcPath.toLowerCase().endsWith(".gif");
  if (isGif) {
    await sharp(srcPath, { animated: true })
      .resize({ width: TARGET_W, height: TARGET_H, fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toFile(outPath);
    return;
  }
  await sharp(srcPath)
    .resize({ width: TARGET_W, height: TARGET_H, fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 82 })
    .toFile(outPath);
}

async function processSection(baseDir, sourceFileName, updateFrontmatter) {
  const dirs = (await readdir(baseDir)).filter((d) => !d.startsWith("_"));
  for (const dir of dirs) {
    const dirPath = path.join(baseDir, dir);
    if (!(await isDir(dirPath))) continue;

    const files = await readdir(dirPath);
    const sourceFile = files.find((f) => f.startsWith(sourceFileName));
    if (!sourceFile) {
      console.log(`SKIP ${dir}: no ${sourceFileName}.* found`);
      continue;
    }

    const srcPath = path.join(dirPath, sourceFile);
    const thumbPath = path.join(dirPath, "thumb.webp");

    try {
      await generateThumb(srcPath, thumbPath);
      console.log(`OK   ${dir}`);
      await updateFrontmatter(dir, `/${path.relative("public", thumbPath).split(path.sep).join("/")}`);
    } catch (err) {
      console.error(`FAIL ${dir}: ${err.message}`);
    }
  }
}

async function updateIllustrationFrontmatter(slug, thumbUrl) {
  const mdPath = `src/content/projects/${slug}.md`;
  const content = await readFile(mdPath, "utf8");
  const updated = content.replace(/\nthumbnail: "[^"]*"\n/, `\nthumbnail: "${thumbUrl}"\n`);
  if (updated !== content) await writeFile(mdPath, updated, "utf8");
}

async function updateJournalFrontmatter(slug, thumbUrl) {
  const mdPath = `src/content/journal/${slug}.mdx`;
  const content = await readFile(mdPath, "utf8");
  const updated = content.replace(/\nthumbnail: "[^"]*"\n/, `\nthumbnail: "${thumbUrl}"\n`);
  if (updated !== content) await writeFile(mdPath, updated, "utf8");
}

console.log("--- Illustration ---");
await processSection("public/images/illustration", "hero", updateIllustrationFrontmatter);

console.log("--- Journal ---");
await processSection("public/images/journal", "image-1", updateJournalFrontmatter);

console.log("Done.");
