import { type ArticleMeta, SORT_ORDER } from "@docs/types"

export const filterByTags = <T extends { meta?: ArticleMeta }>(
  list: T[],
  selectedTags: string[]
): T[] => {
  if (!selectedTags.length) return list
  return list.filter((item) => selectedTags.every((tag) => item.meta?.tags?.includes(tag)))
}

export const sortByPublishedAt = <T extends { meta?: ArticleMeta }>(
  list: T[],
  order: SORT_ORDER
): T[] => {
  return [...list].sort((a, b) => {
    const dateA = new Date(a.meta?.publishedAt || 0).getTime()
    const dateB = new Date(b.meta?.publishedAt || 0).getTime()
    return order === SORT_ORDER.DESC ? dateB - dateA : dateA - dateB
  })
}

export const sortByTitle = <T extends { title: string }>(list: T[], order: SORT_ORDER): T[] => {
  return [...list].sort((a, b) => {
    const cmp = a.title.localeCompare(b.title, "en", { sensitivity: "base", numeric: true })
    return order === SORT_ORDER.DESC ? cmp : -cmp
  })
}
