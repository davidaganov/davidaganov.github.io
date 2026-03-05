<script setup lang="ts">
import { SORT_ORDER } from "@docs/types/enums"
import { buildFiltersQuery } from "@docs/utils/indexFiltersQuery"
import { formatDate } from "@base/utils/date"
import UiBadge from "@ui/components/UiBadge.vue"

const props = defineProps<{
  page: unknown
}>()

const { locale } = useI18n()

const localePath = useLocalePath()
const route = useRoute()

const meta = computed(() => {
  const p = (props.page || {}) as { meta?: Record<string, unknown> }
  const m = (p.meta || {}) as Record<string, unknown>

  return {
    habrUrl: String(m.habrUrl || ""),
    publishedAt: String(m.publishedAt || ""),
    readingTime: String(m.readingTime || ""),
    tags: Array.isArray(m.tags) ? (m.tags as string[]) : []
  }
})

const hasArticleMeta = computed(() =>
  Boolean(
    meta.value.habrUrl || meta.value.publishedAt || meta.value.readingTime || meta.value.tags.length
  )
)

const indexPath = computed(() => {
  const section = String(route.params.section || "")
  const slugParam = route.params.slug
  const slug = Array.isArray(slugParam) ? slugParam.map(String).filter(Boolean) : []

  if (!section || slug.length < 2) return ""
  return `/docs/${section}/${slug[0]}`
})

const tagLink = (tag: string) => {
  if (!indexPath.value) return "#"

  const query = buildFiltersQuery({
    tags: [tag],
    sortOrder: SORT_ORDER.DESC,
    sourceFilter: null,
    includeSource: false
  })

  return localePath({
    path: indexPath.value,
    query: {
      tags: query.tags,
      sort: query.sort,
      source: query.source
    }
  })
}
</script>

<template>
  <div
    v-if="hasArticleMeta"
    class="rounded-xl border border-black/5 bg-black/3 p-4 dark:border-white/5 dark:bg-white/3"
  >
    <div class="space-y-3">
      <UiBadge
        v-if="meta.publishedAt"
        icon="i-lucide-calendar"
        class="w-full"
        :label="$t('pages.articles.meta.published')"
        :value="formatDate(meta.publishedAt, locale, 'numeric') || ''"
      />

      <UiBadge
        v-if="meta.readingTime"
        icon="i-lucide-clock"
        class="w-full"
        :label="$t('pages.articles.meta.readingTime')"
        :value="meta.readingTime"
      />
    </div>

    <hr class="my-2 border-black/15 dark:border-white/10" />

    <div>
      <div v-if="meta.tags.length">
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in meta.tags"
            class="inline-flex items-center gap-1.5 rounded-md border border-black/5 bg-black/5 px-2 py-1 text-xs text-gray-700 transition-colors hover:border-black/10 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:hover:border-white/20 dark:hover:bg-white/10"
            :to="tagLink(tag)"
            :key="tag"
          >
            {{ tag }}
          </NuxtLink>
        </div>
      </div>

      <!-- Replace to UButton -->
      <UButton
        v-if="meta.habrUrl"
        target="_blank"
        rel="noopener noreferrer"
        icon="i-simple-icons-habr"
        color="primary"
        variant="soft"
        class="mt-2"
        block
        :href="meta.habrUrl"
      >
        {{ $t("pages.articles.readOnHabr") }}
      </UButton>
    </div>
  </div>
</template>
