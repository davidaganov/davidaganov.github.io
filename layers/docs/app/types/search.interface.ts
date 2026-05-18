import type { TYPE_PAGE } from "@docs/types"

export interface DocsSearchResult {
  title: string
  path: string
  category: TYPE_PAGE
  breadcrumb: string[]
  snippet?: string
  icon: string
}

export interface SearchablePage {
  title?: string | null
  description?: string | null
  path: string
  body?: unknown
  meta?: { icon?: string }
}
