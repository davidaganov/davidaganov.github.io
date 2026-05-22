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

const iconFromPage = (page: SearchablePage, mapping: ContentMapping): string => {
  if (page.meta?.icon) return page.meta.icon
  const category = categoryFromMapping(mapping)
  if (category === TYPE_PAGE.ARTICLE) return "i-lucide-newspaper"
  if (category === TYPE_PAGE.PROJECT) return "i-lucide-folder-git-2"
  if (category === TYPE_PAGE.TEMPLATE) return "i-lucide-rocket"
  return "i-lucide-file-text"
}

export const mapSearchResults = (
  pages: SearchablePage[],
  query: string,
  t: (key: string) => string
): DocsSearchResult[] => {
  const q = query.trim()
  if (!q) return []

  return pages
    .map((page) => ({ page, mapping: findContentMapping(page.path) }))
    .filter((row): row is { page: SearchablePage; mapping: ContentMapping } => {
      return Boolean(row.mapping && matchesQuery(row.page, q))
    })
    .map(({ page, mapping }) => {
      const title = String(page.title || "")
      return {
        title,
        path: buildUrlFromMapping(mapping),
        category: categoryFromMapping(mapping),
        breadcrumb: breadcrumbFromMapping(mapping, title, t),
        snippet: snippetAroundQuery(page.body, q),
        icon: iconFromPage(page, mapping)
      }
    })
}
