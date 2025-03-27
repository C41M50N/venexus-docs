import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CommonDocumentSchema = z.object({
  title: z.string(),
  hidden: z.boolean().default(false),
})

const releaseNotes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/release-notes" }),
  schema: z.object({
    title: z.string(),
    releaseDate: z.coerce.date(),
  })
})

export const collections = { releaseNotes }
