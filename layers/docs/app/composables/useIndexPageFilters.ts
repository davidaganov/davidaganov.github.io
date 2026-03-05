import type { Collections } from "@nuxt/content"
import { hasArchiveForPath } from "@docs/composables/useDocsArchive"
import type { ArticleMeta } from "@docs/types/article"
import { SORT_ORDER, SOURCE_FILTER } from "@docs/types/enums"
import { getQueryPrefix, getRelativePath } from "@docs/utils/content"
import {
  buildFiltersQuery,
  parseSortFromQuery,
  parseSourceFromQuery,
  parseTagsFromQuery
} from "@docs/utils/indexFiltersQuery"

export interface IndexPageItem {
  title: string
  description: string
  path: string
  meta?: ArticleMeta
}

export function useIndexPageFilters(
  pathPrefix: Ref<string> | string,
  showSourceTabs: Ref<boolean> | boolean
) {
  const { locale } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const sortOrder = ref<SORT_ORDER>(SORT_ORDER.DESC)
  const sourceFilter = ref<SOURCE_FILTER>(SOURCE_FILTER.ALL)
  const selectedTags = ref<string[]>([])
  const isSyncingFromQuery = ref(false)

  const prefixRef = toRef(pathPrefix)
  const sourceTabsRef = toRef(showSourceTabs)

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  const { data: items } = useAsyncData<IndexPageItem[]>(
    () => `index-page:${prefixRef.value}:${locale.value}`,
    async () => {
      const queryPrefix = getQueryPrefix(prefixRef.value)
      const raw = await queryCollection(collection.value)
        .where("path", "LIKE", `%${queryPrefix}%`)
        .select("title", "description", "meta", "path")
        .all()

      return raw.map((entry) => {
        const relativePath = getRelativePath(String(entry.path), queryPrefix)
        const entryMeta = (entry.meta as ArticleMeta | undefined) || undefined
        const hasArchive =
          hasArchiveForPath(prefixRef.value, relativePath) || Boolean(entryMeta?.hasArchive)

        return {
          title: String(entry.title || ""),
          description: String(entry.description || ""),
          path: `${prefixRef.value}${relativePath}`,
          meta: {
            ...(entryMeta || {}),
            hasArchive
          }
        }
      })
    },
    {
      watch: [locale]
    }
  )

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    items.value?.forEach((item) => {
      item.meta?.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const hasExternalSource = computed(() =>
    (items.value || []).some((item) => Boolean(item.meta?.habrUrl))
  )

  const shouldShowSourceTabs = computed(() => sourceTabsRef.value && hasExternalSource.value)

  const hasActiveFilters = computed(
    () =>
      selectedTags.value.length > 0 ||
      sortOrder.value !== SORT_ORDER.DESC ||
      (shouldShowSourceTabs.value && sourceFilter.value !== SOURCE_FILTER.ALL)
  )

  const filteredItems = computed(() => {
    let list = items.value || []

    if (shouldShowSourceTabs.value && sourceFilter.value !== SOURCE_FILTER.ALL) {
      list = list.filter((item) =>
        sourceFilter.value === SOURCE_FILTER.HABR
          ? Boolean(item.meta?.habrUrl)
          : !item.meta?.habrUrl
      )
    }

    return sortByDate(filterByTags(list))
  })

  const totalFiltered = computed(() => filteredItems.value.length)

  const sortIcon = computed(() =>
    sortOrder.value === SORT_ORDER.DESC
      ? "i-lucide-calendar-arrow-down"
      : "i-lucide-calendar-arrow-up"
  )

  const filterByTags = <T extends { meta?: ArticleMeta }>(list: T[]): T[] => {
    if (!selectedTags.value.length) return list
    return list.filter((item) => selectedTags.value.every((tag) => item.meta?.tags?.includes(tag)))
  }

  const sortByDate = <T extends { meta?: ArticleMeta }>(list: T[]): T[] => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.meta?.publishedAt || 0).getTime()
      const dateB = new Date(b.meta?.publishedAt || 0).getTime()
      return sortOrder.value === SORT_ORDER.DESC ? dateB - dateA : dateA - dateB
    })
  }

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === SORT_ORDER.DESC ? SORT_ORDER.ASC : SORT_ORDER.DESC
  }

  const toggleTag = (tag: string) => {
    const idx = selectedTags.value.indexOf(tag)
    if (idx === -1) selectedTags.value.push(tag)
    else selectedTags.value.splice(idx, 1)
  }

  const resetFilters = () => {
    selectedTags.value = []
    sourceFilter.value = SOURCE_FILTER.ALL
    sortOrder.value = SORT_ORDER.DESC
  }

  const syncStateFromQuery = () => {
    isSyncingFromQuery.value = true
    selectedTags.value = parseTagsFromQuery(route.query.tags)
    sortOrder.value = parseSortFromQuery(route.query.sort)
    sourceFilter.value = shouldShowSourceTabs.value
      ? parseSourceFromQuery(route.query.source)
      : SOURCE_FILTER.ALL

    isSyncingFromQuery.value = false
  }

  const normalizeQueryValue = (value: unknown): string => {
    if (Array.isArray(value)) return String(value[0] || "")
    return String(value || "")
  }

  watch(
    () => [route.query.tags, route.query.sort, route.query.source, shouldShowSourceTabs.value],
    () => {
      syncStateFromQuery()
    },
    { immediate: true }
  )

  watch(
    [selectedTags, sortOrder, sourceFilter, shouldShowSourceTabs],
    async () => {
      if (isSyncingFromQuery.value) return

      const nextFiltersQuery = buildFiltersQuery({
        tags: selectedTags.value,
        sortOrder: sortOrder.value,
        sourceFilter: sourceFilter.value,
        includeSource: shouldShowSourceTabs.value
      })

      const currentTags = normalizeQueryValue(route.query.tags)
      const currentSort = normalizeQueryValue(route.query.sort)
      const currentSource = normalizeQueryValue(route.query.source)

      const nextTags = nextFiltersQuery.tags || ""
      const nextSort = nextFiltersQuery.sort || ""
      const nextSource = nextFiltersQuery.source || ""

      if (currentTags === nextTags && currentSort === nextSort && currentSource === nextSource) {
        return
      }

      await router.replace({
        query: {
          ...route.query,
          tags: nextFiltersQuery.tags,
          sort: nextFiltersQuery.sort,
          source: nextFiltersQuery.source
        }
      })
    },
    { deep: true }
  )

  return {
    items,
    filteredItems,
    totalFiltered,
    allTags,
    hasExternalSource,
    hasActiveFilters,
    sortOrder,
    sortIcon,
    sourceFilter,
    selectedTags,
    toggleSortOrder,
    toggleTag,
    resetFilters
  }
}
