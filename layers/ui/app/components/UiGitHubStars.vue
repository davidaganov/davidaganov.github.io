<script setup lang="ts">
import { useGitHubRepoStars } from "@api/composables/useGitHubRepoStars"
import { GITHUB_REPO } from "@base/constants"

const githubUrl = `https://github.com/${GITHUB_REPO}`

const { t } = useI18n()

const { data: starsCount, status } = await useGitHubRepoStars(GITHUB_REPO)

const loading = computed(() => status.value === "pending" || starsCount.value === null)
const stars = computed(() => starsCount.value ?? 0)

const ariaLabel = computed(() =>
  loading.value ? t("global.status.loading") : t("layout.a11y.githubStars", { count: stars.value })
)

const formatStars = (count: number): string => {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return String(count)
}
</script>

<template>
  <UButton
    target="_blank"
    size="sm"
    variant="ghost"
    rel="noopener noreferrer"
    class="group h-8 px-2.5 py-0! hover:bg-black/5 dark:hover:bg-white/10"
    :to="githubUrl"
    :aria-busy="loading"
    :aria-label="ariaLabel"
    :ui="{
      base: 'bg-black/5 dark:bg-white/10 border h-8 border-black/10 dark:border-white/20 text-gray-900 dark:text-white'
    }"
  >
    <span
      class="flex items-center gap-1.5"
      aria-hidden="true"
    >
      <UIcon
        name="i-simple-icons-github"
        class="size-4 shrink-0"
      />
      <span
        v-if="!loading"
        class="text-sm font-medium tabular-nums"
      >
        {{ formatStars(stars) }}
      </span>
      <span
        v-else
        class="text-sm tabular-nums"
      >
        —
      </span>
      <UIcon
        name="i-heroicons-star-20-solid"
        class="-mt-px size-3.5 text-gray-800 transition-colors group-hover:text-yellow-400 dark:text-white"
      />
    </span>
  </UButton>
</template>
