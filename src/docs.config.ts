import { getCollection } from 'astro:content'
import type { AstroCollection, DocsConfig, Document, DocumentEntry, Group } from "./docs.types"

const document = (filename: string): Document => ({ type: "document", filename })
const group = (title: string, documents: string[]): Group => ({ type: "group", title, documents })

// 
/**
 * Transforms Astro content collection to custom document collection format
 * @param {AstroCollection} collection - Astro content collection object
 * @returns {DocumentCollection} custom document collection
 */
function transformCollection(collection: AstroCollection): DocumentEntry<AstroCollection[number]["collection"]>[] {
  return collection.map((c) => ({
    id: c.id,
    path: c.filePath!,
    rendered: c.rendered!,
    data: c.data,
  }))
}

export const config = {
  spaces: [
    {
      title: "Documentation",
      icon: undefined,
      documents: [],
      content: [],
    },
    {
      title: "Developers",
      icon: undefined,
      documents: [],
      content: [],
    },
    {
      title: "Blog",
      icon: undefined,
      documents: [],
      content: [],
    },
    {
      title: "Guides",
      icon: undefined,
      documents: [],
      content: [],
    },
    {
      title: "Release Notes",
      icon: undefined,
      documents: transformCollection(await getCollection("releaseNotes")),
      content: [
        group("January 2025", [
          "v1.20.2.md",
        ])
      ],
    },
  ],
} satisfies DocsConfig
