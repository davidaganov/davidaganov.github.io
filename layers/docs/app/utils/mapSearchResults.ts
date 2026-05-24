import { findSiteSearchPage } from "@app/config/site-search-pages"
import { extractPlainText, snippetAroundQuery } from "@docs/utils/content/extractPlainText"
import { buildUrlFromMapping, findContentMapping } from "@docs/utils/path/pathMapping"
import { DOCS_SECTIONS } from "@docs/constants"
import {
  type ContentMapping,
  type DocsSearchResult,
  type SearchablePage,
  TYPE_PAGE
} from "@docs/types"

const matchesQuery = (page: SearchablePage, query: string): boolean => {
  const q = query.toLowerCase()
  return (
    String(page.title || "")
      .toLowerCase()
      .includes(q) ||
    String(page.description || "")
      .toLowerCase()
      .includes(q) ||
    extractPlainText(page.body).toLowerCase().includes(q)
  )
}

const categoryFromMapping = (mapping: ContentMapping): TYPE_PAGE => {
  if (!mapping.isCollectionItem) return TYPE_PAGE.DOCS
  if (mapping.collectionSource === "articles") return TYPE_PAGE.ARTICLE
  if (mapping.collectionSource === "projects") return TYPE_PAGE.PROJECT
  if (mapping.collectionSource === "templates") return TYPE_PAGE.TEMPLATE
  return TYPE_PAGE.DOCS
}

const breadcrumbFromMapping = (
  mapping: ContentMapping,
  title: string,
  t: (key: string) => string
): string[] => {
  const section = DOCS_SECTIONS.find((s) => s.id === mapping.sectionId)
  const sectionLabel = section ? t(section.labelKey) : mapping.sectionId

  if (mapping.isCollectionItem && mapping.collectionSource) {
    const collectionLabel = mapping.collectionLabel
      ? t(mapping.collectionLabel)
      : mapping.collectionSource
    return [sectionLabel, collectionLabel, title]
  }

  const sectionPrefixRe = new RegExp(`^/(?:${mapping.sectionId})?/`)
  const segments = mapping.path.replace(sectionPrefixRe, "").split("/").filter(Boolean)

  if (segments.length > 1) {
    return [sectionLabel, ...segments.slice(0, -1), title]
  }

  return [sectionLabel, title]
}

const iconFromPage = (
  page: SearchablePage,
  mapping: ContentMapping | null,
  category: TYPE_PAGE
): string => {
  if (page.meta?.icon) return page.meta.icon
  if (category === TYPE_PAGE.ARTICLE) return "i-lucide-newspaper"
  if (category === TYPE_PAGE.PROJECT) return "i-lucide-folder-git-2"
  if (category === TYPE_PAGE.TEMPLATE) return "i-lucide-rocket"
  if (mapping) return "i-lucide-file-text"
  return "i-lucide-file-text"
}

export const mapSearchResults = (
  pages: SearchablePage[],
  query: string,
  t: (key: string) => string
): DocsSearchResult[] => {
  const q = query.trim()
  if (!q) return []

  const siteSectionLabel = t("layout.navigation.sections.site")
  const results: DocsSearchResult[] = []

  for (const page of pages) {
    if (!matchesQuery(page, q)) continue

    const mapping = findContentMapping(page.path)
    const site = findSiteSearchPage(page.path)
    if (!mapping && !site) continue

    const title = String(page.title || "")

    if (site) {
      results.push({
        title,
        path: site.path,
        category: TYPE_PAGE.SITE,
        breadcrumb: [siteSectionLabel, title],
        snippet:
          snippetAroundQuery(page.body, q) ||
          (page.description && page.description.toLowerCase().includes(q.toLowerCase())
            ? page.description
            : undefined),
        icon: iconFromPage(page, null, TYPE_PAGE.SITE)
      })
      continue
    }

    if (!mapping) continue

    const category = categoryFromMapping(mapping)
    results.push({
      title,
      path: buildUrlFromMapping(mapping),
      category,
      breadcrumb: breadcrumbFromMapping(mapping, title, t),
      snippet: snippetAroundQuery(page.body, q),
      icon: iconFromPage(page, mapping, category)
    })
  }

  return results
}
