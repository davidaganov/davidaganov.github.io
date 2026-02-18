<script setup lang="ts">
import ArticleCard from "@docs/components/page/article/ArticleCard.vue"
import ArticleFilters from "@docs/components/page/article/ArticleFilters.vue"
import { useArticlesFilter } from "@docs/composables/useArticlesFilter"

const {
  filteredHabrArticles,
  filteredSiteArticles,
  allTags,
  hasActiveFilters,
  totalFiltered,
  sortIcon,
  sortOrder,
  selectedTags,
  sourceFilter,
  toggleSortOrder,
  toggleTag,
  resetFilters
} = useArticlesFilter()
</script>

<template>
  <div>
    <ArticleFilters
      v-model:source-filter="sourceFilter"
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
      v-if="filteredHabrArticles.length"
      class="mb-4 sm:mb-6"
    >
      <h2 class="mb-3 flex items-center gap-2 text-sm font-medium text-white">
        <UIcon
          class="text-primary-400 size-4"
          name="i-simple-icons-habr"
        />
        {{ $t("layout.articlesPage.sections.habr") }}
      </h2>
      <div class="grid gap-3 sm:gap-4">
        <ArticleCard
          v-for="article in filteredHabrArticles"
          variant="habr"
          :article="article"
          :selected-tags="selectedTags"
          :key="String(article.path)"
        />
      </div>
    </div>

    <div
      v-if="filteredSiteArticles.length"
      class="mb-4 sm:mb-6"
    >
      <h2 class="mb-3 flex items-center gap-2 text-sm font-medium text-white">
        <UIcon
          class="size-4"
          name="i-lucide-file-text"
        />
        {{ $t("layout.articlesPage.sections.site") }}
      </h2>
      <div class="grid gap-3 sm:gap-4">
        <ArticleCard
          v-for="article in filteredSiteArticles"
          variant="site"
          :article="article"
          :selected-tags="selectedTags"
          :key="String(article.path)"
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
        {{ $t("layout.articlesPage.empty") }}
      </p>
    </div>
  </div>
</template>
