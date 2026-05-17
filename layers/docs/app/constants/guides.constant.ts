import type { SidebarItem } from "@docs/types"

export const GUIDES_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "collection",
    source: "articles",
    label: "layout.navigation.menu.articles",
    ariaLabelKey: "layout.navigation.aria.articlesGuides",
    indexPage: true,
    pageType: "article",
    titleKey: "layout.navigation.menu.articles",
    subtitleKey: "pages.articles.indexNote",
    emptyKey: "pages.articles.empty",
    showSourceTabs: true,
    icon: "i-lucide-book-open",
    collapsible: true,
    defaultOpen: true
  },
  {
    type: "collection",
    source: "starters",
    label: "layout.navigation.menu.starters",
    indexPage: true,
    pageType: "starter",
    titleKey: "layout.navigation.menu.starters",
    subtitleKey: "pages.starters.indexNote",
    emptyKey: "pages.starters.empty",
    icon: "i-lucide-package",
    collapsible: true,
    defaultOpen: true
  }
]
