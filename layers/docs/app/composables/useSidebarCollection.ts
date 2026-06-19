import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { useContentHighlights } from "@docs/composables/nav/useContentHighlights"
import { compareContentPages, isNavigationHidden } from "@docs/utils/content/comparePages"
import { toContentPrefix, toRelativeContentPath } from "@docs/utils/content/paths"
import { joinPublicDocsPath } from "@docs/utils/path/joinPublicPath"
import { ROUTE_PATH } from "@base/types"
import type { SidebarCollectionItem } from "@docs/types"

export const useSidebarCollection = async (item: SidebarCollectionItem) => {
  const { t } = useI18n()
  const route = useRoute()
  const localePath = useLocalePath()

  const { collection } = useContentCollection()
  const { getPageHighlight } = useContentHighlights()

  const isOpen = ref(item.defaultOpen ?? false)

  const submenuPanelId = `docs-sidebar-submenu-${useId()}`
  const submenuLabel = computed(() => t(item.label))

  const expandableLabel = computed(() =>
    t("layout.a11y.toggleDocsSubgroup", { title: submenuLabel.value })
  )

  const submenuVisible = computed(() => !item.collapsible || isOpen.value)

  const { data: pages } = await useAsyncData(
    () => `sidebar:collection:${item.source}:${item.pathPrefix || ""}:${collection.value}`,
    async () => {
      const pathPrefix = item.pathPrefix || ROUTE_PATH.HOME
      const queryPrefix = toContentPrefix(pathPrefix)

      return await queryCollection(collection.value)
        .where("path", "LIKE", `%${queryPrefix}%`)
        .select("title", "description", "meta", "path")
        .all()
    },
    {
      watch: [collection]
    }
  )

  const items = computed(() => {
    const list = pages.value || []
    const pathPrefix = item.pathPrefix || ROUTE_PATH.DOCS
    const queryPrefix = toContentPrefix(pathPrefix)

    return list
      .filter((p) => {
        if (typeof p.path !== "string" || !p.path.includes(queryPrefix)) return false
        return !isNavigationHidden(p.meta)
      })
      .sort(compareContentPages)
      .map((p) => {
        const relativePath = toRelativeContentPath(String(p.path), queryPrefix)
        const fullPath = joinPublicDocsPath(pathPrefix, relativePath)

        const highlight = getPageHighlight(fullPath)

        return {
          type: "link" as const,
          label: String(p.title || ""),
          description: String(p.description || ""),
          to: fullPath,
          icon: String(
            (p.meta as { icon?: string } | undefined)?.icon || item.itemIcon || "i-lucide-file-text"
          ),
          translate: false,
          ...(highlight ? { highlight } : {})
        }
      })
      .filter((p) => Boolean(p.label))
  })

  const isIndexActive = computed(() => {
    return (item.indexPage ?? true) && route.path === localePath(item.pathPrefix || "")
  })

  const toggleOpen = () => {
    if (item.collapsible) {
      isOpen.value = !isOpen.value
    }
  }

  return {
    items,
    isOpen,
    submenuPanelId,
    expandableLabel,
    submenuVisible,
    isIndexActive,
    toggleOpen
  }
}
