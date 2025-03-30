import type { AnyEntryMap, CollectionEntry, RenderedContent } from "astro:content"
import type React from "react"

/**
 * Various helper types for Astro collection data
 */
export type AstroCollectionKey = keyof AnyEntryMap
export type AstroCollectionEntry<K extends AstroCollectionKey> = CollectionEntry<K>
export type AstroCollection = AstroCollectionEntry<AstroCollectionKey>[]

/**
 * DocumentEntry represents the final object that gets passed to the components for rendering
 */
export type DocumentEntry<K extends AstroCollectionKey> = {
  id: string
  path: string
  rendered: RenderedContent
  data: AstroCollectionEntry<K>["data"]
}

/**
 * Document represents a single documentation file
 * @property {string} type - Discriminator field set to "document"
 * @property {string} document - Path to the document file
 */
export type Document = {
  type: "document"
  document: DocumentEntry<AstroCollectionKey>
}

/**
 * Group represents a collection of related documents
 * @property {string} type - Discriminator field set to "group" 
 * @property {string} title - Display name for this group of documents
 * @property {string[]} documents - Array of document filenames that belong to this group
 */
export type Group = {
  type: "group"
  title: string
  documents: DocumentEntry<AstroCollectionKey>[]
}

/**
 * Space represents a top-level section/area in the documentation
 * @property {string} title - Display name for this space
 * @property {(Document | Group)[]} content - Array of documents or document groups in this space
 * @property {React.ReactNode} [icon] - Optional React element to use as an icon for this space
 * @property {DocumentSchema} [schema] - Optional Zod schema for validating documents in this space
 */
export type Space = {
  title: string
  content: (Document | Group)[]
  icon?: React.ReactNode
  documents: DocumentEntry<AstroCollectionKey>[]
}

/**
 * DocsConfig is the root configuration object for the documentation site
 * @property {Space[]} spaces - Array of spaces that make up the documentation
 */
export type DocsConfig = {
  spaces: Space[]
}
