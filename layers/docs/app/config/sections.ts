import { ABOUT_SIDEBAR_ITEMS } from "@docs/config/about"
import { GUIDES_SIDEBAR_ITEMS } from "@docs/config/guides"
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
  }
]
