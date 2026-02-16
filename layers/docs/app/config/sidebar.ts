import type { SidebarItem } from "@docs/types/sidebar"
import { SOCIAL_LINKS } from "@base/constants"
import { ROUTE_PATH } from "@base/types/enums"

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "link",
    label: "layout.sidebar.nav.gettingStarted",
    to: ROUTE_PATH.GETTING_STARTED,
    icon: "i-lucide-book-open"
  },
  // {
  //   type: "link",
  //   label: "layout.sidebar.nav.stack",
  //   to: ROUTE_PATH.STACK,
  //   icon: "i-lucide-layers"
  // },
  {
    type: "divider",
    class: "my-2 border-t border-white/10"
  },
  {
    type: "collection",
    source: "articles",
    label: "layout.sidebar.sections.articles",
    icon: "i-lucide-book-open",
    pathPrefix: ROUTE_PATH.ARTICLES,
    collapsible: true,
    defaultOpen: true
  },
  {
    type: "collection",
    source: "projects",
    label: "layout.sidebar.sections.projects",
    icon: "i-lucide-folder",
    pathPrefix: ROUTE_PATH.PROJECTS,
    collapsible: true,
    defaultOpen: true
  },
  {
    type: "divider",
    class: "mt-8 pt-6 border-t border-white/10",
    label: "layout.sidebar.sections.connect"
  },
  {
    type: "group",
    class: "space-y-1",
    items: SOCIAL_LINKS.map((link) => ({
      type: "link",
      label: link.label,
      href: link.href,
      icon: link.icon,
      target: "_blank"
    }))
  }
]
