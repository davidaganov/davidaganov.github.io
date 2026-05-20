import type { SidebarItem } from "@docs/types"

export const getSidebarItemKey = (item: SidebarItem): string => {
  if (item.type === "link") {
    return `link:${item.name || item.to || item.href || item.label || "unknown"}`
  }

  if (item.type === "collection") {
    return `collection:${item.source}:${item.pathPrefix || ""}`
  }

  return `divider:${item.label || item.class || "divider"}`
}
