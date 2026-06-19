import { normalizePublicDocsPath } from "@docs/utils/path/publicPath"
import type {
  NavHighlightKind,
  SidebarCollectionItem,
  SidebarItem,
  SidebarLinkItem
} from "@docs/types"

export const applyHighlightsToSidebarItems = (
  items: SidebarItem[],
  getPageHighlight: (slug: string) => NavHighlightKind | null,
  getCollectionHighlight: (pathPrefix: string) => NavHighlightKind | null
): SidebarItem[] => {
  return items.map((item) => {
    if (item.type === "link") {
      const slug = item.to ? normalizePublicDocsPath(item.to) : ""
      const highlight = slug ? getPageHighlight(slug) : null
      if (!highlight) return item
      return { ...item, highlight } satisfies SidebarLinkItem
    }

    if (item.type === "collection") {
      const pathPrefix = item.pathPrefix || ""
      const highlight = pathPrefix ? getCollectionHighlight(pathPrefix) : null
      if (!highlight) return item
      return { ...item, highlight } satisfies SidebarCollectionItem
    }

    return item
  })
}
