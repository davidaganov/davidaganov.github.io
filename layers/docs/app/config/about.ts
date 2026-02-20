import type { SidebarItem } from "@docs/types/sidebar"

export const ABOUT_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "link",
    name: "getting-started"
  },
  {
    type: "divider",
    class: "my-2 border-t border-white/10"
  },
  {
    type: "collection",
    source: "articles",
    label: "nav.articles",
    indexPage: true,
    pageType: "article",
    titleKey: "nav.articles",
    emptyKey: "articles.empty",
    showSourceTabs: true,
    icon: "i-lucide-book-open",
    collapsible: true,
    defaultOpen: true
  },
  {
    type: "collection",
    source: "projects",
    label: "nav.projects",
    indexPage: true,
    pageType: "project",
    titleKey: "nav.projects",
    emptyKey: "projects.empty",
    icon: "i-lucide-folder",
    collapsible: true,
    defaultOpen: true
  }
]
