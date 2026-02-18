<script setup lang="ts">
import ProjectCard from "@docs/components/page/project/ProjectCard.vue"
import ProjectFilters from "@docs/components/page/project/ProjectFilters.vue"
import { useProjectsFilter } from "@docs/composables/useProjectsFilter"

const {
  filteredProjects,
  allTags,
  hasActiveFilters,
  totalFiltered,
  sortIcon,
  sortOrder,
  selectedTags,
  toggleSortOrder,
  toggleTag,
  resetFilters
} = useProjectsFilter()
</script>

<template>
  <div>
    <ProjectFilters
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
      v-if="filteredProjects.length"
      class="grid gap-3 sm:gap-4"
    >
      <ProjectCard
        v-for="project in filteredProjects"
        :project="project"
        :selected-tags="selectedTags"
        :key="String(project.path)"
      />
    </div>

    <div
      v-if="totalFiltered === 0"
      class="rounded-xl border border-white/5 bg-white/3 p-8 text-center"
    >
      <UIcon
        class="text-muted mx-auto size-12 opacity-50"
        name="i-lucide-folder"
      />
      <p class="text-muted mt-4 text-sm">
        {{ $t("layout.projectsPage.empty") }}
      </p>
    </div>
  </div>
</template>
