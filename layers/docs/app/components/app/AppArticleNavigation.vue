<script setup lang="ts">
import BaseArticleNavigateButton from "@docs/components/base/BaseArticleNavigateButton.vue"
import { useArticleNavigation } from "@docs/composables/useArticleNavigation"

const props = defineProps<{
  docsPath: string
  isCollection?: boolean
}>()

const docsPath = toRef(() => props.docsPath)

const { prevPage, nextPage, githubMdUrl } = useArticleNavigation(docsPath)
</script>

<template>
  <div class="mt-10 border-t border-black/10 pt-8 dark:border-white/10">
    <!-- GitHub MD link -->
    <div
      v-if="githubMdUrl && !props.isCollection"
      class="mb-6"
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-700 dark:text-white/40 dark:hover:text-white/70"
        :href="githubMdUrl"
      >
        <UIcon
          name="i-lucide-pencil"
          class="size-3.5"
        />
        <span>{{ $t("docs.nav.editOnGitHub") }}</span>
        <UIcon
          name="i-lucide-arrow-up-right"
          class="size-3.5"
        />
      </a>
    </div>

    <!-- Prev / Next navigation -->
    <div
      v-if="prevPage || nextPage"
      class="grid grid-cols-2 gap-4"
    >
      <!-- Previous page -->
      <BaseArticleNavigateButton
        v-if="prevPage"
        direction="prev"
        :page="prevPage"
      />

      <!-- Spacer when only next page exists -->
      <div
        v-else
        class="col-start-1"
      />

      <!-- Next page -->
      <BaseArticleNavigateButton
        v-if="nextPage"
        direction="next"
        :page="nextPage"
      />
    </div>
  </div>
</template>
