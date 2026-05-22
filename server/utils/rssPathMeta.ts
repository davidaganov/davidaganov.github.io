import { DOCS_SECTIONS } from "@docs/constants"
import type { RssContentPathMeta } from "@app/types"
import type { SidebarCollectionItem } from "@docs/types"

export const getRssContentPathMeta = (contentPath: string): RssContentPathMeta | null => {
  const path = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  const segments = path.split("/").filter(Boolean)

  if (segments.length < 3) return null

  const sectionId = segments[0] || ""
  const collectionSource = segments[1] || ""
  if (!sectionId || !collectionSource) return null
  const section = DOCS_SECTIONS.find((entry) => entry.id === sectionId)
  if (!section) return null

  const collection = section.sidebarItems.find(
    (item): item is SidebarCollectionItem =>
      item.type === "collection" && item.source === collectionSource
  )

  if (!collection) return null

  return {
    sectionId,
    collectionSource,
    sectionLabelKey: section.labelKey,
    collectionLabelKey: collection.label
  }
}
