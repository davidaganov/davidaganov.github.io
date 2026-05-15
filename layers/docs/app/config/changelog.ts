import type { SidebarItem } from "@docs/types/sidebar"

export const CHANGELOG_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "collection",
    source: "releases",
    label: "docs.changelog.sidebarIndex",
    indexPage: true,
    pageType: "article",
    titleKey: "docs.changelog.title",
    emptyKey: "docs.changelog.empty",
    icon: "i-lucide-scroll-text",
    collapsible: true,
    defaultOpen: true,
    itemIcon: "i-lucide-scroll-text"
  }
]
