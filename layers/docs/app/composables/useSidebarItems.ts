import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { useContentHighlights } from "@docs/composables/nav/useContentHighlights"
import { compareContentPages, isNavigationHidden } from "@docs/utils/content/comparePages"
import { applyHighlightsToSidebarItems } from "@docs/utils/nav/applySidebarHighlights"
import { getSectionById, getSectionIdByPath } from "@docs/utils/sections"
import { buildSectionSidebarItems } from "@docs/utils/sidebar/buildSectionSidebarItems"
import { DOCS_SECTIONS } from "@docs/constants"

export const useSidebarItems = async () => {
  const route = useRoute()
  const { collection } = useContentCollection()
  const { getPageHighlight, getCollectionHighlight } = useContentHighlights()

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

  const sidebarItems = computed(() => {
    const currentSection = section.value

    if (!currentSection) {
      return buildSectionSidebarItems(DOCS_SECTIONS[0]!, [])
    }

    return buildSectionSidebarItems(currentSection, sectionRootPages.value || [])
  })

  const renderedSidebarItems = computed(() => {
    const sid = getSectionIdByPath(route.path)
    const sec = getSectionById(sid)

    const items = !sec ? buildSectionSidebarItems(DOCS_SECTIONS[0]!, []) : sidebarItems.value

    return applyHighlightsToSidebarItems(items, getPageHighlight, getCollectionHighlight)
  })

  return {
    renderedSidebarItems
  }
}
