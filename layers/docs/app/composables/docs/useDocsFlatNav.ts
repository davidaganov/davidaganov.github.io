import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { buildFlatNav, normalizeNavPath } from "@docs/utils/buildFlatNav"
import { getSectionById } from "@docs/utils/sections"
import { GITHUB_REPO } from "@base/constants"
import type { DocsNavPageItem, FlatNavItem } from "@docs/types"

export const useDocsFlatNav = (publicDocsPath: Ref<string>) => {
  const { locale, defaultLocale, t } = useI18n()
  const { collection } = useContentCollection()

  const localePrefix = computed(() => (locale.value !== defaultLocale ? `/${locale.value}` : ""))

  const sectionId = computed(() => {
    const segments = normalizeNavPath(publicDocsPath.value).split("/").filter(Boolean)
    if (segments[0] !== "docs") return ""
    return segments[1] || ""
  })

  const section = computed(() => getSectionById(sectionId.value))

  const { data: sectionPages } = useAsyncData(
    () => `docs-flat-nav:${collection.value}:${sectionId.value}`,
    async () => {
      if (!sectionId.value) return []
      const prefix = `/${sectionId.value}/`
      return await queryCollection(collection.value)
        .where("path", "LIKE", `${prefix}%`)
        .select("title", "meta", "path")
        .all()
    },
    { watch: [locale, sectionId] }
  )

  const flatNavItems = computed<FlatNavItem[]>(() => {
    const currentSection = section.value
    if (!currentSection) return []
    return buildFlatNav(
      sectionId.value,
      currentSection.sidebarItems,
      sectionPages.value || [],
      localePrefix.value
    )
  })

  const currentIndex = computed(() => {
    const normalizedCurrent = normalizeNavPath(publicDocsPath.value)
    return flatNavItems.value.findIndex((item) => normalizeNavPath(item.path) === normalizedCurrent)
  })

  const resolveTitle = (item: FlatNavItem) => (item.titleKey ? t(item.titleKey) : item.title)

  const prevPage = computed<DocsNavPageItem | null>(() => {
    const idx = currentIndex.value
    if (idx <= 0) return null
    const item = flatNavItems.value[idx - 1]
    if (!item) return null
    return { title: resolveTitle(item), path: item.path, isSection: item.isSection }
  })

  const nextPage = computed<DocsNavPageItem | null>(() => {
    const idx = currentIndex.value
    if (idx < 0 || idx >= flatNavItems.value.length - 1) return null
    const item = flatNavItems.value[idx + 1]
    if (!item) return null
    return { title: resolveTitle(item), path: item.path, isSection: item.isSection }
  })

  const githubMdUrl = computed(() => {
    const segments = normalizeNavPath(publicDocsPath.value).split("/").filter(Boolean)
    if (segments[0] !== "docs" || segments.length < 3) return undefined
    const sectionSeg = segments[1]
    const slug = segments.slice(2).join("/")
    return `https://github.com/${GITHUB_REPO}/blob/main/content/${locale.value}/${sectionSeg}/${slug}.md`
  })

  return {
    prevPage,
    nextPage,
    githubMdUrl
  }
}
