import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { loadArchiveIndex } from "@docs/utils/archiveManifest"
import { filterByTags, sortByPublishedAt } from "@docs/utils/content/listFilters"
import { toContentPrefix, toRelativeContentPath } from "@docs/utils/content/paths"
import {
  buildFiltersQuery,
  parseSortFromQuery,
  parseSourceFromQuery,
  parseTagsFromQuery
} from "@docs/utils/indexFiltersQuery"
import { joinPublicDocsPath } from "@docs/utils/path/joinPublicPath"
import { type ArticleMeta, type ContentListItem, SORT_ORDER, SOURCE_FILTER } from "@docs/types"

export interface UseContentListFiltersOptions {
  publicPathPrefix: Ref<string> | string
  showSourceTabs?: Ref<boolean> | boolean
  syncQuery?: boolean
}

const hasArchiveAtSync = (
  keys: Set<string>,
  publicPathPrefix: string,
  relativePath: string
): boolean => {
  const key = archiveKeyFromPaths(publicPathPrefix, relativePath)
  return Boolean(key && keys.has(key))
}

const archiveKeyFromPaths = (publicPathPrefix: string, relativePath: string): string => {
  const prefix = toContentPrefix(publicPathPrefix).replace(/^\/+|\/+$/g, "")
  const relative = String(relativePath || "").replace(/^\/+|\/+$/g, "")
  if (!prefix || !relative) return ""
  return `${prefix}/${relative}`
}

export const useContentListFilters = (options: UseContentListFiltersOptions) => {
  const route = useRoute()
  const router = useRouter()
  const { collection } = useContentCollection()

  const prefixRef = toRef(options.publicPathPrefix)
  const sourceTabsRef = toRef(options.showSourceTabs ?? false)
  const syncQuery = options.syncQuery ?? true

  const sortOrder = ref<SORT_ORDER>(SORT_ORDER.DESC)
  const sourceFilter = ref<SOURCE_FILTER>(SOURCE_FILTER.ALL)
  const selectedTags = ref<string[]>([])
  const isSyncingFromQuery = ref(false)

  const { data: archiveKeys } = useAsyncData("docs-archive-index", () => loadArchiveIndex(), {
    server: true,
    lazy: true,
    default: () => new Set<string>()
  })

  const { data: items } = useAsyncData<ContentListItem[]>(
    () => `content-list-filters:${collection.value}:${prefixRef.value}`,
    async () => {
      const contentPrefix = toContentPrefix(prefixRef.value)
      const keys = archiveKeys.value ?? (await loadArchiveIndex())
      const raw = await queryCollection(collection.value)
        .where("path", "LIKE", `${contentPrefix}%`)
        .select("title", "description", "meta", "path")
        .all()

      return raw.map((entry) => {
        const relativePath = toRelativeContentPath(String(entry.path), contentPrefix)
        const entryMeta = (entry.meta as ArticleMeta | undefined) || undefined
        const hasArchive =
          hasArchiveAtSync(keys, prefixRef.value, relativePath) || Boolean(entryMeta?.hasArchive)

        return {
          title: String(entry.title || ""),
          description: String(entry.description || ""),
          path: joinPublicDocsPath(prefixRef.value, relativePath),
          meta: {
            ...(entryMeta || {}),
            hasArchive
          }
        }
      })
    },
    {
      watch: [prefixRef, collection, archiveKeys]
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

  const hasActiveFilters = computed(() => {
    return (
      selectedTags.value.length > 0 ||
      sortOrder.value !== SORT_ORDER.DESC ||
      (shouldShowSourceTabs.value && sourceFilter.value !== SOURCE_FILTER.ALL)
    )
  })

  const filteredItems = computed(() => {
    let list = items.value || []

    if (shouldShowSourceTabs.value && sourceFilter.value !== SOURCE_FILTER.ALL) {
      list = list.filter((item) =>
        sourceFilter.value === SOURCE_FILTER.HABR
          ? Boolean(item.meta?.habrUrl)
          : !item.meta?.habrUrl
      )
    }

    return sortByPublishedAt(filterByTags(list, selectedTags.value), sortOrder.value)
  })

  const totalFiltered = computed(() => filteredItems.value.length)

  const sortIcon = computed(() =>
    sortOrder.value === SORT_ORDER.DESC
      ? "i-lucide-calendar-arrow-down"
      : "i-lucide-calendar-arrow-up"
  )

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
    if (!syncQuery) return
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

  if (syncQuery) {
    watch(
      () => [route.query.tags, route.query.sort, route.query.source, shouldShowSourceTabs.value],
      () => syncStateFromQuery(),
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
  }

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
