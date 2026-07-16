export const SITE = {
  title: "Dustooned",
  description:
    "Motion, illustration, interactive experiments, journal notes, and teaching work by Dustin / T'.",
  url: "https://www.dustooned.com"
};

// Change this value to compare handmade style directions.
// Options: "clean", "poster", "sketchbook", "comic"
export const VISUAL_MOOD = "poster";

// Temporary first-visit notice while the site is mid-redesign. Set enabled: false (or delete
// <SiteNotice /> from BaseLayout.astro + this file's export + SiteNotice.astro) once the
// redesign settles down. Bump `version` to show it again to visitors who already dismissed it.
export const SITE_NOTICE = {
  enabled: true,
  version: "1",
  emoji: "🚧",
  message: "Pardon our dust — Dustooned is mid-move and getting a fresh coat of paint.",
  ctaLabel: "Continue to the site"
};

export const EXTERNAL_LINKS = {
  sequential: "https://www.staytoonedgfx.com/",
  education: "https://github.com/dustooned/lbcc-student-work"
};

// Homepage hero. Drop a real video/gif path into videoSrc when it's ready —
// until then the hero falls back to an animated placeholder background.
export const HERO = {
  eyebrow: "Welcome",
  title: "Hi, I'm Dustin.",
  tagline:
    "Dustooned is a home base for motion, illustration, and interactive work, plus journal notes from the studio and classroom. Look around, or jump straight to what's new.",
  primaryCta: { label: "See what's new", href: "/journal" },
  secondaryCta: { label: "Explore sections", href: "#explore" },
  videoSrc: "",
  posterImage: ""
};

export const navItems = [
  { label: "Motion", href: "/motion" },
  { label: "Illustration", href: "/illustration" },
  { label: "Sequential", href: EXTERNAL_LINKS.sequential, external: true },
  { label: "Interactive", href: "/interactive" },
  { label: "Education", href: EXTERNAL_LINKS.education, external: true, future: true },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
] as const;
