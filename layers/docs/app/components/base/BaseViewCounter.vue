<script setup lang="ts">
import { useContentViews } from "@docs/composables/content/useContentViews"
import { normalizePublicDocsPath } from "@docs/utils/path/publicPath"

const route = useRoute()

const viewSlug = computed(() => normalizePublicDocsPath(route.path))

const { views, loading } = useContentViews(viewSlug)
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-90"
    enter-to-class="opacity-100 scale-100"
  >
    <div
      v-if="views !== null"
      class="absolute top-0 right-0 inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 backdrop-blur-md md:top-5 md:right-5 dark:border-white/10 dark:bg-black/40 dark:text-white/60"
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
