import { getCollection } from 'astro:content'
import slugify from '@sindresorhus/slugify'
import type { AstroCollection, AstroCollectionKey, DocsConfig, Document, DocumentEntry, Group, Space } from "./docs.types"
import dayjs from 'dayjs'

const document = (documents: DocumentEntry<AstroCollectionKey>[], path: string): Document => ({ type: "document", document: getDocument(documents, path) })
const group = (title: string, documents: DocumentEntry<AstroCollectionKey>[]): Group => ({ type: "group", title, documents })

/**
 * Transforms Astro content collection to custom document collection format
 * @param {AstroCollection} collection - Astro content collection object
 * @returns {DocumentCollection} custom document collection
 */
function transformCollection<K extends AstroCollectionKey>(collection: AstroCollection): DocumentEntry<K>[] {
  return collection.map((c) => ({
    id: c.id,
    title: slugify(c.data.title),
    path: c.filePath!,
    rendered: c.rendered!,
    data: c.data,
  }))
}

function getDocument(documents: DocumentEntry<AstroCollectionKey>[], path: string): DocumentEntry<AstroCollectionKey> {
  const document = documents.find((doc) => {
    console.debug(`Astro Path: ${doc.path}`)
    return doc.path.endsWith(path)
  })

  if (!document) {
    throw new Error(`Document not found at given path: ${path}`)
  }

  return document
}

// groupBys: a collection of functions that automatically group content
function groupByReleaseDate(documents: DocumentEntry<"releaseNotes">[]): Space["content"] {
  const sortedDocs = documents.sort((a,b) => a.data.releaseDate.getTime() - b.data.releaseDate.getTime())
  const groupedDocs = new Map<string, DocumentEntry<"releaseNotes">[]>()
  sortedDocs.forEach((doc) => {
    const date = dayjs(doc.data.releaseDate)
    const key = date.format("MMMM YYYY") // e.g., "January 2025"
    if (!groupedDocs.has(key)) {
      groupedDocs.set(key, [doc])
    } else {
      groupedDocs.get(key)!.push(doc)
    }
  })
  const contentMap: Space["content"] = []
  groupedDocs.forEach((docs, key) => {
    contentMap.push(
      group(key, docs)
    )
  })
  return contentMap
}

const guidesDocuments = transformCollection(await getCollection("guides"));
const releaseNotesDocuments = transformCollection(await getCollection("releaseNotes"));

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
      content: [
        document(guidesDocuments, "/n"),
      ],
    },
    {
      title: "Release Notes",
      icon: undefined,
      documents: releaseNotesDocuments,
      content: groupByReleaseDate(releaseNotesDocuments)
    },
  ],
} satisfies DocsConfig
