<script setup lang="ts">
import { useDocsFlatNav } from "@docs/composables/docs/useDocsFlatNav"
import BaseArticleNavigateButton from "@docs/components/base/BaseArticleNavigateButton.vue"

const props = defineProps<{
  docsPath: string
  isCollection?: boolean
}>()

const docsPath = toRef(() => props.docsPath)

const localePath = useLocalePath()

const { prevPage, nextPage, githubMdUrl } = useDocsFlatNav(docsPath)
</script>

<template>
  <div class="mt-10 border-t border-black/10 pt-8 dark:border-white/10">
    <!-- GitHub MD link -->
    <div
      v-if="githubMdUrl && !props.isCollection"
      class="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2"
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
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
      <NuxtLink
        class="inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        :to="localePath('/docs/graph')"
      >
        <UIcon
          name="i-lucide-git-fork"
          class="size-3.5"
        />
        <span>{{ $t("docs.graph.linkFromArticle") }}</span>
      </NuxtLink>
    </div>

    <!-- Prev / Next navigation -->
    <ClientOnly>
      <div
        v-if="prevPage || nextPage"
        class="grid gap-4 md:grid-cols-2"
      >
        <BaseArticleNavigateButton
          v-if="prevPage"
          direction="prev"
          :page="prevPage"
        />

        <div
          v-else
          class="col-start-1"
        />

        <BaseArticleNavigateButton
          v-if="nextPage"
          direction="next"
          :page="nextPage"
        />
      </div>
    </ClientOnly>
  </div>
</template>
