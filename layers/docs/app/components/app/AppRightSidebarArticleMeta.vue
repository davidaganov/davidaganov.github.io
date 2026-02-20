<script setup lang="ts">
import { formatDate } from "@base/utils/date"
import UiBadge from "@ui/components/UiBadge.vue"

const props = defineProps<{
  page: unknown
}>()

const { locale } = useI18n()

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
</script>

<template>
  <div
    v-if="hasArticleMeta"
    class="rounded-xl border border-white/5 bg-white/3 p-4"
  >
    <div class="space-y-3">
      <UiBadge
        v-if="meta.publishedAt"
        icon="i-lucide-calendar"
        class="w-full"
        :label="$t('articles.published')"
        :value="formatDate(meta.publishedAt, locale, 'numeric') || ''"
      />

      <UiBadge
        v-if="meta.readingTime"
        icon="i-lucide-clock"
        class="w-full"
        :label="$t('articles.readingTime')"
        :value="meta.readingTime"
      />
    </div>

    <hr class="my-2 border-white/10" />

    <div>
      <div v-if="meta.tags.length">
        <div class="flex flex-wrap gap-2">
          <UiBadge
            v-for="tag in meta.tags"
            class="text-xs"
            color="#6b7280"
            :label="tag"
            :key="tag"
          />
        </div>
      </div>

      <a
        v-if="meta.habrUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-primary-500/15 text-primary-300 hover:bg-primary-500/20 mt-2 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
        :href="meta.habrUrl"
      >
        <UIcon
          name="i-simple-icons-habr"
          class="size-4"
        />
        <span>{{ $t("articles.readOnHabr") }}</span>
      </a>
    </div>
  </div>
</template>
