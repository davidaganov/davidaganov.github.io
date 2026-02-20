import type { SidebarItem } from "@docs/types/sidebar"

export interface DocsSection {
  id: string
  labelKey: string
  icon: string
  basePath: string
  sidebarItems: SidebarItem[]
}
