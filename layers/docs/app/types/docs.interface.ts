import type { NavHighlightKind, SidebarCollectionItem, SidebarItem } from "@docs/types"

export type DocsSectionNavPlacement = "primary" | "trailing"

export interface DocsSection {
  id: string
  labelKey: string
  icon: string
  basePath: string
  sidebarItems: SidebarItem[]
  navPlacement?: DocsSectionNavPlacement
}

export interface DocsHeaderNavAction {
  id: string
  icon: string
  label: string
  to: string
  active: boolean
  highlight: NavHighlightKind | null
  mobileInline: boolean
}

export interface DocsPageMeta {
  githubUrl?: string
  publishedAt?: string
  updatedAt?: string
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
