import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { compareContentPages, isNavigationHidden } from "@docs/utils/content/comparePages"
import { getSectionById, getSectionIdByPath } from "@docs/utils/sections"
import { buildSectionSidebarItems } from "@docs/utils/sidebar/buildSectionSidebarItems"
import { DOCS_SECTIONS } from "@docs/constants"

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

    if (!sec) return buildSectionSidebarItems(DOCS_SECTIONS[0]!, [])

    return sidebarItems.value
  })

  return {
    renderedSidebarItems
  }
}
