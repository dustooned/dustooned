import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = "public/images/illustration/_incoming";
const OUT_DIR = "public/images/illustration";

const items = [
  { slug: "masks-cover", file: "01-masks.jpg" },
  { slug: "monster-huddle", file: "02-annotation-2019.png" },
  { slug: "inti-mystica-carnaval", file: "03-image-asset.png" },
  { slug: "walo", file: "04-image-asset.jpg" },
  { slug: "feast-to-life", file: "05-piece.png" },
  { slug: "bout-bros", file: "06-screenshot-2022-05.png" },
  { slug: "mural-faces-and-flowers", file: "07-pxl-20241006.jpg" },
  { slug: "fool-loop-flyer", file: "08-flyer.jpg" },
  { slug: "inti-batey-zine", file: "09-pxl-20220605.jpg" },
  { slug: "all-the-pretty-boyz-mural", file: "10-mural-final-v4.png" },
  { slug: "get-got-grace", file: "11-img-3065.jpg" },
  { slug: "frog-wizard", file: "12-piece-0.png" },
  { slug: "sana-sana", file: "13-sanansana.jpg" },
  { slug: "spells", file: "14-piece-1.png" },
  { slug: "blanca", file: "15-blanca.png" },
  { slug: "chipi", file: "16-chipi.png" },
  { slug: "word", file: "17-word.jpg" },
  { slug: "pixel-duck", file: "18-screenshot-2022-04.jpg" },
  { slug: "los-espookies", file: "19-los-espookies.jpg" },
  { slug: "demona", file: "20-demona.jpg" },
  { slug: "sinkages-coil", file: "21-sinkage-s-coil.png" },
  { slug: "halabastard-castle", file: "22-halabastard-castle.png" },
  { slug: "mt-claude", file: "23-mt-claude.png" },
  { slug: "wasteland-de-sol", file: "24-wasteland-de-sol.png" },
  { slug: "untitled-artwork-1", file: "25-untitled-artwork-1.png" },
  { slug: "muzi-minas", file: "26-muzi-minas.png" },
  { slug: "deviantart-repost", file: "27-deviantart-repost.jpg" },
  { slug: "it-gif", file: "28-comp-1.gif" },
  { slug: "scarecrow-sunflowers", file: "29-piece-2.jpg" },
  { slug: "jack-o-lantern-wizard", file: "30-piece-1b.jpg" },
  { slug: "forgive-bless-release", file: "31-love.jpg" }
];

const MAX_EDGE = 2000;

for (const { slug, file } of items) {
  const srcPath = path.join(SRC_DIR, file);
  const outDir = path.join(OUT_DIR, slug);
  await mkdir(outDir, { recursive: true });

  const isGif = file.toLowerCase().endsWith(".gif");

  if (isGif) {
    const outPath = path.join(outDir, "hero.gif");
    await sharp(srcPath, { animated: true })
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .toFile(outPath);
    console.log(`${slug}: gif -> hero.gif`);
    continue;
  }

  const outPath = path.join(outDir, "hero.webp");
  await sharp(srcPath)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath);
  console.log(`${slug}: -> hero.webp`);
}

console.log("Done.");
