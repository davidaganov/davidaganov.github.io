import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { compareContentPages, isNavigationHidden } from "@docs/utils/content/comparePages"
import { getSectionById, getSectionIdByPath } from "@docs/utils/sections"
import { DOCS_SECTIONS } from "@docs/constants"
import type { SidebarCollectionItem, SidebarItem, SidebarLinkItem } from "@docs/types"

export const useSidebarItems = async () => {
  const route = useRoute()
  const { collection } = useContentCollection()

  const sectionId = computed(() => getSectionIdByPath(route.path))
  const section = computed(() => getSectionById(sectionId.value))

  const { data: sectionRootPages } = await useAsyncData(
    () => `sidebar:section-root:${collection.value}:${sectionId.value}`,
    async () => {
      if (!sectionId.value) return []

      const prefix = `/${sectionId.value}/`
      const pages = await queryCollection(collection.value)
        .where("path", "LIKE", `${prefix}%`)
        .select("title", "meta", "path")
        .all()

      return pages
        .filter((page) => {
          if (typeof page.path !== "string") return false
          if (!page.path.startsWith(prefix)) return false

          const relative = page.path.slice(prefix.length)
          if (!relative || relative.includes("/")) return false

          return !isNavigationHidden(page.meta)
        })
        .sort(compareContentPages)
    },
    {
      watch: [collection, sectionId]
    }
  )

  const sidebarItems = computed<SidebarItem[]>(() => {
    const currentSectionId = sectionId.value
    const currentSection = section.value

    if (!currentSection || !currentSectionId) {
      return DOCS_SECTIONS[0]?.sidebarItems || []
    }

    const pages = sectionRootPages.value || []
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
        to: `/docs/${currentSectionId}/${name}`,
        label: String(page.title || name),
        icon: String(meta.icon || item.icon || "i-lucide-file-text"),
        translate: false
      }
    }

    const explicitLinkNames = new Set(
      currentSection.sidebarItems
        .filter((item): item is SidebarLinkItem => item.type === "link" && Boolean(item.name))
        .map((item) => String(item.name))
    )

    const resolved = currentSection.sidebarItems
      .map((item): SidebarItem | null => {
        if (item.type === "link") return resolveLinkItem(item)

        if (item.type === "collection") {
          const collectionItem: SidebarCollectionItem = {
            ...item,
            pathPrefix: item.pathPrefix || `/docs/${currentSectionId}/${item.source}`
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
        to: `/docs/${currentSectionId}/${slug}`,
        label: String(page.title || slug),
        icon: String(meta.icon || "i-lucide-file-text"),
        translate: false
      })
    }

    return [...resolved, ...autoLinks]
  })

  const renderedSidebarItems = computed(() => {
    const sid = getSectionIdByPath(route.path)
    const sec = getSectionById(sid)

    if (!sec) return DOCS_SECTIONS[0]?.sidebarItems || []

    return sidebarItems.value
  })

  return {
    renderedSidebarItems
  }
}
