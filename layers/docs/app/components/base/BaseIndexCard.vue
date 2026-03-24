<script setup lang="ts">
import type { ArticleItem } from "@docs/types/article"
import { formatDate } from "@base/utils/date"

const props = defineProps<{
  article: ArticleItem
  selectedTags: string[]
}>()

const localePath = useLocalePath()

const icon = computed(() => props.article.meta?.icon || "i-lucide-file-text")
const tags = computed(() => props.article.meta?.tags || [])
const iconClass = computed(() => "dark:text-primary-400 text-primary-500 size-6")

const cardClass = computed(() => {
  return "group relative overflow-hidden rounded-xl border border-black/5 duration-300 dark:border-primary-500/20 bg-black/[0.02] dark:bg-primary-500/5 p-4 transition-all hover:border-primary-500/30 dark:hover:border-primary-500/30 hover:bg-primary-50/50 dark:hover:bg-primary-500/10 hover:shadow-lg dark:hover:shadow-primary-500/10 sm:p-5"
})

const iconWrapClass = computed(() => {
  return "hidden shrink-0 items-center justify-center rounded-xl border border-black/5 dark:border-primary-500/20 bg-black/5 dark:bg-primary-500/10 sm:flex sm:size-12"
})

const tagClass = (tag: string) =>
  props.selectedTags.includes(tag)
    ? "bg-primary-200/50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300"
    : "text-muted bg-black/5 dark:bg-white/5"
</script>

<template>
  <NuxtLink
    :class="cardClass"
    :to="localePath(String(article.path))"
    :key="String(article.path)"
  >
    <div class="flex items-start gap-3 sm:gap-4">
      <div :class="iconWrapClass">
        <UIcon
          :class="iconClass"
          :name="icon"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2
              class="group-hover:text-primary-600 text-sm font-semibold text-gray-900 transition-colors sm:text-base dark:text-white"
            >
              {{ article.title }}
            </h2>
            <p class="text-muted mt-1 line-clamp-2 text-xs sm:text-sm">
              {{ article.description }}
            </p>
          </div>
          <UIcon
            class="text-muted group-hover:text-primary-800 size-4 shrink-0 transition-colors sm:size-5"
            name="i-lucide-arrow-right"
          />
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <div
            v-if="article.meta?.publishedAt"
            class="text-muted flex items-center gap-1.5 text-xs"
          >
            <UIcon
              class="size-3.5"
              name="i-lucide-calendar"
            />
            <span>{{ formatDate(article.meta?.publishedAt ?? "") }}</span>
          </div>

          <div
            v-if="article.meta?.readingTime"
            class="text-muted flex items-center gap-1.5 text-xs"
          >
            <UIcon
              class="size-3.5"
              name="i-lucide-clock"
            />
            <span>{{ article.meta.readingTime }}</span>
          </div>

          <div
            v-if="article.meta?.habrUrl"
            class="text-primary-700 flex items-center gap-1.5 text-xs"
          >
            <UIcon
              class="size-3.5"
              name="i-simple-icons-habr"
            />
            <span>{{ $t("layout.navigation.social.habr") }}</span>
          </div>

          <div
            v-if="article.meta?.hasArchive"
            class="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400"
          >
            <UIcon
              class="size-3.5"
              name="i-lucide-file-archive"
            />
            <span>ZIP</span>
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
