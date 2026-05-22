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
    source: "templates",
    label: "layout.navigation.menu.templates",
    indexPage: true,
    pageType: "template",
    titleKey: "layout.navigation.menu.templates",
    subtitleKey: "pages.templates.indexNote",
    emptyKey: "pages.templates.empty",
    icon: "i-lucide-package",
    collapsible: true,
    defaultOpen: true
  }
]
