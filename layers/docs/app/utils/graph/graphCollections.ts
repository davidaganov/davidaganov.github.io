import { DOCS_SECTIONS } from "@docs/constants"
import type { DocsCollectionDescriptor, SidebarCollectionItem } from "@docs/types"

export const getDocsCollectionDescriptors = (): DocsCollectionDescriptor[] => {
  const out: DocsCollectionDescriptor[] = []

  for (const section of DOCS_SECTIONS) {
    for (const item of section.sidebarItems) {
      if (item.type !== "collection") continue
      const c = item as SidebarCollectionItem
      if (c.indexPage === false) continue

      const contentPathPrefix = `/${section.id}/${c.source}`
      out.push({
        collectionKey: `${section.id}/${c.source}`,
        sectionId: section.id,
        source: c.source,
        contentPathPrefix,
        indexPublicPath: `/docs/${section.id}/${c.source}`,
        titleKey: c.titleKey || c.label
      })
    }
  }

  return out
}

export const describeContentPathForGraph = (
  contentPath: string,
  descriptors: DocsCollectionDescriptor[]
): { collectionKey: string; kind: "index" | "member" } => {
  const path = contentPath.startsWith("/") ? contentPath : `/${contentPath}`

  const sorted = [...descriptors].sort(
    (a, b) => b.contentPathPrefix.length - a.contentPathPrefix.length
  )

  for (const d of sorted) {
    if (path === d.contentPathPrefix) {
      return { collectionKey: d.collectionKey, kind: "index" }
    }
    if (path.startsWith(`${d.contentPathPrefix}/`)) {
      return { collectionKey: d.collectionKey, kind: "member" }
    }
  }

  const seg = path.split("/").filter(Boolean)[0] || "__root__"
  return { collectionKey: `${seg}/__other`, kind: "member" }
}
