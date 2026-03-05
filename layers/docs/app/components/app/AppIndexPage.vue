<script setup lang="ts">
import BaseIndexCard from "@docs/components/base/BaseIndexCard.vue"
import BaseIndexFilters from "@docs/components/base/BaseIndexFilters.vue"
import { useIndexPageFilters } from "@docs/composables/useIndexPageFilters"

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

const pathPrefixRef = toRef(() => props.pathPrefix)
const showSourceTabsRef = toRef(() => props.showSourceTabs)

const {
  filteredItems,
  totalFiltered,
  allTags,
  hasActiveFilters,
  sortOrder,
  sortIcon,
  sourceFilter,
  selectedTags,
  toggleSortOrder,
  toggleTag,
  resetFilters
} = useIndexPageFilters(pathPrefixRef, showSourceTabsRef)
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
