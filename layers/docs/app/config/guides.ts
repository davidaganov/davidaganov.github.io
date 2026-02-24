import type { SidebarItem } from "@docs/types/sidebar"

export const GUIDES_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "collection",
    source: "articles",
    label: "layout.navigation.menu.articles",
    indexPage: true,
    pageType: "article",
    titleKey: "layout.navigation.menu.articles",
    subtitleKey: "pages.articles.indexNote",
    emptyKey: "pages.articles.empty",
    showSourceTabs: true,
    icon: "i-lucide-book-open",
    collapsible: true,
    defaultOpen: true
  }
]
