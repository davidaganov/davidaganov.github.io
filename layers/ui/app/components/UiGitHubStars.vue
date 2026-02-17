<script setup lang="ts">
import { ApiClient } from "@api/services/client"
import { GITHUB_REPO } from "@base/constants/config"

const stars = ref<number>(0)
const loading = ref(true)

const formatStars = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return String(count)
}

const githubUrl = `https://github.com/${GITHUB_REPO}`

onMounted(async () => {
  try {
    stars.value = await ApiClient.github.getStars(GITHUB_REPO)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <UButton
    target="_blank"
    size="sm"
    variant="ghost"
    class="group py-0! hover:bg-white/10"
    :to="githubUrl"
    :ui="{
      base: 'bg-white/10 border h-[30px] border-white/20 text-white'
    }"
  >
    <div class="flex items-center gap-1.5">
      <UIcon
        name="i-simple-icons-github"
        class="size-4"
      />
      <span
        v-if="!loading"
        class="text-sm font-medium"
      >
        {{ formatStars(stars) }}
      </span>
      <span
        v-else
        class="text-sm"
      >
        —
      </span>
      <UIcon
        name="i-heroicons-star-20-solid"
        class="-mt-px size-3.5 text-white transition-colors group-hover:text-yellow-400"
      />
    </div>
  </UButton>
</template>
