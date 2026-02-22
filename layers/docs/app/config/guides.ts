import type { SidebarItem } from "@docs/types/sidebar"

export const GUIDES_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "collection",
    source: "architecture",
    label: "guides.nav.architecture",
    indexPage: true,
    pageType: "article",
    titleKey: "guides.nav.architecture",
    emptyKey: "guides.architecture.empty",
    icon: "i-lucide-book-open",
    collapsible: true,
    defaultOpen: true,
    itemIcon: "i-lucide-folder-open"
  }
]
