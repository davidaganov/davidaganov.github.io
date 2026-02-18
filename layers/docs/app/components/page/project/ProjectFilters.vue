<script setup lang="ts">
import { SORT_ORDER } from "@docs/types/enums"

const props = defineProps<{
  sortOrder: SORT_ORDER
  sortIcon: string
  allTags: string[]
  selectedTags: string[]
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  (e: "toggleSort"): void
  (e: "toggleTag", tag: string): void
  (e: "reset"): void
}>()

const getTagButtonClass = (tag: string) =>
  props.selectedTags.includes(tag)
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
        {{ $t("layout.projectsPage.title") }}
      </h1>
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
        {{ $t("layout.projectsPage.filters.noTags") }}
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
