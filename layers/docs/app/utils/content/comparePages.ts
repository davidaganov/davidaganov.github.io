import type { ContentPageRow } from "@docs/types"

export const isNavigationHidden = (meta: unknown): boolean => {
  return Boolean((meta as { navigation?: boolean } | undefined)?.navigation === false)
}

export const compareContentPages = (a: ContentPageRow, b: ContentPageRow): number => {
  const aMeta = (a.meta as { order?: number } | undefined) || {}
  const bMeta = (b.meta as { order?: number } | undefined) || {}
  const aOrder = typeof aMeta.order === "number" ? aMeta.order : Number.MAX_SAFE_INTEGER
  const bOrder = typeof bMeta.order === "number" ? bMeta.order : Number.MAX_SAFE_INTEGER

  if (aOrder !== bOrder) return aOrder - bOrder

  const titleCmp = String(a.title || "").localeCompare(String(b.title || ""), "en", {
    sensitivity: "base",
    numeric: true
  })

  if (titleCmp !== 0) return titleCmp

  return String(a.path).localeCompare(String(b.path || ""), "en", { numeric: true })
}
