import sharp from "sharp";
import { readdir, stat, readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const TARGET_W = 1600;
const TARGET_H = 1200;

// Animated (GIF-sourced) thumbnails are far more expensive per pixel than static ones —
// every frame gets re-encoded at the target size. Keep these small: grid cards only ever
// render a few hundred px wide, so this is still plenty sharp.
const GIF_THUMB_W = 640;
const GIF_THUMB_H = 480;
const GIF_THUMB_QUALITY = 65;

// Raw GIF sources are full-resolution and often 25-85+ frames — a browser has to keep
// decoding/repainting every frame continuously, which causes visible scroll jank if that's
// used directly as a post's large hero image. Decode/repaint cost scales with pixel count x
// frame count, not file size, so the fix is shrinking resolution, not just re-encoding.
// 640px matches the grid thumbnail's proven-fine width (the hero only displays at up to
// 480px wide anyway, see layout.css's .project-hero__image:not([data-aspect]) cap).
const GIF_HERO_MAX_EDGE = 640;
const GIF_HERO_QUALITY = 70;

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

async function generateGifHero(srcPath, outPath) {
  await sharp(srcPath, { animated: true })
    .resize({ width: GIF_HERO_MAX_EDGE, height: GIF_HERO_MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: GIF_HERO_QUALITY })
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
    const isGif = sourceFile.toLowerCase().endsWith(".gif");

    try {
      await generateThumb(srcPath, thumbPath);

      let imageSrcPath = srcPath;
      if (isGif) {
        const heroPath = path.join(dirPath, "hero.webp");
        await generateGifHero(srcPath, heroPath);
        // Shrinking resolution always cuts decode/repaint cost, but animated webp isn't
        // always smaller in bytes than the source gif (palette-heavy flat-color art can go
        // the other way) — keep whichever file is actually smaller.
        const [rawSize, webpSize] = await Promise.all([
          stat(srcPath).then((s) => s.size),
          stat(heroPath).then((s) => s.size)
        ]);
        if (webpSize < rawSize) {
          imageSrcPath = heroPath;
        } else {
          await unlink(heroPath);
        }
      }

      console.log(`OK   ${dir}`);
      await updateFrontmatter(dir, toPublicUrl(thumbPath), toPublicUrl(imageSrcPath));
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

async function optimizeGalleryGif(srcPath) {
  const dir = path.dirname(srcPath);
  const base = path.basename(srcPath, path.extname(srcPath));
  const outPath = path.join(dir, `${base}.webp`);

  await generateGifHero(srcPath, outPath);

  const [rawSize, webpSize] = await Promise.all([
    stat(srcPath).then((s) => s.size),
    stat(outPath).then((s) => s.size)
  ]);

  if (webpSize < rawSize) {
    return outPath;
  }
  await unlink(outPath);
  return null;
}

// MediaGallery embeds in journal MDX bodies reference raw source images directly (not
// through the thumbnail/hero pipeline above). Any additional gif beyond the post's main
// image-1 is just as expensive to keep animating on scroll — e.g. a gallery of 7 raw gifs
// on one page. Optimize those too and rewrite the MDX gallery array in place.
async function processJournalGalleryGifs(baseDir) {
  const dirs = (await readdir(baseDir)).filter((d) => !d.startsWith("_"));
  for (const dir of dirs) {
    const dirPath = path.join(baseDir, dir);
    if (!(await isDir(dirPath))) continue;

    const files = await readdir(dirPath);
    const galleryGifs = files.filter((f) => /^image-\d+\.gif$/i.test(f) && f !== "image-1.gif");
    if (galleryGifs.length === 0) continue;

    const mdPath = `src/content/journal/${dir}.mdx`;
    let content;
    try {
      content = await readFile(mdPath, "utf8");
    } catch {
      continue;
    }

    let updated = content;
    for (const file of galleryGifs) {
      const srcPath = path.join(dirPath, file);
      const optimizedPath = await optimizeGalleryGif(srcPath);
      if (optimizedPath) {
        updated = updated.split(file).join(path.basename(optimizedPath));
        console.log(`OK   ${dir}/${file} -> ${path.basename(optimizedPath)}`);
      } else {
        console.log(`SKIP ${dir}/${file}: webp not smaller, kept raw gif`);
      }
    }

    if (updated !== content) await writeFile(mdPath, updated, "utf8");
  }
}

console.log("--- Illustration ---");
await processSection("public/images/illustration", "hero", updateIllustrationFrontmatter);

console.log("--- Journal ---");
await processSection("public/images/journal", "image-1", updateJournalFrontmatter);

console.log("--- Journal gallery gifs ---");
await processJournalGalleryGifs("public/images/journal");

console.log("Done.");
