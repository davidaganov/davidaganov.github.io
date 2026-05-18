import { compareContentPages, isNavigationHidden } from "@docs/utils/content/comparePages"
import { toContentPrefix, toRelativeContentPath } from "@docs/utils/content/paths"
import type {
  ContentPageNavRow,
  FlatNavItem,
  SidebarCollectionItem,
  SidebarItem,
  SidebarLinkItem
} from "@docs/types"

const withLocalePrefix = (path: string, localePrefix: string) => {
  return localePrefix ? `${localePrefix}${path}` : path
}

export const buildFlatNav = (
  sectionId: string,
  sidebarItems: SidebarItem[],
  pages: ContentPageNavRow[],
  localePrefix = ""
): FlatNavItem[] => {
  const pageBySlug = new Map(
    pages.map((page) => {
      const slug =
        String(page.path || "")
          .split("/")
          .filter(Boolean)
          .at(-1) || ""
      return [slug, page] as const
    })
  )

  const result: FlatNavItem[] = []

  for (const item of sidebarItems) {
    if (item.type === "divider") continue

    if (item.type === "link") {
      const linkItem = item as SidebarLinkItem
      if (linkItem.to) {
        const page = pages.find((p) =>
          String(p.path || "").endsWith(linkItem.to!.replace(/^\/docs\/[^/]+/, ""))
        )
        result.push({
          titleKey: "",
          title: linkItem.label || (page ? String(page.title || "") : ""),
          path: withLocalePrefix(linkItem.to, localePrefix)
        })
      } else if (linkItem.name) {
        const page = pageBySlug.get(linkItem.name)
        if (!page) continue
        result.push({
          titleKey: "",
          title: String(page.title || linkItem.name),
          path: withLocalePrefix(`/docs/${sectionId}/${linkItem.name}`, localePrefix)
        })
      }
    }

    if (item.type === "collection") {
      const collItem = item as SidebarCollectionItem
      const rawPathPrefix = collItem.pathPrefix || `/docs/${sectionId}/${collItem.source}`
      const pathPrefix = withLocalePrefix(rawPathPrefix, localePrefix)
      const queryPrefix = toContentPrefix(rawPathPrefix)

      if (collItem.indexPage !== false) {
        result.push({
          titleKey: collItem.label,
          title: collItem.label,
          path: pathPrefix,
          isSection: true
        })
      }

      const children = pages
        .filter((p) => p.path.includes(queryPrefix))
        .filter((p) => {
          const rel = toRelativeContentPath(p.path, queryPrefix)
          if (!rel || rel === "/") return false
          return !isNavigationHidden(p.meta)
        })
        .sort(compareContentPages)

      for (const child of children) {
        const relativePath = toRelativeContentPath(child.path, queryPrefix)
        result.push({
          titleKey: "",
          title: String(child.title || ""),
          path: pathPrefix + relativePath
        })
      }
    }
  }

  return result
}

export const normalizeNavPath = (path: string): string => {
  return path.replace(/^\/[a-z]{2}\//, "/").replace(/\/$/, "")
}
