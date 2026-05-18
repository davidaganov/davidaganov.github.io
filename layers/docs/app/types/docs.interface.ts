import type { SidebarCollectionItem, SidebarItem } from "@docs/types"

export type DocsSectionNavPlacement = "primary" | "trailing"

export type DocsSectionUnreadBadge = "changelog"

export interface DocsSection {
  id: string
  labelKey: string
  icon: string
  basePath: string
  sidebarItems: SidebarItem[]
  navPlacement?: DocsSectionNavPlacement
  unreadBadge?: DocsSectionUnreadBadge
}

export interface DocsHeaderNavAction {
  id: string
  icon: string
  label: string
  to: string
  active: boolean
  showBadge: boolean
  badgeAriaLabel?: string
  mobileInline: boolean
}

export interface DocsPageMeta {
  githubUrl?: string
  publishedAt?: string
}

export interface DocsPageData {
  title?: string
  description?: string
  meta?: DocsPageMeta
  seo?: {
    title?: string
    description?: string
    ogImage?: string
    image?: string
  }
}

export interface DocsBreadcrumbItem {
  label: string
  to?: string
}

export interface DocsSeoOptions {
  section: Ref<DocsSection | undefined>
  collectionItem: Ref<SidebarCollectionItem | undefined>
  parentCollectionItem: Ref<SidebarCollectionItem | undefined>
  page: Ref<unknown>
}

export interface DocsArchiveEntry {
  path: string
  content: string
}

export interface DocsNavPageItem {
  title: string
  path: string
  isSection?: boolean
}
