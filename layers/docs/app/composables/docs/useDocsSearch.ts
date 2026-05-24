import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { type DocsSearchResult, TYPE_PAGE } from "@docs/types"

export const useDocsSearch = (query: Ref<string>) => {
  const { locale } = useContentCollection()
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  const debouncedQuery = ref(query.value)

  watch(query, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = val
    }, 200)
  })

  const { data: results, status } = useAsyncData<DocsSearchResult[]>(
    () => `docs-search:${locale.value}:${debouncedQuery.value}`,
    () =>
      $fetch<DocsSearchResult[]>("/api/docs/search", {
        query: {
          q: debouncedQuery.value.trim(),
          locale: locale.value
        }
      }),
    {
      watch: [debouncedQuery, locale],
      default: () => []
    }
  )

  const grouped = computed(() => {
    const groups: Record<TYPE_PAGE, DocsSearchResult[]> = {
      [TYPE_PAGE.SITE]: [],
      [TYPE_PAGE.DOCS]: [],
      [TYPE_PAGE.ARTICLE]: [],
      [TYPE_PAGE.PROJECT]: [],
      [TYPE_PAGE.TEMPLATE]: []
    }
    for (const item of results.value || []) {
      groups[item.category].push(item)
    }
    return groups
  })

  const flatResults = computed(() => [
    ...grouped.value[TYPE_PAGE.SITE],
    ...grouped.value[TYPE_PAGE.DOCS],
    ...grouped.value[TYPE_PAGE.ARTICLE],
    ...grouped.value[TYPE_PAGE.PROJECT],
    ...grouped.value[TYPE_PAGE.TEMPLATE]
  ])

  return {
    results,
    grouped,
    flatResults,
    isLoading: computed(() => status.value === "pending")
  }
}
