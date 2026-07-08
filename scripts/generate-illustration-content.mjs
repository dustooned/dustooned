import { writeFile } from "node:fs/promises";

const items = [
  { slug: "monster-huddle", title: "Monster Huddle" },
  { slug: "inti-mystica-carnaval", title: "Inti Mystica Carnaval SF '24" },
  { slug: "walo", title: "WALO: A Central American Odyssey" },
  { slug: "feast-to-life", title: "Feast to Life" },
  { slug: "bout-bros", title: "Bout Bros" },
  { slug: "mural-faces-and-flowers", title: "Mural: Faces & Flowers" },
  { slug: "fool-loop-flyer", title: "Fool Loop" },
  { slug: "inti-batey-zine", title: "Inti Batey" },
  { slug: "all-the-pretty-boyz-mural", title: "All The Pretty Boyz" },
  { slug: "get-got-grace", title: "Get Got Grace" },
  { slug: "frog-wizard", title: "Frog Wizard" },
  { slug: "sana-sana", title: "Sana Sana" },
  { slug: "spells", title: "Spells" },
  { slug: "blanca", title: "Blanca" },
  { slug: "chipi", title: "Chipi" },
  { slug: "word", title: "Word." },
  { slug: "pixel-duck", title: "Pixel Duck" },
  { slug: "los-espookies", title: "Los Espookies" },
  { slug: "demona", title: "Demona" },
  { slug: "sinkages-coil", title: "Sinkage's Coil" },
  { slug: "halabastard-castle", title: "Halabastard Castle" },
  { slug: "mt-claude", title: "Mt. Claude" },
  { slug: "wasteland-de-sol", title: "Wasteland de Sol" },
  { slug: "untitled-artwork-1", title: "Untitled Artwork 1" },
  { slug: "muzi-minas", title: "Muzi & Minas" },
  { slug: "deviantart-repost", title: "Archive Piece" },
  { slug: "it-gif", title: "IT" },
  { slug: "scarecrow-sunflowers", title: "Scarecrow in the Sunflowers" },
  { slug: "jack-o-lantern-wizard", title: "Jack-o'-Lantern Wizard" },
  { slug: "forgive-bless-release", title: "Forgive, Bless, and Release" }
];

let order = 2;
for (const { slug, title } of items) {
  const isGif = slug === "it-gif";
  const heroFile = isGif ? "hero.gif" : "hero.webp";
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
section: "illustration"
thumbnail: "/images/illustration/${slug}/${heroFile}"
hero: "/images/illustration/${slug}/${heroFile}"
description: "Description coming soon."
order: ${order}
---
`;
  await writeFile(`src/content/projects/${slug}.md`, frontmatter, "utf8");
  order += 1;
}

console.log(`Wrote ${items.length} content files.`);
