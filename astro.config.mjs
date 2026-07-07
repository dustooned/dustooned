import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

const base = process.env.BASE_PATH || "/";
const site = process.env.SITE_URL || "https://www.dustooned.com";

export default defineConfig({
  site,
  base,
  integrations: [mdx()]
});
