import type { Collections } from "@nuxt/content"
import type { ArticleItem, ArticleMeta } from "@docs/types/article"
import { SORT_ORDER, SOURCE_FILTER } from "@docs/types/enums/filter.enum"

export const useArticlesFilter = () => {
  const { locale } = useI18n()

  const sortOrder = ref<SORT_ORDER>(SORT_ORDER.DESC)
  const sourceFilter = ref<SOURCE_FILTER>(SOURCE_FILTER.ALL)
  const selectedTags = ref<string[]>([])

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  const { data: articles } = useAsyncData<ArticleItem[]>(
    "habr-articles",
    async () => {
      const raw = await queryCollection(collection.value)
        .where("path", "LIKE", "%/articles/%")
        .select("title", "description", "meta", "path")
        .all()
      return raw.map((a) => ({
        title: a.title,
        description: a.description,
        path: `/docs${a.path}`,
        meta: a.meta as ArticleMeta | undefined
      }))
    },
    {
      watch: [locale]
    }
  )

  const habrArticles = computed(() => (articles.value || []).filter((a) => a.meta?.habrUrl))

  const siteArticles = computed(() => (articles.value || []).filter((a) => !a.meta?.habrUrl))

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    ;(articles.value || []).forEach((a) => {
      a.meta?.tags?.forEach((t) => tagSet.add(t))
    })
    return Array.from(tagSet).sort()
  })

  const hasActiveFilters = computed(
    () =>
      selectedTags.value.length > 0 ||
      sourceFilter.value !== SOURCE_FILTER.ALL ||
      sortOrder.value !== SORT_ORDER.DESC
  )

  const filteredHabrArticles = computed((): ArticleItem[] => {
    if (sourceFilter.value === SOURCE_FILTER.SITE) return []
    return sortByDate(filterByTags(habrArticles.value))
  })

  const filteredSiteArticles = computed((): ArticleItem[] => {
    if (sourceFilter.value === SOURCE_FILTER.HABR) return []
    return sortByDate(filterByTags(siteArticles.value))
  })

  const totalFiltered = computed(
    () => filteredHabrArticles.value.length + filteredSiteArticles.value.length
  )

  const sortIcon = computed(() =>
    sortOrder.value === SORT_ORDER.DESC
      ? "i-lucide-calendar-arrow-down"
      : "i-lucide-calendar-arrow-up"
  )

  const sortLabel = computed(() =>
    sortOrder.value === SORT_ORDER.DESC ? "Сначала новые" : "Сначала старые"
  )

  const isTagSelected = (tag: string) => selectedTags.value.includes(tag)
  const isSourceActive = (value: SOURCE_FILTER) => sourceFilter.value === value
  const setSourceFilter = (value: SOURCE_FILTER) => (sourceFilter.value = value)

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

  const sortByDate = <T extends { meta?: ArticleMeta }>(list: T[]): T[] => {
    return [...list].sort((a, b) => {
      const da = new Date(a.meta?.publishedAt || 0).getTime()
      const db = new Date(b.meta?.publishedAt || 0).getTime()
      return sortOrder.value === SORT_ORDER.DESC ? db - da : da - db
    })
  }

  const filterByTags = <T extends { meta?: ArticleMeta }>(list: T[]): T[] => {
    if (!selectedTags.value.length) return list
    return list.filter((a) => selectedTags.value.every((t) => a.meta?.tags?.includes(t)))
  }

  return {
    articles,
    habrArticles,
    siteArticles,
    filteredHabrArticles,
    filteredSiteArticles,
    allTags,
    sortOrder,
    sourceFilter,
    selectedTags,
    hasActiveFilters,
    totalFiltered,
    sortIcon,
    sortLabel,
    setSourceFilter,
    toggleSortOrder,
    toggleTag,
    resetFilters,
    isTagSelected,
    isSourceActive
  }
}
