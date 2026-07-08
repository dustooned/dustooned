import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    section: z.enum(["motion", "illustration", "interactive"]),
    thumbnail: z.string(),
    description: z.string(),
    year: z.string().optional(),
    role: z.string().optional(),
    tags: z.array(z.string()).default([]),
    videoUrl: z.string().url().optional(),
    episodes: z.array(z.object({ label: z.string(), videoUrl: z.string().url() })).default([]),
    projectUrl: z.string().url().optional(),
    embedUrl: z.string().url().optional(),
    gallery: z.array(z.string()).default([]),
    hero: z.string().optional(),
    heroAspect: z.enum(["16:9", "4:3", "4:5", "1:1", "auto"]).optional(),
    featured: z.boolean().default(false),
    order: z.number().optional()
  })
});

const journal = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/journal" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    thumbnail: z.string().optional(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false)
  })
});

export const collections = {
  projects,
  journal
};
