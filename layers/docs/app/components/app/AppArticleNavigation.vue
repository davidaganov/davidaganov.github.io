<script setup lang="ts">
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
      <NuxtLink
        v-if="prevPage"
        :to="prevPage.path"
        class="group col-start-1 flex flex-col rounded-xl border border-black/10 bg-black/3 px-5 py-4 text-left transition-colors hover:border-black/20 hover:bg-black/5 dark:border-white/10 dark:bg-white/3 dark:hover:border-white/20 dark:hover:bg-white/5"
      >
        <span
          class="mb-1 text-xs text-gray-500 transition-colors group-hover:text-gray-700 dark:text-white/40 dark:group-hover:text-white/60"
        >
          {{ $t("docs.nav.previousPage") }}
        </span>
        <span
          class="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white/85"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="group-hover:text-primary-600 size-4 shrink-0 text-gray-400 transition-colors dark:text-white/50 dark:group-hover:text-white/80"
          />
          {{ prevPage.title }}
        </span>
      </NuxtLink>

      <!-- Spacer when only next page exists -->
      <div
        v-else
        class="col-start-1"
      />

      <!-- Next page -->
      <NuxtLink
        v-if="nextPage"
        class="group col-start-2 flex flex-col rounded-xl border border-black/10 bg-black/3 px-5 py-4 text-right transition-colors hover:border-black/20 hover:bg-black/5 dark:border-white/10 dark:bg-white/3 dark:hover:border-white/20 dark:hover:bg-white/5"
        :to="nextPage.path"
      >
        <span
          class="mb-1 text-xs text-gray-500 transition-colors group-hover:text-gray-700 dark:text-white/40 dark:group-hover:text-white/60"
        >
          {{ $t("docs.nav.nextPage") }}
        </span>
        <span
          class="flex items-center justify-end gap-1.5 text-sm font-semibold text-gray-900 dark:text-white/85"
        >
          {{ nextPage.title }}
          <UIcon
            name="i-lucide-arrow-right"
            class="group-hover:text-primary-600 size-4 shrink-0 text-gray-400 transition-colors dark:text-white/50 dark:group-hover:text-white/80"
          />
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
