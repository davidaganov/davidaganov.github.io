import type { Collections } from "@nuxt/content"
import type { SidebarItem, SidebarLinkItem, SidebarCollectionItem } from "@docs/types/sidebar"
import { getQueryPrefix, getRelativePath } from "@docs/utils/content"
import { getSectionById } from "@docs/utils/sections"
import { GITHUB_REPO } from "@base/constants/config"

export interface NavPageItem {
  title: string
  path: string
}

/**
 * Builds a flat ordered list of navigable items from the section's sidebar config.
 * - SidebarLinkItem → resolved path from pages map
 * - SidebarCollectionItem → pathPrefix (the collection index page)
 * Dividers are skipped.
 */
const buildNavList = (
  sectionId: string,
  sidebarItems: SidebarItem[],
  pages: Array<{ path: string; title: string; meta: unknown }>,
  localePrefix: string
): Array<{ titleKey: string; title: string; path: string }> => {
  const withPrefix = (path: string) => (localePrefix ? `${localePrefix}${path}` : path)
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

  const result: Array<{ titleKey: string; title: string; path: string }> = []

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
          path: withPrefix(linkItem.to)
        })
      } else if (linkItem.name) {
        const page = pageBySlug.get(linkItem.name)
        if (!page) continue
        result.push({
          titleKey: "",
          title: String(page.title || linkItem.name),
          path: withPrefix(`/docs/${sectionId}/${linkItem.name}`)
        })
      }
    }

    if (item.type === "collection") {
      const collItem = item as SidebarCollectionItem
      const rawPathPrefix = collItem.pathPrefix || `/docs/${sectionId}/${collItem.source}`
      const pathPrefix = withPrefix(rawPathPrefix)

      if (collItem.indexPage !== false) {
        result.push({
          titleKey: collItem.label,
          title: collItem.label,
          path: pathPrefix
        })
      }

      // Add children of the collection
      const queryPrefix = getQueryPrefix(rawPathPrefix)
      const children = pages
        .filter((p) => p.path.includes(queryPrefix))
        .filter((p) => {
          const rel = getRelativePath(p.path, queryPrefix)
          if (!rel || rel === "/") return false

          const hidden = Boolean(
            (p.meta as { navigation?: boolean } | undefined)?.navigation === false
          )
          return !hidden
        })
        .sort((a, b) => {
          const aMeta = (a.meta as { order?: number } | undefined) || {}
          const bMeta = (b.meta as { order?: number } | undefined) || {}
          const aOrder = typeof aMeta.order === "number" ? aMeta.order : Number.MAX_SAFE_INTEGER
          const bOrder = typeof bMeta.order === "number" ? bMeta.order : Number.MAX_SAFE_INTEGER
          if (aOrder !== bOrder) return aOrder - bOrder
          return String(a.title || "").localeCompare(String(b.title || ""))
        })

      for (const child of children) {
        const relativePath = getRelativePath(child.path, queryPrefix)
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

/** Normalize path: strip locale prefix and trailing slash */
const normalizePath = (path: string) => path.replace(/^\/[a-z]{2}\//, "/").replace(/\/$/, "")

export const useArticleNavigation = (docsPath: Ref<string>) => {
  const { locale, defaultLocale, t } = useI18n()

  /** "/en" for non-default locales, "" for default (no prefix needed) */
  const localePrefix = computed(() => (locale.value !== defaultLocale ? `/${locale.value}` : ""))

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  const sectionId = computed(() => {
    const segments = normalizePath(docsPath.value).split("/").filter(Boolean)
    if (segments[0] !== "docs") return ""
    return segments[1] || ""
  })

  const section = computed(() => getSectionById(sectionId.value))

  const { data: sectionPages } = useAsyncData(
    () => `article-nav:${collection.value}:${sectionId.value}`,
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

  const flatNavItems = computed(() => {
    const currentSection = section.value
    if (!currentSection) return []

    const pages = (sectionPages.value || [])
      .filter((page) => {
        if (typeof page.path !== "string") return false
        const prefix = `/${sectionId.value}/`
        if (!page.path.startsWith(prefix)) return false

        const hidden = Boolean(
          (page.meta as { navigation?: boolean } | undefined)?.navigation === false
        )
        return !hidden
      })
      .sort((a, b) => {
        const aMeta = (a.meta as { order?: number } | undefined) || {}
        const bMeta = (b.meta as { order?: number } | undefined) || {}
        const aOrder = typeof aMeta.order === "number" ? aMeta.order : Number.MAX_SAFE_INTEGER
        const bOrder = typeof bMeta.order === "number" ? bMeta.order : Number.MAX_SAFE_INTEGER
        if (aOrder !== bOrder) return aOrder - bOrder
        return String(a.title || "").localeCompare(String(b.title || ""))
      })

    return buildNavList(sectionId.value, currentSection.sidebarItems, pages, localePrefix.value)
  })

  const currentIndex = computed(() => {
    const normalizedCurrent = normalizePath(docsPath.value)
    return flatNavItems.value.findIndex((item) => normalizePath(item.path) === normalizedCurrent)
  })

  const resolveTitle = (item: { titleKey: string; title: string }) =>
    item.titleKey ? t(item.titleKey) : item.title

  const prevPage = computed<NavPageItem | null>(() => {
    const idx = currentIndex.value
    if (idx <= 0) return null
    const item = flatNavItems.value[idx - 1]
    if (!item) return null
    return { title: resolveTitle(item), path: item.path }
  })

  const nextPage = computed<NavPageItem | null>(() => {
    const idx = currentIndex.value
    if (idx < 0 || idx >= flatNavItems.value.length - 1) return null
    const item = flatNavItems.value[idx + 1]
    if (!item) return null
    return { title: resolveTitle(item), path: item.path }
  })

  /**
   * GitHub URL to the source .md file for the current page.
   * Returns undefined for collection index pages (they have no standalone .md).
   * Pattern: https://github.com/{GITHUB_REPO}/blob/main/content/{locale}/{section}/{slug}.md
   */
  const githubMdUrl = computed(() => {
    const segments = normalizePath(docsPath.value).split("/").filter(Boolean)
    // segments: ["docs", "section", ...slug]
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
