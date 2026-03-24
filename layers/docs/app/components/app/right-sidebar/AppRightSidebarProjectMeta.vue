<script setup lang="ts">
import AppRightSidebarCard from "@docs/components/app/right-sidebar/AppRightSidebarCard.vue"
import { formatDate } from "@base/utils/date"
import UiBadge from "@ui/components/UiBadge.vue"

const props = defineProps<{
  page: unknown
}>()

const { locale } = useI18n()
const pageRef = toRef(() => props.page)

const { stats, loading, formatDownloads } = useProjectStats(pageRef)

const meta = computed(() => {
  const p = (props.page || {}) as { meta?: Record<string, unknown> }
  const m = (p.meta || {}) as Record<string, unknown>

  return {
    npmUrl: String(m.npmUrl || ""),
    githubUrl: String(m.githubUrl || "")
  }
})

const hasLinks = computed(() => Boolean(meta.value.npmUrl || meta.value.githubUrl))

const shouldRender = computed(
  () => hasLinks.value || Boolean(stats.value.github?.languages?.length)
)

const githubStars = computed(() => {
  return stats.value.github?.stars !== undefined
    ? {
        text: stats.value.github.stars,
        icon: "i-heroicons-star-20-solid",
        color: "#a78bfa"
      }
    : undefined
})
</script>

<template>
  <AppRightSidebarCard v-if="shouldRender">
    <div class="grid grid-cols-12 gap-2">
      <UiBadge
        v-if="meta.githubUrl"
        block
        icon="i-lucide-github"
        trailing-icon="i-lucide-arrow-up-right"
        external
        class="col-span-7"
        :label="$t('layout.navigation.social.github')"
        :href="meta.githubUrl"
        :tag="githubStars"
      />

      <UiBadge
        v-if="meta.npmUrl"
        block
        icon="i-simple-icons-npm"
        trailing-icon="i-lucide-arrow-up-right"
        external
        class="col-span-5"
        :label="$t('layout.navigation.social.npm')"
        :href="meta.npmUrl"
      />
    </div>

    <div class="mt-2 grid grid-cols-12 gap-2">
      <UiBadge
        v-if="stats.npm?.version || stats.github?.version"
        class="col-span-4"
        icon="i-lucide-arrow-down-z-a"
        :value="`v${stats.npm?.version || stats.github?.version}`"
        :loading="loading"
      />
      <UiBadge
        v-if="stats.npm?.downloads"
        class="col-span-8"
        icon="i-lucide-download"
        :label="$t('pages.projects.metrics.downloads') + `:`"
        :value="formatDownloads(stats.npm.downloads)"
        :loading="loading"
      />
      <UiBadge
        v-if="stats.github?.lastCommit"
        icon="i-lucide-clock"
        :class="[
          'flex-col!',
          stats.npm?.downloads
            ? 'col-span-12'
            : stats.npm?.version || stats.github?.version
              ? 'col-span-8'
              : 'col-span-12'
        ]"
        :label="$t('pages.projects.metrics.lastCommit') + `:`"
        :value="formatDate(stats.github.lastCommit, locale, 'short') || ''"
        :loading="loading"
      />
    </div>

    <div v-if="stats.github?.languages?.length">
      <hr class="my-2 border-black/15 dark:border-white/10" />

      <div class="flex flex-wrap gap-2">
        <UiBadge
          v-for="lang in stats.github.languages"
          :label="lang.name"
          :value="`${lang.percentage}%`"
          :color="lang.color"
          :loading="loading"
          :key="lang.name"
        />
      </div>
    </div>

    <UButton
      v-if="meta.githubUrl"
      block
      class="mt-2"
      target="_blank"
      rel="noopener noreferrer"
      color="primary"
      variant="soft"
      icon="i-heroicons-star-20-solid"
      :href="meta.githubUrl"
    >
      {{ $t("pages.projects.metrics.star") }}
    </UButton>
  </AppRightSidebarCard>
</template>
