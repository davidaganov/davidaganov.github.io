<script setup lang="ts">
const props = defineProps<{
  direction: "prev" | "next"
  page: { path: string; title: string; isSection?: boolean }
}>()

const isPrev = computed(() => props.direction === "prev")

const navLabelKey = computed(() => {
  const kind = props.page.isSection ? "Section" : "Page"
  return isPrev.value ? `docs.nav.previous${kind}` : `docs.nav.next${kind}`
})

const alignClass = computed(() =>
  isPrev.value ? "text-left md:col-start-1" : "text-right md:col-start-2"
)
</script>

<template>
  <UiSpotlightCard
    variant="article"
    content-class="flex flex-col justify-between"
    :to="page.path"
    :class="`h-full w-full ${alignClass}`"
  >
    <span
      class="mb-1 text-xs text-gray-600 transition-colors group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200"
    >
      {{ $t(navLabelKey) }}
    </span>
    <span
      class="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white/85"
      :class="{ 'justify-end': !isPrev }"
    >
      <UIcon
        v-if="isPrev"
        name="i-lucide-arrow-left"
        class="group-hover:text-primary-700 dark:group-hover:text-primary-400 size-4 shrink-0 text-gray-500 transition-colors dark:text-gray-400"
      />
      {{ page.title }}
      <UIcon
        v-if="!isPrev"
        name="i-lucide-arrow-right"
        class="group-hover:text-primary-700 dark:group-hover:text-primary-400 size-4 shrink-0 text-gray-500 transition-colors dark:text-gray-400"
      />
    </span>
  </UiSpotlightCard>
</template>
