import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const TARGET_W = 1600;
const TARGET_H = 1200;

// Animated (GIF-sourced) thumbnails are far more expensive per pixel than static ones —
// every frame gets re-encoded at the target size. Keep these small: grid cards only ever
// render a few hundred px wide, so this is still plenty sharp.
const GIF_THUMB_W = 640;
const GIF_THUMB_H = 480;
const GIF_THUMB_QUALITY = 65;

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
      .resize({ width: GIF_THUMB_W, height: GIF_THUMB_H, fit: "cover", position: "centre" })
      .webp({ quality: GIF_THUMB_QUALITY })
      .toFile(outPath);
    return;
  }
  await sharp(srcPath)
    .resize({ width: TARGET_W, height: TARGET_H, fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 82 })
    .toFile(outPath);
}

function toPublicUrl(filePath) {
  return `/${path.relative("public", filePath).split(path.sep).join("/")}`;
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
      await updateFrontmatter(dir, toPublicUrl(thumbPath), toPublicUrl(srcPath));
    } catch (err) {
      console.error(`FAIL ${dir}: ${err.message}`);
    }
  }
}

function upsertField(content, field, value) {
  const fieldRe = new RegExp(`\\n${field}: "[^"]*"\\n`);
  if (fieldRe.test(content)) {
    return content.replace(fieldRe, `\n${field}: "${value}"\n`);
  }
  // Insert right after the thumbnail line so field order stays predictable.
  return content.replace(/\nthumbnail: "[^"]*"\n/, (match) => `${match}${field}: "${value}"\n`);
}

async function updateIllustrationFrontmatter(slug, thumbUrl) {
  const mdPath = `src/content/projects/${slug}.md`;
  const content = await readFile(mdPath, "utf8");
  const updated = upsertField(content, "thumbnail", thumbUrl);
  if (updated !== content) await writeFile(mdPath, updated, "utf8");
}

async function updateJournalFrontmatter(slug, thumbUrl, imageUrl) {
  const mdPath = `src/content/journal/${slug}.mdx`;
  const content = await readFile(mdPath, "utf8");
  let updated = upsertField(content, "thumbnail", thumbUrl);
  updated = upsertField(updated, "image", imageUrl);
  if (updated !== content) await writeFile(mdPath, updated, "utf8");
}

console.log("--- Illustration ---");
await processSection("public/images/illustration", "hero", updateIllustrationFrontmatter);

console.log("--- Journal ---");
await processSection("public/images/journal", "image-1", updateJournalFrontmatter);

console.log("Done.");
