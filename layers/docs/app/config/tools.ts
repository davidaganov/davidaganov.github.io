import type { SidebarItem } from "@docs/types/sidebar"

export const TOOLS_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "collection",
    source: "calculators",
    label: "pages.tools.nav.calculators",
    indexPage: true,
    pageType: "project",
    titleKey: "pages.tools.nav.calculators",
    emptyKey: "features.calculators.empty",
    icon: "i-lucide-wrench",
    collapsible: true,
    defaultOpen: true,
    itemIcon: "i-lucide-wrench"
  }
]
