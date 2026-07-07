export const SITE = {
  title: "Dustooned",
  description:
    "Motion, illustration, interactive experiments, journal notes, and teaching work by Dustin / T'.",
  url: "https://www.dustooned.com"
};

// Change this value to compare handmade style directions.
// Options: "clean", "poster", "sketchbook", "comic"
export const VISUAL_MOOD = "poster";

export const EXTERNAL_LINKS = {
  sequential: "https://www.staytoonedgfx.com/",
  education: "https://github.com/dustooned/lbcc-student-work"
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
