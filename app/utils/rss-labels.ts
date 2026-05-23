import type { ContentRssEntry } from "../types"
import { getRssContentPathMeta } from "./rss"

const uniqueLabels = (labels: string[]): string[] => {
  const seen = new Set<string>()
  const result: string[] = []

  for (const label of labels) {
    const trimmed = label.trim()
    if (!trimmed) continue
    const key = trimmed.toLocaleLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(trimmed)
  }

  return result
}

export const resolveRssEntryCategories = (
  entry: ContentRssEntry,
  t: (key: string) => string
): string[] => {
  const path = String(entry.path || "")
  const pathMeta = getRssContentPathMeta(path)
  const sectionLabel = pathMeta ? t(pathMeta.sectionLabelKey) : t("docs.seo.defaultSection")
  const collectionLabel = pathMeta ? t(pathMeta.collectionLabelKey) : ""
  const tagLabels = entry.meta?.tags?.map((tag) => tag.trim()).filter(Boolean) ?? []

  return uniqueLabels(
    collectionLabel ? [sectionLabel, collectionLabel, ...tagLabels] : [sectionLabel, ...tagLabels]
  )
}
