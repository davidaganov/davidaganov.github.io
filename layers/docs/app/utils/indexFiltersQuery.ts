import { SORT_ORDER, SOURCE_FILTER } from "@docs/types/enums"

type QueryInput = string | null | (string | null)[] | undefined

const toSingle = (value: QueryInput): string => {
  if (Array.isArray(value)) return String(value[0] || "")
  return String(value || "")
}

const normalizeTagList = (value: QueryInput): string[] => {
  return toSingle(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

const uniq = (items: string[]): string[] => Array.from(new Set(items))

export const parseTagsFromQuery = (value: QueryInput): string[] => uniq(normalizeTagList(value))

export const parseSortFromQuery = (value: QueryInput): SORT_ORDER => {
  const normalized = toSingle(value)
  return normalized === SORT_ORDER.ASC ? SORT_ORDER.ASC : SORT_ORDER.DESC
}

export const parseSourceFromQuery = (value: QueryInput): SOURCE_FILTER => {
  const normalized = toSingle(value)
  if (normalized === SOURCE_FILTER.HABR) return SOURCE_FILTER.HABR
  if (normalized === SOURCE_FILTER.SITE) return SOURCE_FILTER.SITE
  return SOURCE_FILTER.ALL
}

export const buildFiltersQuery = (params: {
  tags: string[]
  sortOrder: SORT_ORDER
  sourceFilter: SOURCE_FILTER | null
  includeSource: boolean
}) => {
  const tags = uniq(params.tags.map((tag) => tag.trim()).filter(Boolean))

  return {
    tags: tags.length ? tags.join(",") : undefined,
    sort: params.sortOrder !== SORT_ORDER.DESC ? params.sortOrder : undefined,
    source:
      params.includeSource && params.sourceFilter !== SOURCE_FILTER.ALL
        ? params.sourceFilter
        : undefined
  }
}
