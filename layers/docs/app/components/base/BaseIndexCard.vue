<script setup lang="ts">
import { formatDate } from "@base/utils/date"
import type { ArticleItem } from "@docs/types"

const props = defineProps<{
  article: ArticleItem
  selectedTags: string[]
}>()

const localePath = useLocalePath()

const icon = computed(() => props.article.meta?.icon || "i-lucide-file-text")
const tags = computed(() => props.article.meta?.tags || [])

const tagClass = (tag: string) => {
  return props.selectedTags.includes(tag)
    ? "bg-primary-200/50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300"
    : "text-muted bg-black/5 dark:bg-white/5"
}
</script>

<template>
  <UiSpotlightCard
    variant="article"
    :to="localePath(String(article.path))"
    :key="String(article.path)"
  >
    <div class="flex flex-col gap-3">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <span
            class="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white/85"
          >
            <UIcon
              class="size-4 shrink-0 text-gray-500 dark:text-gray-400"
              :name="icon"
            />
            {{ article.title }}
          </span>
          <p
            v-if="article.description"
            class="text-muted mt-1 line-clamp-2 text-xs sm:text-sm"
          >
            {{ article.description }}
          </p>
        </div>
        <UIcon
          class="group-hover:text-primary-700 dark:group-hover:text-primary-400 size-4 shrink-0 text-gray-500 transition-colors sm:size-5 dark:text-gray-400"
          name="i-lucide-arrow-right"
        />
      </div>

      <div
        v-if="
          article.meta?.publishedAt ||
          article.meta?.habrUrl ||
          article.meta?.hasArchive ||
          tags.length
        "
        class="flex flex-wrap items-center gap-2 sm:gap-3"
      >
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
          v-if="article.meta?.habrUrl"
          class="text-primary-700 dark:text-primary-400 flex items-center gap-1.5 text-xs"
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
  </UiSpotlightCard>
</template>
