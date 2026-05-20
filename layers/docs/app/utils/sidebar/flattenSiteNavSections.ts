import type { SidebarCollectionItem, SidebarItem } from "@docs/types"

type SiteNavSectionGroup = {
  items: SidebarItem[]
}

const forAppMenu = (item: SidebarItem): SidebarItem => {
  if (item.type !== "collection") return item

  const collection: SidebarCollectionItem = {
    ...item,
    collapsible: item.collapsible ?? true,
    defaultOpen: false
  }

  return collection
}

export const flattenSiteNavSections = (sections: SiteNavSectionGroup[]): SidebarItem[] => {
  const flat: SidebarItem[] = []

  for (const { items } of sections) {
    if (!items.length) continue
    flat.push(...items.map(forAppMenu))
  }

  return flat
}
