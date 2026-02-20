import { DOCS_SECTIONS } from "@docs/config/sections"
import type { DocsSection } from "@docs/types/docs"
import type { SidebarItem, SidebarLinkItem } from "@docs/types/sidebar"
import { LOCALE_PREFIX_RE } from "@base/constants"
import { ROUTE_PATH } from "@base/types/enums"

const toDocsSectionPath = (sectionId: string, suffix?: string): string => {
  if (!suffix) return `/docs/${sectionId}`
  return `/docs/${sectionId}/${suffix}`
}

const findFirstLinkInItems = (items: SidebarItem[], sectionId: string): string | undefined => {
  for (const item of items) {
    if (item.type === "link") {
      if (item.to) return item.to
      if (item.name) return toDocsSectionPath(sectionId, item.name)
    }

    if (item.type === "collection") {
      if (item.pathPrefix) return item.pathPrefix
      return toDocsSectionPath(sectionId, item.source)
    }

    if (item.type === "group") {
      const firstGroupLink = item.items.find((groupItem: SidebarLinkItem) => Boolean(groupItem.to))
      if (firstGroupLink?.to) return firstGroupLink.to
    }
  }

  return undefined
}

export const normalizeDocsPath = (path: string): string =>
  path.replace(LOCALE_PREFIX_RE, "") || ROUTE_PATH.HOME

export const getSectionIdByPath = (path: string): string => {
  const normalized = normalizeDocsPath(path)
  const segments = normalized.split(ROUTE_PATH.HOME).filter(Boolean)

  if (segments[0] !== "docs") return ""

  return segments[1] || ""
}

export const getSectionById = (id: string): DocsSection | undefined =>
  DOCS_SECTIONS.find((section) => section.id === id)

export const getFirstPathForSection = (section: DocsSection | undefined): string => {
  if (!section) return ROUTE_PATH.DOCS
  return findFirstLinkInItems(section.sidebarItems, section.id) || section.basePath
}

export const getFirstPathForFirstSection = (): string => getFirstPathForSection(DOCS_SECTIONS[0])
