<script setup lang="ts">
import { SORT_ORDER, SOURCE_FILTER } from "@docs/types/enums"
import UiTabs from "@ui/components/UiTabs.vue"

const props = withDefaults(
  defineProps<{
    sourceFilter: SOURCE_FILTER
    sortOrder: SORT_ORDER
    sortIcon: string
    allTags: string[]
    selectedTags: string[]
    hasActiveFilters: boolean
    titleKey?: string
    showSourceTabs?: boolean
  }>(),
  {
    titleKey: "layout.articlesPage.title",
    showSourceTabs: true
  }
)

const emit = defineEmits<{
  (e: "update:sourceFilter", value: SOURCE_FILTER): void
  (e: "toggleSort"): void
  (e: "toggleTag", tag: string): void
  (e: "reset"): void
}>()

const { t } = useI18n()

const sourceFilterTabs = computed(() => [
  { value: SOURCE_FILTER.ALL, label: t("layout.articlesPage.filters.all") },
  { value: SOURCE_FILTER.HABR, label: t("layout.articlesPage.filters.habr") },
  { value: SOURCE_FILTER.SITE, label: t("layout.articlesPage.filters.site") }
])

const sourceFilterModel = computed({
  get: () => props.sourceFilter,
  set: (v) => emit("update:sourceFilter", v)
})

const isTagSelected = (tag: string) => props.selectedTags.includes(tag)

const getTagButtonClass = (tag: string) =>
  isTagSelected(tag)
    ? "border-primary-500/50 bg-primary-500/15 text-primary-300"
    : "text-muted border-white/10 bg-white/5 hover:border-white/20 hover:text-white"

const handleSort = () => {
  emit("toggleSort")
}

const handleTag = (tag: string) => {
  emit("toggleTag", tag)
}

const handleReset = () => {
  emit("reset")
}
</script>

<template>
  <div class="mb-4 flex flex-col gap-3 sm:mb-6">
    <div class="flex w-full items-center justify-between gap-4">
      <h1 class="text-2xl font-semibold tracking-tight text-white">
        {{ $t(props.titleKey) }}
      </h1>

      <UiTabs
        v-if="props.showSourceTabs"
        v-model="sourceFilterModel"
        variant="secondary"
        :items="sourceFilterTabs"
      />
    </div>

    <div class="flex flex-wrap items-center gap-1.5">
      <UButton
        variant="ghost"
        size="xs"
        :icon="sortIcon"
        :class="sortOrder === SORT_ORDER.DESC ? 'text-white' : 'text-muted'"
        @click="handleSort"
      />

      <template v-if="allTags.length">
        <UButton
          v-for="tag in allTags"
          variant="ghost"
          size="xs"
          :class="getTagButtonClass(tag)"
          :key="tag"
          @click="handleTag(tag)"
        >
          {{ tag }}
        </UButton>
      </template>

      <p
        v-else
        class="text-muted text-sm"
      >
        {{ $t("layout.articlesPage.filters.noTags") }}
      </p>

      <UButton
        v-if="hasActiveFilters"
        icon="i-lucide-x"
        variant="ghost"
        size="xs"
        class="ml-auto"
        @click="handleReset"
      />
    </div>
  </div>
</template>
