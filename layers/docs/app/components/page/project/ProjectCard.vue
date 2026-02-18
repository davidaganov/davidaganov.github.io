<script setup lang="ts">
import type { ProjectItem } from "@docs/types/project"
import { formatDate } from "@base/utils/date"

const props = defineProps<{
  project: ProjectItem
  selectedTags: string[]
}>()

const localePath = useLocalePath()

const icon = computed(() => props.project.meta?.icon || "i-lucide-folder")
const tags = computed(() => props.project.meta?.tags || [])
const hasGithub = computed(() => !!props.project.meta?.githubRepo)
const hasNpm = computed(() => !!props.project.meta?.npmPackage)
const hasDate = computed(() => !!props.project.meta?.publishedAt)

const tagClass = (tag: string) =>
  props.selectedTags.includes(tag) ? "bg-primary-500/20 text-primary-300" : "text-muted bg-white/5"
</script>

<template>
  <NuxtLink
    class="group relative overflow-hidden rounded-xl border border-white/5 bg-white/3 p-4 transition-all hover:border-white/10 hover:bg-white/5 hover:shadow-lg hover:shadow-black/20 sm:p-5"
    :to="localePath(String(project.path))"
    :key="String(project.path)"
  >
    <div class="flex items-start gap-3 sm:gap-4">
      <div
        class="hidden shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/5 sm:flex sm:size-12"
      >
        <UIcon
          class="text-muted size-5"
          :name="icon"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2
              class="group-hover:text-primary-300 text-sm font-semibold text-white transition-colors sm:text-base"
            >
              {{ project.title }}
            </h2>
            <p class="text-muted mt-1 line-clamp-2 text-xs sm:text-sm">
              {{ project.description }}
            </p>
          </div>
          <UIcon
            class="text-muted group-hover:text-primary-400 size-4 shrink-0 transition-colors sm:size-5"
            name="i-lucide-arrow-right"
          />
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <div
            v-if="hasGithub"
            class="text-muted flex items-center gap-1.5 text-xs"
          >
            <UIcon
              class="size-3.5"
              name="i-simple-icons-github"
            />
            <span>{{ project.meta?.githubRepo }}</span>
          </div>

          <div
            v-if="hasNpm"
            class="text-muted flex items-center gap-1.5 text-xs"
          >
            <UIcon
              class="size-3.5"
              name="i-simple-icons-npm"
            />
            <span>{{ project.meta?.npmPackage }}</span>
          </div>

          <div
            v-if="hasDate"
            class="text-muted flex items-center gap-1.5 text-xs"
          >
            <UIcon
              class="size-3.5"
              name="i-lucide-calendar"
            />
            <span>{{ formatDate(project.meta?.publishedAt ?? "") }}</span>
          </div>

          <div
            v-if="tags.length"
            class="flex flex-wrap gap-1.5 sm:ml-auto"
          >
            <span
              v-for="tag in tags.slice(0, 3)"
              class="rounded-full px-2 py-0.5 text-xs transition-colors"
              :class="tagClass(tag)"
              :key="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
