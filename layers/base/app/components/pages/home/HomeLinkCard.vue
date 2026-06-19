<script setup lang="ts">
import type { StyleValue } from "vue"

interface LocalizedLink {
  url: string
  icon: string
  customStyle?: StyleValue
  localizedName: string | undefined
  localizedDescription: string | undefined
  isCta: boolean
}

export type { LocalizedLink }

const props = defineProps<{
  link: LocalizedLink
}>()
</script>

<template>
  <UiSpotlightCard
    target="_blank"
    rel="noopener noreferrer"
    content-class="flex items-center gap-3"
    :href="props.link.url"
    :variant="props.link.isCta ? 'linkCta' : 'link'"
  >
    <div
      class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-black/5 transition-[background-color,border-color] duration-300 group-hover:border-black/15 group-hover:bg-black/8 dark:border-white/10 dark:bg-black/30 dark:group-hover:border-white/15 dark:group-hover:bg-black/40"
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
  </UiSpotlightCard>
</template>
