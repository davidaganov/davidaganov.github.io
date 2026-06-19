export interface ContentVersionMeta {
  publishedAt?: string
  updatedAt?: string
}

export const parseContentDate = (value: unknown): number => {
  if (value == null || value === "") return 0
  const parsed = Date.parse(String(value))
  return Number.isNaN(parsed) ? 0 : parsed
}

export const getContentVersionTs = (meta: ContentVersionMeta | undefined): number => {
  if (!meta) return 0
  return Math.max(parseContentDate(meta.publishedAt), parseContentDate(meta.updatedAt))
}

export const getContentHighlightKind = (
  meta: ContentVersionMeta | undefined,
  lastVisitAt: number
): "new" | "updated" | null => {
  const publishedTs = parseContentDate(meta?.publishedAt)
  const updatedTs = parseContentDate(meta?.updatedAt)
  const versionTs = Math.max(publishedTs, updatedTs)

  if (versionTs <= lastVisitAt) return null
  if (publishedTs > lastVisitAt) return "new"
  if (updatedTs > lastVisitAt) return "updated"
  return null
}
