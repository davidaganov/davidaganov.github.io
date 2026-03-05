<script setup lang="ts">
import type { Link } from "@base/types/links"

interface LocalizedLink extends Link {
  localizedName: string | undefined
  localizedDescription: string | undefined
  isCta: boolean
}

const props = defineProps<{
  link: LocalizedLink
}>()
</script>

<template>
  <a
    target="_blank"
    rel="noopener noreferrer"
    class="link-card group relative overflow-hidden rounded-xl border border-black/10 bg-black/3 p-5 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 hover:bg-black/5 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-[0_0_30px_rgba(184,126,239,0.12)]"
    :class="{
      'border-primary-500/30 bg-primary-50 dark:bg-primary-500/5 hover:border-primary-500/50':
        props.link.isCta
    }"
    :href="props.link.url"
  >
    <div class="flex items-center gap-3">
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-black/5 dark:border-white/10 dark:bg-black/30"
      >
        <UIcon
          v-if="props.link.icon?.startsWith('i-')"
          class="size-5 text-gray-600 dark:text-gray-200"
          :name="props.link.icon"
          :style="props.link.customStyle"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="truncate text-sm font-medium text-gray-900 dark:text-white">
          {{ props.link.localizedName }}
        </div>
        <div class="truncate text-xs text-gray-500 dark:text-gray-400">
          {{ props.link.localizedDescription || props.link.url }}
        </div>
      </div>

      <UIcon
        name="i-lucide-arrow-up-right"
        class="group-hover:text-primary-600 size-4 shrink-0 text-gray-400 transition-colors dark:group-hover:text-white"
      />
    </div>

    <div
      v-if="props.link.isCta"
      class="bg-primary-500/5 pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-300"
    />

    <div
      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <div class="bg-primary-500/10 absolute -top-20 -right-20 size-40 rounded-full blur-2xl" />
      <div class="absolute -bottom-20 -left-20 size-40 rounded-full bg-purple-500/10 blur-2xl" />
    </div>
  </a>
</template>
