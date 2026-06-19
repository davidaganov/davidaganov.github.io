import { isNavigationHidden } from "@docs/utils/content/comparePages"
import { getContentHighlightKind, getContentVersionTs } from "@docs/utils/content/version"
import { contentPathToPublicPath } from "@docs/utils/path/publicPath"
import { HIGHLIGHT_SECTION_IDS } from "@docs/constants"
import type { HighlightPageEntry, NavHighlightKind } from "@docs/types"

type ContentPageRow = {
  path?: string | null
  meta?: unknown
}

export const isHighlightableContentPath = (contentPath: string): boolean => {
  const segments = contentPath.replace(/^\/+/, "").split("/").filter(Boolean)
  if (segments.length < 2) return false
  if (!HIGHLIGHT_SECTION_IDS.includes(segments[0] as (typeof HIGHLIGHT_SECTION_IDS)[number])) {
    return false
  }
  return true
}

export const toHighlightPageEntries = (pages: ContentPageRow[]): HighlightPageEntry[] => {
  const entries: HighlightPageEntry[] = []

  for (const page of pages) {
    if (typeof page.path !== "string" || !isHighlightableContentPath(page.path)) continue
    if (isNavigationHidden(page.meta)) continue

    const meta = (page.meta as HighlightPageEntry["meta"] | undefined) || {}
    if (getContentVersionTs(meta) <= 0) continue

    const slug = contentPathToPublicPath(page.path)
    entries.push({ slug, meta })
  }

  return entries
}

export const computeActiveHighlights = (
  pages: HighlightPageEntry[],
  lastVisitAt: number,
  ackMap: Record<string, number>
): Record<string, NavHighlightKind> => {
  const highlights: Record<string, NavHighlightKind> = {}

  for (const page of pages) {
    const versionTs = getContentVersionTs(page.meta)
    const ackTs = ackMap[page.slug] ?? 0
    if (ackTs >= versionTs) continue

    const kind = getContentHighlightKind(page.meta, lastVisitAt)
    if (kind) highlights[page.slug] = kind
  }

  return highlights
}

const HIGHLIGHT_PRIORITY: Record<NavHighlightKind, number> = {
  new: 2,
  updated: 1
}

export const mergeHighlightKinds = (
  kinds: Iterable<NavHighlightKind | null | undefined>
): NavHighlightKind | null => {
  let best: NavHighlightKind | null = null
  let bestScore = 0

  for (const kind of kinds) {
    if (!kind) continue
    const score = HIGHLIGHT_PRIORITY[kind]
    if (score > bestScore) {
      best = kind
      bestScore = score
    }
  }

  return best
}

export const getSectionHighlightFromMap = (
  highlights: Record<string, NavHighlightKind>,
  sectionId: string
): NavHighlightKind | null => {
  const prefix = `/docs/${sectionId}/`
  return mergeHighlightKinds(
    Object.entries(highlights)
      .filter(([slug]) => slug.startsWith(prefix))
      .map(([, kind]) => kind)
  )
}

export const getPathPrefixHighlightFromMap = (
  highlights: Record<string, NavHighlightKind>,
  pathPrefix: string
): NavHighlightKind | null => {
  const normalized = pathPrefix.replace(/\/+$/, "")
  return mergeHighlightKinds(
    Object.entries(highlights)
      .filter(([slug]) => slug === normalized || slug.startsWith(`${normalized}/`))
      .map(([, kind]) => kind)
  )
}
