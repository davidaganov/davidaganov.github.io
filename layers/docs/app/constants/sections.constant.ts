import { ROUTE_PATH } from "@base/types"
import type { DocsSection } from "@docs/types"
import { ABOUT_SIDEBAR_ITEMS } from "./about.constant"
import { GUIDES_SIDEBAR_ITEMS } from "./guides.constant"
import { TOOLS_SIDEBAR_ITEMS } from "./tools.constant"

export const DOCS_SECTIONS: DocsSection[] = [
  {
    id: "about",
    labelKey: "layout.navigation.menu.about",
    icon: "i-lucide-circle-user-round",
    basePath: ROUTE_PATH.DOCS_ABOUT,
    sidebarItems: ABOUT_SIDEBAR_ITEMS
  },
  {
    id: "guides",
    labelKey: "layout.navigation.menu.guides",
    icon: "i-lucide-book-marked",
    basePath: ROUTE_PATH.DOCS_GUIDES,
    sidebarItems: GUIDES_SIDEBAR_ITEMS
  },
  {
    id: "tools",
    labelKey: "layout.navigation.menu.tools",
    icon: "i-lucide-wrench",
    basePath: ROUTE_PATH.DOCS_TOOLS,
    sidebarItems: TOOLS_SIDEBAR_ITEMS
  }
]
