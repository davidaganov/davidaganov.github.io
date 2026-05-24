import type { SearchablePage } from "@docs/types"

export interface SearchIndexFile {
  locale: string
  pages: SearchablePage[]
  builtAt?: string
}
