<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import BaseIndexCard from "@docs/components/base/BaseIndexCard.vue"
import BaseIndexFilters from "@docs/components/base/BaseIndexFilters.vue"
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

interface IndexPageItem {
  title: string
  description: string
  path: string
  meta?: ArticleMeta
}

const props = withDefaults(
  defineProps<{
    titleKey?: string
    subtitleKey?: string
    emptyKey?: string
    pathPrefix: string
    showSourceTabs?: boolean
  }>(),
  {
    titleKey: "",
    subtitleKey: "",
    emptyKey: "",
    showSourceTabs: false
  }
)

const { locale } = useI18n()
const route = useRoute()
const router = useRouter()

const sortOrder = ref<SORT_ORDER>(SORT_ORDER.DESC)
const sourceFilter = ref<SOURCE_FILTER>(SOURCE_FILTER.ALL)
const selectedTags = ref<string[]>([])
const isSyncingFromQuery = ref(false)

const collection = computed(() => `content_${locale.value}` as keyof Collections)

const { data: items } = useAsyncData<IndexPageItem[]>(
  () => `index-page:${props.pathPrefix}:${locale.value}`,
  async () => {
    const queryPrefix = getQueryPrefix(props.pathPrefix)
    const raw = await queryCollection(collection.value)
      .where("path", "LIKE", `%${queryPrefix}%`)
      .select("title", "description", "meta", "path")
      .all()

    return raw.map((entry) => {
      const relativePath = getRelativePath(String(entry.path), queryPrefix)
      const entryMeta = (entry.meta as ArticleMeta | undefined) || undefined
      const hasArchive =
        hasArchiveForPath(props.pathPrefix, relativePath) || Boolean(entryMeta?.hasArchive)

      return {
        title: String(entry.title || ""),
        description: String(entry.description || ""),
        path: `${props.pathPrefix}${relativePath}`,
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
  ;(items.value || []).forEach((item) => {
    item.meta?.tags?.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
})

const hasExternalSource = computed(() =>
  (items.value || []).some((item) => Boolean(item.meta?.habrUrl))
)

const showSourceTabs = computed(() => props.showSourceTabs && hasExternalSource.value)

const hasActiveFilters = computed(
  () =>
    selectedTags.value.length > 0 ||
    sortOrder.value !== SORT_ORDER.DESC ||
    (showSourceTabs.value && sourceFilter.value !== SOURCE_FILTER.ALL)
)

const filteredItems = computed(() => {
  let list = items.value || []

  if (showSourceTabs.value && sourceFilter.value !== SOURCE_FILTER.ALL) {
    list = list.filter((item) =>
      sourceFilter.value === SOURCE_FILTER.HABR ? Boolean(item.meta?.habrUrl) : !item.meta?.habrUrl
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
  sourceFilter.value = showSourceTabs.value
    ? parseSourceFromQuery(route.query.source)
    : SOURCE_FILTER.ALL

  isSyncingFromQuery.value = false
}

const normalizeQueryValue = (value: unknown): string => {
  if (Array.isArray(value)) return String(value[0] || "")
  return String(value || "")
}

watch(
  () => [route.query.tags, route.query.sort, route.query.source, showSourceTabs.value],
  () => {
    syncStateFromQuery()
  },
  { immediate: true }
)

watch(
  [selectedTags, sortOrder, sourceFilter, showSourceTabs],
  async () => {
    if (isSyncingFromQuery.value) return

    const nextFiltersQuery = buildFiltersQuery({
      tags: selectedTags.value,
      sortOrder: sortOrder.value,
      sourceFilter: sourceFilter.value,
      includeSource: showSourceTabs.value
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
</script>

<template>
  <div>
    <BaseIndexFilters
      v-model:source-filter="sourceFilter"
      :title-key="props.titleKey"
      :subtitle-key="props.subtitleKey"
      :show-source-tabs="showSourceTabs"
      :sort-order="sortOrder"
      :sort-icon="sortIcon"
      :all-tags="allTags"
      :selected-tags="selectedTags"
      :has-active-filters="hasActiveFilters"
      @toggle-sort="toggleSortOrder"
      @toggle-tag="toggleTag"
      @reset="resetFilters"
    />

    <div
      v-if="filteredItems.length"
      class="mb-4 sm:mb-6"
    >
      <div class="grid gap-3 sm:gap-4">
        <BaseIndexCard
          v-for="item in filteredItems"
          :article="item"
          :selected-tags="selectedTags"
          :key="String(item.path)"
        />
      </div>
    </div>

    <div
      v-if="totalFiltered === 0"
      class="rounded-xl border border-white/5 bg-white/3 p-8 text-center"
    >
      <UIcon
        class="text-muted mx-auto size-12 opacity-50"
        name="i-lucide-file-text"
      />
      <p class="text-muted mt-4 text-sm">
        {{ $t(props.emptyKey) }}
      </p>
    </div>
  </div>
</template>
