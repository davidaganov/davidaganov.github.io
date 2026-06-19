export type NavHighlightKind = "new" | "updated"

export interface HighlightPageEntry {
  slug: string
  meta: {
    publishedAt?: string
    updatedAt?: string
  }
}
