import type { Ref } from "vue"
import type { SidebarItem, SidebarCollectionItem } from "@docs/types/sidebar"

export interface DocsSection {
  id: string
  labelKey: string
  icon: string
  basePath: string
  sidebarItems: SidebarItem[]
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
