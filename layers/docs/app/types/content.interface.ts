import { CONTENT_LOCALES } from "@docs/constants"
import type { ArticleMeta } from "@docs/types"

export interface ContentListItem {
  title: string
  description: string
  path: string
  meta?: ArticleMeta
}

export interface ContentPageRow {
  path: string
  title?: string | null
  meta?: unknown
}

export type ContentLocale = (typeof CONTENT_LOCALES)[number]

export interface FlatNavItem {
  titleKey: string
  title: string
  path: string
  isSection?: boolean
}

export interface ContentPageNavRow {
  path: string
  title?: string | null
  meta?: unknown
}
