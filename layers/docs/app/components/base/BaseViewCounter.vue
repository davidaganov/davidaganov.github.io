<script setup lang="ts">
import { usePageViews } from "@docs/composables/usePageViews"

const route = useRoute()
const viewSlug = computed(() => route.path)
const { views, loading } = usePageViews(viewSlug)
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-90"
    enter-to-class="opacity-100 scale-100"
  >
    <div
      v-if="views !== null"
      class="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 backdrop-blur-md dark:border-white/10 dark:bg-black/40 dark:text-white/60"
    >
      <UIcon
        name="i-lucide-eye"
        class="size-3.5 shrink-0"
      />
      <span
        class="tabular-nums transition-all duration-300"
        :class="loading ? 'blur-sm' : 'blur-0'"
      >
        {{ views.toLocaleString() }}
      </span>
    </div>
  </Transition>
</template>
