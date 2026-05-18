import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { compareContentPages, isNavigationHidden } from "@docs/utils/content/comparePages"
import { toContentPrefix, toRelativeContentPath } from "@docs/utils/content/paths"
import { joinPublicDocsPath } from "@docs/utils/path/joinPublicPath"
import { getSectionById } from "@docs/utils/sections"
import { GITHUB_REPO } from "@base/constants"
import type {
  ContentPageNavRow,
  DocsNavPageItem,
  FlatNavItem,
  SidebarCollectionItem,
  SidebarItem,
  SidebarLinkItem
} from "@docs/types"

const withLocalePrefix = (path: string, localePrefix: string) => {
  return localePrefix ? `${localePrefix}${path}` : path
}

const normalizeNavPath = (path: string): string => {
  return path.replace(/^\/[a-z]{2}\//, "/").replace(/\/$/, "")
}

const buildFlatNav = (
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
          path: joinPublicDocsPath(pathPrefix, relativePath)
        })
      }
    }
  }

  return result
}

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
