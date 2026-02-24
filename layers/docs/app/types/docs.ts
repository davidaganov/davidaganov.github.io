import type { Ref } from "vue"
import type { SidebarItem, SidebarCollectionItem } from "@docs/types/sidebar"

export interface DocsSection {
  id: string
  labelKey: string
  icon: string
  basePath: string
  sidebarItems: SidebarItem[]
}

export interface DocsSeoOptions {
  section: Ref<DocsSection | undefined>
  collectionItem: Ref<SidebarCollectionItem | undefined>
  parentCollectionItem: Ref<SidebarCollectionItem | undefined>
  page: Ref<any>
}
