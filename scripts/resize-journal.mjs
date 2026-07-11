import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = "public/images/journal/_incoming";
const OUT_DIR = "public/images/journal";
const MAX_EDGE = 2000;

// slug -> ordered list of source files (staging dir) -> output image-N.webp/gif
const posts = {
  "painting-leftovers": [
    "painting-leftovers-1.jpg",
    "painting-leftovers-2.jpg",
    "painting-leftovers-3.jpg",
    "painting-leftovers-4.jpg",
    "painting-leftovers-5.jpg",
    "painting-leftovers-6.jpg"
  ],
  "dos-alas-studios-gifs": [
    "dos-alas-1.gif",
    "dos-alas-2.gif",
    "dos-alas-3.gif",
    "dos-alas-4.gif",
    "dos-alas-5.gif",
    "dos-alas-6.gif",
    "dos-alas-7.gif",
    "dos-alas-8.gif"
  ],
  "card-game-mock-ups-ii": [
    "cgm2-1.jpg",
    "cgm2-2.jpg",
    "cgm2-3.jpg",
    "cgm2-4.jpg",
    "cgm2-5.jpg",
    "cgm2-6.jpg",
    "cgm2-7.jpg",
    "cgm2-8.jpg",
    "cgm2-9.jpg"
  ],
  "card-game-mock-ups": ["cgm1-1.png", "cgm1-2.png", "cgm1-3.png"],
  "grandmas-room-1": ["grandmas-room-1-1.gif"],
  "grandmas-room": ["grandmas-room-1.gif"],
  "when-russian-art-itches-the-brush": [
    "russian-art-1.jpg",
    "russian-art-2.png",
    "russian-art-3.png",
    "russian-art-4.png",
    "russian-art-5.jpg"
  ],
  "7ax-jingle": ["7ax-jingle-1.png", "7ax-jingle-2.png"],
  "el-cipitio": ["el-cipitio-1.jpg", "el-cipitio-2.jpg"],
  "la-cegua": ["la-cegua-1.png", "la-cegua-2.png"],
  riddickula: ["riddickula-1.gif"],
  "a-sneeze-upon-a-palette": [
    "sneeze-1.jpg",
    "sneeze-9-1.jpg",
    "sneeze-2.jpg",
    "sneeze-3.jpg",
    "sneeze-4.jpg",
    "sneeze-5.jpg",
    "sneeze-6.jpg",
    "sneeze-7.jpg",
    "sneeze-8.jpg"
  ],
  "tucker-animation": ["tucker-animation-1.gif"],
  "paiz-animation": ["paiz-animation-1.gif"],
  "some-more-roughs": ["some-more-roughs-1.gif", "some-more-roughs-2.gif"],
  "into-the-abyss": ["into-the-abyss-1.gif"]
};

for (const [slug, files] of Object.entries(posts)) {
  const outDir = path.join(OUT_DIR, slug);
  await mkdir(outDir, { recursive: true });

  let i = 1;
  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const isGif = file.toLowerCase().endsWith(".gif");
    const outName = isGif ? `image-${i}.gif` : `image-${i}.webp`;
    const outPath = path.join(outDir, outName);

    if (isGif) {
      // sharp's gif() re-encoder bloats file size significantly (observed 4x+) even with
      // no resize needed. These source GIFs are already small (<=1000px wide), so just
      // copy them directly instead of round-tripping through sharp.
      const meta = await sharp(srcPath, { animated: true }).metadata();
      const frameHeight = meta.pages ? meta.height / meta.pages : meta.height;
      if (meta.width > MAX_EDGE || frameHeight > MAX_EDGE) {
        await sharp(srcPath, { animated: true })
          .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
          .gif()
          .toFile(outPath);
      } else {
        await copyFile(srcPath, outPath);
      }
    } else {
      await sharp(srcPath)
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
    }
    console.log(`${slug}: ${file} -> ${outName}`);
    i += 1;
  }
}

console.log("Done.");
