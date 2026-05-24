import { findSiteSearchPage } from "@app/config/site-search-pages"
import { extractPlainText, snippetAroundQuery } from "@docs/utils/content/extractPlainText"
import { buildUrlFromMapping, findContentMapping } from "@docs/utils/path/pathMapping"
import { DOCS_SECTIONS } from "@docs/constants"
import {
  type ContentMapping,
  type DocsSearchResult,
  type SearchablePage,
  type SearchIndexEntry,
  type SearchIndexResultMeta,
  TYPE_PAGE
} from "@docs/types"

export const matchesSearchQuery = (page: SearchablePage, query: string): boolean => {
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

export const resolveSearchResultMeta = (
  page: SearchablePage,
  t: (key: string) => string
): SearchIndexResultMeta | null => {
  const mapping = findContentMapping(page.path)
  const site = findSiteSearchPage(page.path)
  if (!mapping && !site) return null

  const title = String(page.title || "")

  if (site) {
    return {
      title,
      path: site.path,
      category: TYPE_PAGE.SITE,
      breadcrumb: [t("layout.navigation.sections.site"), title],
      icon: iconFromPage(page, null, TYPE_PAGE.SITE)
    }
  }

  if (!mapping) return null

  const category = categoryFromMapping(mapping)
  return {
    title,
    path: buildUrlFromMapping(mapping),
    category,
    breadcrumb: breadcrumbFromMapping(mapping, title, t),
    icon: iconFromPage(page, mapping, category)
  }
}

const snippetForPage = (page: SearchablePage, query: string): string | undefined => {
  const fromBody = snippetAroundQuery(page.body, query)
  if (fromBody) return fromBody

  const q = query.toLowerCase()
  if (page.description && page.description.toLowerCase().includes(q)) {
    return page.description
  }

  return undefined
}

export const filterSearchIndexResults = (
  entries: SearchIndexEntry[],
  query: string
): DocsSearchResult[] => {
  const q = query.trim()
  if (!q) return []

  const results: DocsSearchResult[] = []

  for (const entry of entries) {
    if (!matchesSearchQuery(entry, q)) continue

    results.push({
      ...entry.result,
      snippet: snippetForPage(entry, q)
    })
  }

  return results
}
