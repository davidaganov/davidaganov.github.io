<script setup lang="ts">
import UiBadge from "@ui/components/UiBadge.vue"

const props = defineProps<{
  page: unknown
}>()

const pageRef = toRef(() => props.page)

const { stats, loading, formatDownloads, formatDate } = useProjectStats(pageRef)

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
        icon: "i-lucide-star",
        color: "#a78bfa"
      }
    : undefined
})
</script>

<template>
  <div
    v-if="shouldRender"
    class="rounded-xl border border-white/5 bg-white/3 p-4"
  >
    <div class="grid grid-cols-12 gap-2">
      <UiBadge
        v-if="meta.githubUrl"
        block
        icon="i-lucide-github"
        trailing-icon="i-lucide-arrow-up-right"
        external
        class="col-span-7"
        :label="$t('layout.projectPage.github')"
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
        :label="$t('layout.projectPage.npm')"
        :href="meta.npmUrl"
      />
    </div>

    <div class="mt-2 grid grid-cols-12 gap-2">
      <UiBadge
        v-if="stats.npm?.version"
        class="col-span-5"
        icon="i-lucide-arrow-down-z-a"
        :label="$t('layout.projectPage.version') + `:`"
        :value="`v${stats.npm.version}`"
        :loading="loading"
      />
      <UiBadge
        v-if="stats.npm?.downloads"
        class="col-span-7"
        icon="i-lucide-download"
        :label="$t('layout.projectPage.downloads') + `:`"
        :value="formatDownloads(stats.npm.downloads)"
        :loading="loading"
      />
      <UiBadge
        v-if="stats.github?.lastCommit"
        icon="i-lucide-clock"
        class="col-span-12"
        :label="$t('layout.projectPage.lastCommit') + `:`"
        :value="formatDate(stats.github.lastCommit)"
        :loading="loading"
      />
    </div>

    <div v-if="stats.github?.languages?.length">
      <hr class="my-2 border-white/10" />

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

    <a
      v-if="meta.githubUrl"
      :href="meta.githubUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="bg-primary-500/15 text-primary-300 hover:bg-primary-500/20 mt-4 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
    >
      <UIcon
        name="i-lucide-star"
        class="size-4"
      />
      <span>{{ $t("layout.projectPage.star") }}</span>
    </a>
  </div>
</template>
