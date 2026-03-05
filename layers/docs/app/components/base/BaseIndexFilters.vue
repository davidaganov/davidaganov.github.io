<script setup lang="ts">
import { SORT_ORDER, SOURCE_FILTER } from "@docs/types/enums"

const props = withDefaults(
  defineProps<{
    sourceFilter: SOURCE_FILTER
    sortOrder: SORT_ORDER
    sortIcon: string
    allTags: string[]
    selectedTags: string[]
    hasActiveFilters: boolean
    titleKey?: string
    subtitleKey?: string
    showSourceTabs?: boolean
  }>(),
  {
    titleKey: "layout.navigation.menu.articles",
    subtitleKey: "",
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
  { value: SOURCE_FILTER.ALL, label: t("global.labels.all") },
  { value: SOURCE_FILTER.HABR, label: t("layout.navigation.social.habr") },
  { value: SOURCE_FILTER.SITE, label: t("layout.navigation.social.site") }
])

const sourceFilterModel = computed({
  get: () => props.sourceFilter,
  set: (v) => emit("update:sourceFilter", v)
})

const isTagSelected = (tag: string) => props.selectedTags.includes(tag)

const getTagButtonClass = (tag: string) =>
  isTagSelected(tag)
    ? "bg-primary-200/50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-300 border-primary-500/20 dark:border-primary-500/50"
    : "text-muted bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"

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
    <div class="grid w-full items-center justify-between gap-x-4 gap-y-2 lg:grid-cols-[1fr_auto]">
      <h1 class="text-highlighted mb-4 text-4xl font-bold">
        {{ $t(props.titleKey) }}
      </h1>
      <p
        v-if="props.subtitleKey"
        class="text-muted row-start-2 mt-2 text-sm md:max-w-11/12 lg:col-span-2"
      >
        {{ $t(props.subtitleKey) }}
      </p>

      <UTabs
        v-if="props.showSourceTabs"
        v-model="sourceFilterModel"
        :items="sourceFilterTabs"
        :ui="{
          list: 'rounded-lg border border-black/8 bg-black/2 dark:border-white/8 dark:bg-white/2 py-0.5 px-1',
          trigger:
            'rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:text-primary-600 dark:data-[state=active]:text-white data-[state=inactive]:text-muted data-[state=inactive]:hover:text-primary-500 dark:data-[state=inactive]:hover:text-white',
          indicator: 'rounded-md bg-black/5 dark:bg-white/8'
        }"
      />
    </div>

    <div class="flex flex-wrap items-center gap-1.5">
      <UButton
        variant="ghost"
        size="xs"
        :icon="sortIcon"
        :class="sortOrder === SORT_ORDER.DESC ? 'text-primary-600 dark:text-white' : 'text-muted'"
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
        {{ $t("global.labels.noTags") }}
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
