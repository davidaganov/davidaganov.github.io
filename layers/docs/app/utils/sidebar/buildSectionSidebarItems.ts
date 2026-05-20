import type { DocsSection, SidebarCollectionItem, SidebarItem, SidebarLinkItem } from "@docs/types"

type SectionRootPage = {
  title?: string | null
  meta?: unknown
  path?: string | null
}

export const buildSectionSidebarItems = (
  section: DocsSection,
  pages: SectionRootPage[]
): SidebarItem[] => {
  const sectionId = section.id
  const pageBySlug = new Map(
    pages
      .map((page) => {
        const slug =
          String(page.path || "")
            .split("/")
            .filter(Boolean)
            .at(-1) || ""
        return [slug, page] as const
      })
      .filter(([slug]) => Boolean(slug))
  )

  const resolveLinkItem = (item: SidebarLinkItem): SidebarLinkItem | null => {
    const name = item.name
    if (!name) return item

    const page = pageBySlug.get(name)
    if (!page) return null

    const meta = (page.meta as { icon?: string } | undefined) || {}
    return {
      ...item,
      to: `/docs/${sectionId}/${name}`,
      label: String(page.title || name),
      icon: String(meta.icon || item.icon || "i-lucide-file-text"),
      translate: false
    }
  }

  const explicitLinkNames = new Set(
    section.sidebarItems
      .filter((item): item is SidebarLinkItem => item.type === "link" && Boolean(item.name))
      .map((item) => String(item.name))
  )

  const resolved = section.sidebarItems
    .map((item): SidebarItem | null => {
      if (item.type === "link") return resolveLinkItem(item)

      if (item.type === "collection") {
        const collectionItem: SidebarCollectionItem = {
          ...item,
          pathPrefix: item.pathPrefix || `/docs/${sectionId}/${item.source}`
        }

        return collectionItem
      }

      return item
    })
    .filter((item): item is SidebarItem => Boolean(item))

  const autoLinks: SidebarLinkItem[] = []

  for (const page of pages) {
    const slug =
      String(page.path || "")
        .split("/")
        .filter(Boolean)
        .at(-1) || ""

    if (!slug || explicitLinkNames.has(slug)) continue

    const meta = (page.meta as { icon?: string } | undefined) || {}

    autoLinks.push({
      type: "link",
      name: slug,
      to: `/docs/${sectionId}/${slug}`,
      label: String(page.title || slug),
      icon: String(meta.icon || "i-lucide-file-text"),
      translate: false
    })
  }

  return [...resolved, ...autoLinks]
}
