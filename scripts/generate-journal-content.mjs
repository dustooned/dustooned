import { writeFile } from "node:fs/promises";

function img(slug, n) {
  return `/images/journal/${slug}/image-${n}`;
}

const posts = [
  {
    slug: "painting-leftovers",
    title: "Painting Leftovers",
    date: "2026-06-11",
    excerpt: "Dug these up from the archive and thought I'd share a few Procreations.",
    tags: ["procreate", "painting", "process", "speedpaint"],
    imageCount: 6,
    imageExt: "webp",
    body: `Dug these up from the archive and thought I'd share a few Procreations.

The benefit of speed paint is much like relieving oneself from expectation.

Practice for the sake of fun helps to maintain interest and you then inadvertently get better faster at the spill.`
  },
  {
    slug: "its-a-good-life-beta-experiment",
    title: "It's A Good Life Beta (Experiment)",
    date: "2026-05-30",
    excerpt: "An experiment in building a complete hand-drawn-to-playable-game pipeline from scratch — pencil to SVG to Blender to Unity, entirely in one session.",
    tags: ["gamedev", "unity", "interactive", "prototype", "blender"],
    imageCount: 0,
    body: `Play in your browser for the best experience.

**It's A Good Life (Beta)** is an experiment in building a complete hand-drawn-to-playable-game pipeline from scratch — pencil to SVG to Blender to Unity, entirely in one session.

The goal was to answer one question: how fast can an artist go from a drawing to something running in a browser? The answer turned out to be one day, with a working character, room, collision, camera follow, animation, music, and atmospheric audio — all sourced from hand-drawn art.

## 🎨 The Pipeline — Pencil to Browser

The full chain runs: hand-drawn art → SVG → Blender (automated) → GLB export → Unity → WebGL build.

- **SVG authoring:** Shapes drawn in vector software with named groups. The parser reads group IDs to know what to build.
- **Blender automation:** A single Python script (\`master_build.py\`) reads the SVGs and builds the entire 3D scene — room, chair, character billboard — without manual modelling.
- **GLB export:** Three files land in an \`export/\` folder: environment, props, sprites. Scale is 1 Blender unit = 1 Unity unit = 1 metre.
- **Unity import:** GLTFast package handles GLB natively. Drag in, geometry and UVs transfer cleanly.
- **WebGL build:** Published to Unity Play for browser embedding.

The key design rule: every stage is replaceable. Redraw the SVG, re-run the script, reimport the GLB — the game updates. No manual 3D work, no rebinding.

## 🎮 Unity — What Was Built

- **Character movement:** WASD via Unity's New Input System. CharacterController handles collision. Y axis locked — no gravity, no jumping. Top-down diorama rules.
- **Camera follow:** Fixed offset tracking in LateUpdate. Smooth damp eases the follow so it never snaps.
- **Room collision:** Auto-generated Box Colliders per wall sourced from Blender face geometry data. Includes an invisible front barrier — the character can't walk out the open front of the diorama.
- **Sprite animation:** 18 hand-drawn idle frames swap on a timer via \`SpriteAnimator.cs\`. One flat plane, one material slot, texture swap per frame. Paper Mario technique.
- **Scrolling pixel background:** A Quad behind the room with a tiling Aseprite pixel art texture. UV offset increments each frame via \`BackgroundScroll.cs\`. Wrap Mode Repeat makes it seamless.
- **Atmospheric audio:** Background music runs through an Audio Low Pass Filter. \`MusicMuffle.cs\` reads the character's Z position and maps it to the filter cutoff — front of room sounds muffled, back wall sounds clear. Like music heard through a wall.
- **Mood lighting:** Single Spot light above the room centre. Warm yellow-orange, low intensity. Dim apartment feel.

## 📓 What I Learned (Gotchas Log)

- **Render Face → Both:** Any interior mesh in Unity is invisible by default. Blender normals point inward — Unity culls back faces. Set Render Face to Both on every interior material.
- **New Input System vs Old:** \`Input.GetAxis()\` throws an error if the New Input System package is active. Use \`Keyboard.current.wKey.isPressed\` instead.
- **Mesh Colliders on thin walls:** CharacterController slides up face normals on thin wall meshes. Box Colliders per wall are more reliable for room interiors.
- **Play mode changes don't save:** Any Inspector value changed during Play is discarded on Stop. Note values before stopping.
- **Inspector lock for bulk frame assignment:** Lock the Inspector (padlock icon), select all frames in Project panel, drag onto the array header — Unity fills all slots at once.
- **Wrong scene in build:** Build Profiles Scene List had the default empty SampleScene instead of the actual game scene. The build loaded a completely blank scene. Always verify the Scene List before building.
- **WebGL audio policy:** Browsers block audio autoplay until the user interacts with the page. Music won't start until the player clicks.
- **AudioReverbZone properties locked by preset:** ReverbPreset overrides manually set values at runtime. Switch to User preset and control Room and Reverb properties directly via script.

## 💻 Scripts Written

- **SpriteAnimator.cs** — PNG frame swap animation on a mesh plane. Frames array + fps timer.
- **CameraFollow.cs** — Fixed offset camera follow using SmoothDamp in LateUpdate.
- **CharacterMovement.cs** — WASD movement via New Input System. Y locked to floor.
- **RoomWallColliders.cs** — Auto-generates Box Colliders per wall from Blender face data. Includes invisible front barrier.
- **ScenePlacement.cs** — Code-driven asset positioning on Start. Reproducible layout.
- **BackgroundScroll.cs** — UV offset scroll on a Quad material. Mathf.Repeat for seamless loop.
- **MusicMuffle.cs** — Low pass filter cutoff mapped to character Z via InverseLerp. Position-based atmospheric audio.
- **CameraSetup.cs** — Forces camera clear flags to solid black on Awake. Prevents URP skybox bleed.

## 🔜 What's Next

- Sprite alpha clipping — remove the black background from the character plane
- Billboard behaviour — character sprite always faces the camera while moving
- Walk animation state — swap to walk cycle frames when WASD is pressed
- Wall and chair materials — PNG textures from the Blender pipeline
- Auto-reimport editor script — detects GLB changes and reimports automatically
- Expand the room — larger environment, additional props

## 🔗 Links

- [Play It's A Good Life](https://play.unity.com/en/games/aeb3eaf4-b3bd-4c63-8237-e84ed1148209/its-a-good-life-b3t4-v01)
- [Play It's A Good Life Beta on Unity Play](https://play.unity.com/en/games/692f9360-b58a-41b7-88cb-1be3e81ba9dd)`
  },
  {
    slug: "drumagery-v1",
    title: "Drumagery 🥁🖼️ v1",
    date: "2026-05-13",
    excerpt: "A browser-based visual instrument built for a live band collaboration event through Long Beach City College.",
    tags: ["drumagery", "lbcc", "digital media", "interactive", "c4rp00l", "music", "music video", "experimental", "professor", "documentation"],
    imageCount: 0,
    body: `**Drumagery** is a browser-based visual instrument I built for a live band collaboration event through Long Beach City College, with Workforce Programming support.

The prototype was created for a collaboration with Under The Hood and C4RP00L, turning rhythm, visuals, MIDI-style interaction, and real-time performance into a unified playable system.

## 🎛️ Controls

- **Keyboard / MIDI:** trigger visual and rhythmic responses in real time.
- **Fullscreen mode:** built for projection, performance, and live testing.
- **Timing tools:** adjust how visuals sequence, pulse, and respond rhythmically.
- **Live improvisation:** designed to be played while music is happening.

## 🎓 Why I Made It

I developed Drumagery while working part time at Long Beach City College. With support from Workforce Programming, I drew inspiration from analog-first creative systems like zines, dice prompts, rhythm games, and collaborative drawing, and adapted them into a digital format.

## 🎤 Event Reflection

The collaboration with Under The Hood and C4RP00L went extremely well. Testing the app during a live music setting showed that visuals could function as active performance elements rather than passive background accompaniment.

## 🎥 Video Demonstration

A real-time demonstration of Drumagery being tested and performed live.

## 🧾 Event Flyer

Flyer and promotional material from the collaborative event: [Open Flyer in Google Drive](https://drive.google.com/file/d/1J6EerQqT1upYGzZW1XYUmhLBmzMjqdlk/view?usp=sharing)

## 🔗 Links

- [Open Drumagery Prototype](https://dustooned.github.io/drumagery/)
- [Visit C4RP00L](https://www.c4rp00l.com/)
- [Watch Demonstration Video](https://www.youtube.com/watch?v=Ctzwoi2WIEY)`
  },
  {
    slug: "dos-alas-studios-gifs",
    title: "Dos Alas Studios GIFs",
    date: "2026-05-09",
    excerpt: "Animated a few gifs for our website's sections — for an arts education program for neurodivergent folx.",
    tags: ["procreate", "procreate dreams", "animation", "gif", "painting", "paint", "color", "manga"],
    imageCount: 8,
    imageExt: "gif",
    body: `Animated a few gifs for our website's sections. We are in fact working on building an [arts education program for neurodivergent folx](https://dosalas.studio/).

God bless Procreate Dreams 2.0 as it has beckoned itself as GOD TIER amongst mortals as probably one of the best animation apps I've used on the iPad.`
  },
  {
    slug: "card-game-mock-ups-ii",
    title: "Card Game Mock Ups II",
    date: "2025-02-24",
    excerpt: "Some new additional designs for the card game a collaborator and I are testing out.",
    tags: ["card game", "video game", "illustration", "b&w", "game development"],
    imageCount: 9,
    imageExt: "webp",
    body: `Some new additional designs for the card game a collaborator and I are testing out. Wanted to find a unique design for each card type without too much detail, as I feel it's important for the focus to be on the art and let the design itself help distinguish the card's function. Perhaps a back pattern to determine them could be in order for more detail of visual categorization.`
  },
  {
    slug: "card-game-mock-ups",
    title: "Card Game Mock Ups",
    date: "2025-02-15",
    excerpt: "A collaboration series of mock up designs for a card game prototype, finding the balance of occultic eerie, and cartoony.",
    tags: ["card game", "illustration", "occult", "game development"],
    imageCount: 3,
    imageExt: "webp",
    body: `A collaboration series of mock up designs for a card game prototype. Finding the balance of occultic eerie, and cartoony.`
  },
  {
    slug: "grandmas-room-1",
    title: "Grandmas' Room #1",
    date: "2025-02-18",
    excerpt: "Using animated sprites to make room transitions paid off after a few experiments in sound design and dread.",
    tags: ["dreamXtreme", "gamedev", "video game", "zine", "animation", "audio", "game development"],
    imageCount: 1,
    imageExt: "gif",
    body: `Finally after a lot of intense debugging, we got this simple little room to work for the next part of the game. Using animated sprites to make room transitions paid off after a few experiments I did before development. Doing sound design for this was a blast too, and I loved utilizing weird sampling and audio effects to give the room a certain tone and feeling of dementia nauseous.`
  },
  {
    slug: "grandmas-room",
    title: "Grandma's Room",
    date: "2025-02-05",
    excerpt: "Wanted to maintain the zine aesthetic for our concept whilst coming up with interesting ways to invent an interactive room.",
    tags: ["zine", "animation", "game development", "dreamXtreme", "video games", "gamedev", "illustration"],
    imageCount: 1,
    imageExt: "gif",
    body: `Wanted to maintain the zine aesthetic for our concept whilst coming up with interesting ways to invent an interactive room. Interactive objects have been positioned for programming implementation, with assembly pending.`
  },
  {
    slug: "dialog-boxes",
    title: "Dialog Boxes",
    date: "2025-01-31",
    excerpt: "Working on the demo for the last few days has been a bit of a wreck with programming back and forth, but I learned quite a lot about dialog boxes.",
    tags: ["dreamXtreme", "game development", "animation", "zine", "gamedev", "b&w", "retro"],
    imageCount: 0,
    body: `Working on the demo for the last few days has been a bit of a wreck with programming back and forth, but I learned quite a lot about dialog boxes. Still need to make some adjustments with typos, and text alignment, but it's really great to see your vision unravel in a new medium.`
  },
  {
    slug: "when-russian-art-itches-the-brush",
    title: "When Russian art itches the brush…",
    date: "2025-11-24",
    excerpt: "Studying Russian painting technique and theory, inspired by how much Disco Elysium changed the way I think about painting.",
    tags: ["painting", "process", "study", "disco elysium"],
    imageCount: 5,
    imageExt: "webp",
    body: `It's no secret that Disco Elysium is one of the greatest games I've played in my recent memory. I still find myself playing it every other month, let alone quoting and thinking about how much it changed not only how I think of game development and storytelling, but even the way I paint. Hence why I decided to take on studying some of the techniques of Russian painting techniques and theory.

We still have a long way to go for improvement, but there's definitely been a shift in my painting abilities as of recently. So much in fact, that we compiled an overview of our process below. Keep creating!

## Process Overview

1. **Scene Setup** — establishing lighting and mood
2. **Palette & Swatches** — neutral and skin tone selection
3. **Value Pass / Grisaille** — black and white blocking
4. **Warm/Cool Mapping** — temperature adjustments
5. **Glazes & Finish** — unification and highlights
6. **Troubleshooting** — addressing common issues
7. **Digital/Color Constructor** — digital application of the techniques`
  },
  {
    slug: "7ax-jingle",
    title: "7aX Jingle",
    date: "2025-10-20",
    excerpt: "Practicing After Effects expressions while developing a strange abstract series of glyphs inspired by graffiti lettering.",
    tags: ["motion graphics", "illustrator", "illustration", "graffiti", "animation", "music", "music video", "code", "programming"],
    imageCount: 2,
    imageExt: "webp",
    body: `Practiced After Effects coding expressions while developing a strange abstract series of glyphs inspired by graffiti lettering techniques refined in Illustrator.

Accompanying the animation is an original musical composition titled "7AX JINGLE" by Zeenager, which was particularly rewarding to create: "I always get giddy when I can make music for my visuals, especially when I can stack different synths together for additional atmosphere in the soundscape."

Below are the exact After Effects expressions used for the motion — four snippets for Scale, Position, and Rotation, each designed to create a "floaty" aesthetic through mathematical functions controlling overshoot, bounce, and drift behaviors. An original pencil sketch is shown demonstrating the conceptual foundation before digital execution.

<RawPostInsert>
  <div class="video-embed">
    <iframe
      src="https://www.youtube.com/embed/Hv0sFLKd1tE"
      title="7aX Jingle"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
</RawPostInsert>`
  },
  {
    slug: "el-cipitio",
    title: "El Cipitio",
    date: "2025-10-20",
    excerpt: "During my tenure with Walo: A Central American Odyssey, I was spoiled with a lot of new folktales I had no prior knowledge of — this week, El Cipitio.",
    tags: ["el cipitio", "folklore", "el salvador", "illustration", "history", "walo"],
    imageCount: 2,
    imageExt: "webp",
    body: `During my tenure with the graphic novel **Walo: A Central American Odyssey**, I was spoiled with a lot of new folktales I had no knowledge about previously. This week I decided to illustrate one of my favorites from Central America's El Salvador: **EL CIPITIO!**

> In Salvadoran folklore, Cipitío is the eternally young boy with a large straw hat and backwards feet. A mischievous trickster condemned to remain forever a child. Born of a forbidden affair involving his mother, La Cegua, he was punished by the gods: he would never grow up, and his strange footprints would lead anyone who followed them astray. Cipitío delights in small pranks such as eating ashes in rural kitchens, throwing pebbles and flower petals at young women by the rivers, and vanishing before adult eyes. Despite his odd behavior, he is not evil, just playful and rooted in the wonder of childhood and myth.

Original inked image, though this kiddo's got a guaje and a bit of facial hair.

If you like what you see, check out our graphic novel [Walo: A Central American Odyssey](https://www.walocomic.com/) for more Central American folklore.`
  },
  {
    slug: "la-cegua",
    title: "La Cegua",
    date: "2025-10-13",
    excerpt: "In the tradition of folklore and myth, an illustration for one of my favorite Central American folklore creatures: La Cegua.",
    tags: ["la cegua", "folklore", "nicaragua", "central america", "illustration", "history", "timelapse", "walo"],
    imageCount: 2,
    imageExt: "webp",
    body: `I recently played Hades 2 and forgot how good the art direction of Jen Zee was, and how much better it's gotten in the latest game. So in the tradition of folklore and myth, I went ahead and did an illustration for one of my favorite Central American folklore creatures: LA CEGUA.

> La Cegua — also known as La Siguanaba or Sihuehuet — is a shapeshifting spirit from Central American folklore, said to appear as a beautiful woman with long hair who lures men at night. When they approach, she reveals a horse's skull or rotting face, driving them mad.

In Nicaragua, she allegedly made a pact with the devil after betrayal, cursed to roam rural roads punishing unfaithful men. Legends vary — some describe her as a seductive phantom, others as a mocking old crone — but all warn that lust and deceit carry terrifying consequences.

Hope you all enjoyed this piece of Latin American folklore. Check out my graphic novel [WALO](https://www.walocomic.com/) if you want to read more Central American history!

<RawPostInsert>
  <div class="video-embed">
    <iframe
      src="https://drive.google.com/file/d/1JQDY9aWEFcmrbjQOsDsuA41AeQ2WMwVY/preview"
      title="La Cegua timelapse"
      allow="autoplay"
      allowfullscreen
    ></iframe>
  </div>
</RawPostInsert>`
  },
  {
    slug: "riddickula",
    title: "Riddickula",
    date: "2025-09-25",
    excerpt: "Got inspired by some horror Gameboy reviews and decided to make a little mock up game of my own.",
    tags: ["game", "horror", "mockup", "spooky season"],
    imageCount: 1,
    imageExt: "gif",
    body: `Got inspired by some horror Gameboy reviews and decided to make a little mock up game of my own.

RIDDICKULA! He's out of sight, but he ain't blind! Keep your eyes peeled! Spooky season is here!`
  },
  {
    slug: "a-sneeze-upon-a-palette",
    title: "A Sneeze Upon A Palette",
    date: "2025-09-18",
    excerpt: "A surreal illustrated poetry book drawn by me and my long time collaborator Joe Romero, from 2019.",
    tags: ["illustration", "poetry", "collaboration", "zine"],
    imageCount: 9,
    imageExt: "webp",
    body: `A surreal illustrated poetry book drawn by me and my long time collaborator [Joe Romero](https://brobrobroblog.com/) from 2019. I hope you all enjoy this quaint collection of oddities we made.`
  },
  {
    slug: "tucker-animation",
    title: "Tucker Animation",
    date: "2025-03-09",
    excerpt: "Been a while since we animated… what better fella to cartoon to life than Tucker Toon?",
    tags: ["animation", "tucker toon"],
    imageCount: 1,
    imageExt: "gif",
    body: `Been a while since we animated…

What better fella to cartoon to life than Tucker Toon?`
  },
  {
    slug: "paiz-animation",
    title: "Paiz Animation",
    date: "2025-03-14",
    excerpt: "Another animation of an angry Cuban.",
    tags: ["animation", "paiz"],
    imageCount: 1,
    imageExt: "gif",
    body: `Another animation of an angry Cuban.`
  },
  {
    slug: "some-more-roughs",
    title: "Some more roughs...",
    date: "2025-03-21",
    excerpt: "Been back at animating some more sequences for another music video.",
    tags: ["animation", "music video", "music", "sunshine bandage"],
    imageCount: 2,
    imageExt: "gif",
    body: `Been back at animating some more sequences for another music video.`
  },
  {
    slug: "into-the-abyss",
    title: "Into the Abyss",
    date: "2025-02-10",
    excerpt: "One Less Horn to Feed — T' - Dio La Damned. Incredibly inspired recently and decided to scribe something, and voice it too.",
    tags: ["dio", "dio la damned", "audio", "video game", "voice acting"],
    imageCount: 1,
    imageExt: "gif",
    body: `**One Less Horn to Feed**

*T' — Dio La Damned*

Incredibly inspired recently and decided to scribe something. Decided to voice it too with some audio. Below are the original pages from a concept journal. I love voice acting, especially when it's your own writing.`
  },
  {
    slug: "tiktok-men-luke-warm",
    title: "Tik Tok Men - Luke Warm (Music Video)",
    date: "2025-01-28",
    excerpt: "“Now begin in the middle, and later learn the beginning; the end will take care of itself.” — Harlan Ellison",
    tags: ["tiktokmen", "music video", "surreal"],
    imageCount: 0,
    body: `> Now begin in the middle, and later learn the beginning; the end will take care of itself.
>
> — Harlan Ellison

<RawPostInsert>
  <div class="video-embed">
    <iframe
      src="https://www.youtube.com/embed/89h-kIwTY4E"
      title="Tik Tok Men - Luke Warm"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
</RawPostInsert>`
  }
];

for (const post of posts) {
  const { slug, title, date, excerpt, tags, imageCount, imageExt = "webp", body } = post;
  const thumbnail = imageCount > 0 ? img(slug, 1) + "." + imageExt : "";

  const galleryImages = [];
  for (let i = 2; i <= imageCount; i++) {
    galleryImages.push(`${img(slug, i)}.${imageExt}`);
  }

  const needsRawPostInsert = body.includes("<RawPostInsert>");
  const needsMediaGallery = galleryImages.length > 0;

  const imports = [];
  if (needsRawPostInsert) imports.push(`import RawPostInsert from "../../components/RawPostInsert.astro";`);
  if (needsMediaGallery) imports.push(`import MediaGallery from "../../components/MediaGallery.astro";`);

  const galleryBlock = needsMediaGallery
    ? `\n\n<MediaGallery title="${title.replace(/"/g, '\\"')}" images={${JSON.stringify(galleryImages)}} />`
    : "";

  const frontmatterLines = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: "${date}"`,
    thumbnail ? `thumbnail: "${thumbnail}"` : null,
    `excerpt: "${excerpt.replace(/"/g, '\\"')}"`,
    `tags:`,
    ...tags.map((t) => `  - ${t}`),
    "---"
  ].filter(Boolean);

  const content = `${frontmatterLines.join("\n")}
${imports.length ? "\n" + imports.join("\n") + "\n" : ""}
${body}${galleryBlock}
`;

  await writeFile(`src/content/journal/${slug}.mdx`, content, "utf8");
}

console.log(`Wrote ${posts.length} journal posts.`);
