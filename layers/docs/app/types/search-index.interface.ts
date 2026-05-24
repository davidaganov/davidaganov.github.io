import type { DocsSearchResult, SearchablePage } from "@docs/types"

export type SearchIndexResultMeta = Omit<DocsSearchResult, "snippet">

export interface SearchIndexEntry extends SearchablePage {
  result: SearchIndexResultMeta
}

export interface SearchIndexFile {
  locale: string
  pages: SearchIndexEntry[]
  builtAt?: string
}
