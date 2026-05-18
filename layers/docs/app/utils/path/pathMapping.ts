import { DOCS_SECTIONS } from "@docs/constants"
import type { ContentMapping, SidebarCollectionItem } from "@docs/types"

export const findContentMapping = (contentPath: string): ContentMapping | null => {
  const path = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  const segments = path.split("/").filter(Boolean)

  for (const section of DOCS_SECTIONS) {
    for (const item of section.sidebarItems) {
      if (item.type !== "collection") continue

      const coll = item as SidebarCollectionItem
      const source = coll.source

      if (segments[0] === source) {
        return {
          path,
          sectionId: section.id,
          collectionSource: source,
          collectionLabel: coll.label,
          isCollectionItem: true
        }
      }

      if (segments[0] === section.id && segments[1] === source) {
        return {
          path,
          sectionId: section.id,
          collectionSource: source,
          collectionLabel: coll.label,
          isCollectionItem: true
        }
      }
    }

    if (segments[0] === section.id) {
      return {
        path,
        sectionId: section.id,
        isCollectionItem: false
      }
    }
  }

  return null
}

export const buildUrlFromMapping = (mapping: ContentMapping): string => {
  if (mapping.isCollectionItem && mapping.collectionSource) {
    const sectionScopedPrefix = `/${mapping.sectionId}/${mapping.collectionSource}`

    if (mapping.path.startsWith(sectionScopedPrefix)) return `/docs${mapping.path}`

    const flatPrefix = `/${mapping.collectionSource}`
    const suffix = mapping.path.startsWith(flatPrefix)
      ? mapping.path.slice(flatPrefix.length)
      : mapping.path

    return `/docs/${mapping.sectionId}/${mapping.collectionSource}${suffix}`
  }
  return `/docs${mapping.path}`
}
