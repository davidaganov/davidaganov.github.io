<script setup lang="ts">
const props = defineProps<{
  direction: "prev" | "next"
  page: { path: string; title: string }
}>()

const isPrev = computed(() => props.direction === "prev")
const alignClass = computed(() =>
  isPrev.value ? "text-left col-start-1" : "text-right col-start-2"
)
const iconClass =
  "group-hover:text-primary-600 size-4 shrink-0 text-gray-400 transition-colors dark:text-white/50 dark:group-hover:text-white/80"
</script>

<template>
  <NuxtLink
    class="group flex flex-col rounded-xl border border-black/10 bg-black/3 px-5 py-4 transition-colors hover:border-black/20 hover:bg-black/5 dark:border-white/10 dark:bg-white/3 dark:hover:border-white/20 dark:hover:bg-white/5"
    :to="page.path"
    :class="alignClass"
  >
    <span
      class="mb-1 text-xs text-gray-500 transition-colors group-hover:text-gray-700 dark:text-white/40 dark:group-hover:text-white/60"
    >
      {{ isPrev ? $t("docs.nav.previousPage") : $t("docs.nav.nextPage") }}
    </span>
    <span
      class="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white/85"
      :class="{ 'justify-end': !isPrev }"
    >
      <UIcon
        v-if="isPrev"
        name="i-lucide-arrow-left"
        :class="iconClass"
      />
      {{ page.title }}
      <UIcon
        v-if="!isPrev"
        name="i-lucide-arrow-right"
        :class="iconClass"
      />
    </span>
  </NuxtLink>
</template>
