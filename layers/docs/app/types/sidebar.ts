export type SidebarItemType = "link" | "group" | "collection" | "divider"

export interface SidebarBaseItem {
  type: SidebarItemType
  class?: string
}

export interface SidebarLinkItem extends SidebarBaseItem {
  type: "link"
  name?: string
  label?: string
  to?: string
  href?: string
  target?: string
  icon?: string
  translate?: boolean
}

export interface SidebarDividerItem extends SidebarBaseItem {
  type: "divider"
  label?: string
}

export interface SidebarGroupItem extends SidebarBaseItem {
  type: "group"
  label?: string
  items: SidebarLinkItem[]
  collapsible?: boolean
  defaultOpen?: boolean
  icon?: string
}

export interface SidebarCollectionItem extends SidebarBaseItem {
  type: "collection"
  source: string
  label: string
  indexPage?: boolean
  pageType?: string
  titleKey?: string
  emptyKey?: string
  showSourceTabs?: boolean
  icon?: string
  itemIcon?: string
  pathPrefix?: string
  collapsible?: boolean
  defaultOpen?: boolean
}

export type SidebarItem =
  | SidebarLinkItem
  | SidebarDividerItem
  | SidebarGroupItem
  | SidebarCollectionItem
