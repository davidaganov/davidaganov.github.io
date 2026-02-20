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
    label: "layout.sidebar.sections.articles",
    indexPage: true,
    icon: "i-lucide-book-open",
    collapsible: true,
    defaultOpen: true
  },
  {
    type: "collection",
    source: "projects",
    label: "layout.sidebar.sections.projects",
    indexPage: true,
    icon: "i-lucide-folder",
    collapsible: true,
    defaultOpen: true
  }
]
