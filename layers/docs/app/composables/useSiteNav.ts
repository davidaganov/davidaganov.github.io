import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { useContentHighlights } from "@docs/composables/nav/useContentHighlights"
import { compareContentPages, isNavigationHidden } from "@docs/utils/content/comparePages"
import { applyHighlightsToSidebarItems } from "@docs/utils/nav/applySidebarHighlights"
import { buildSectionSidebarItems } from "@docs/utils/sidebar/buildSectionSidebarItems"
import { flattenSiteNavSections } from "@docs/utils/sidebar/flattenSiteNavSections"
import { DOCS_SECTIONS } from "@docs/constants"
import type { DocsSection, SidebarItem } from "@docs/types"

interface SiteNavSection {
  section: DocsSection
  items: SidebarItem[]
}

export const useSiteNav = async () => {
  const { collection } = useContentCollection()
  const { getPageHighlight, getCollectionHighlight } = useContentHighlights()

  const { data: pagesBySectionId } = await useAsyncData(
    () => `site-nav:all-sections:${collection.value}`,
    async () => {
      const entries = await Promise.all(
        DOCS_SECTIONS.map(async (section) => {
          const prefix = `/${section.id}/`
          const pages = await queryCollection(collection.value)
            .where("path", "LIKE", `${prefix}%`)
            .select("title", "meta", "path")
            .all()

          const filtered = pages
            .filter((page) => {
              if (typeof page.path !== "string") return false
              if (!page.path.startsWith(prefix)) return false

              const relative = page.path.slice(prefix.length)
              if (!relative || relative.includes("/")) return false

              return !isNavigationHidden(page.meta)
            })
            .sort(compareContentPages)

          return [section.id, filtered] as const
        })
      )

      return Object.fromEntries(entries)
    },
    {
      watch: [collection]
    }
  )

  const navSections = computed<SiteNavSection[]>(() =>
    DOCS_SECTIONS.map((section) => ({
      section,
      items: applyHighlightsToSidebarItems(
        buildSectionSidebarItems(section, pagesBySectionId.value?.[section.id] ?? []),
        getPageHighlight,
        getCollectionHighlight
      )
    }))
  )

  const flatNavItems = computed(() => flattenSiteNavSections(navSections.value))

  return {
    flatNavItems
  }
}
