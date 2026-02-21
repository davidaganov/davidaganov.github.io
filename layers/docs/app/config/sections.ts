import { ABOUT_SIDEBAR_ITEMS } from "@docs/config/about"
import { GUIDES_SIDEBAR_ITEMS } from "@docs/config/guides"
import { TOOLS_SIDEBAR_ITEMS } from "@docs/config/tools"
import type { DocsSection } from "@docs/types/docs"
import { ROUTE_PATH } from "@base/types/enums"

export const DOCS_SECTIONS: DocsSection[] = [
  {
    id: "about",
    labelKey: "nav.about",
    icon: "i-lucide-circle-user-round",
    basePath: ROUTE_PATH.DOCS_ABOUT,
    sidebarItems: ABOUT_SIDEBAR_ITEMS
  },
  {
    id: "guides",
    labelKey: "nav.guides",
    icon: "i-lucide-book-marked",
    basePath: ROUTE_PATH.DOCS_GUIDES,
    sidebarItems: GUIDES_SIDEBAR_ITEMS
  },
  {
    id: "tools",
    labelKey: "nav.tools",
    icon: "i-lucide-wrench",
    basePath: ROUTE_PATH.DOCS_TOOLS,
    sidebarItems: TOOLS_SIDEBAR_ITEMS
  }
]
