import type { SidebarItem } from "@docs/types/sidebar"

export const ABOUT_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "link",
    name: "getting-started"
  },
  {
    type: "divider",
    class: "my-2 border-t border-black/10 dark:border-white/10"
  },
  {
    type: "collection",
    source: "projects",
    label: "layout.navigation.menu.projects",
    indexPage: true,
    pageType: "project",
    titleKey: "layout.navigation.menu.projects",
    emptyKey: "pages.projects.empty",
    icon: "i-lucide-folder",
    collapsible: true,
    defaultOpen: true
  }
]
