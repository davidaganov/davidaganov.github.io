import type { SidebarItem } from "@docs/types/sidebar"

export const TOOLS_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "collection",
    source: "calculators",
    label: "tools.nav.calculators",
    indexPage: true,
    pageType: "article",
    titleKey: "tools.nav.calculators",
    emptyKey: "tools.calculators.empty",
    icon: "i-lucide-wrench",
    collapsible: true,
    defaultOpen: true,
    itemIcon: "i-lucide-wrench"
  }
]
