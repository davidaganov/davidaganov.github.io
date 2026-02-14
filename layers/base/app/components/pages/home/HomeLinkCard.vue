<script setup lang="ts">
import type { Link } from "@base/types/links"

interface LocalizedLink extends Link {
  localizedName: string | undefined
  localizedDescription: string | undefined
  isCta: boolean
}

const props = withDefaults(
  defineProps<{
    link: LocalizedLink
    animated?: boolean
    index?: number
    motionInitial?: Record<string, string | number>
    motionEnter?: (index: number) => Record<string, unknown>
  }>(),
  {
    animated: false,
    index: 0,
    motionEnter: () => () => ({ opacity: 1, y: 0, filter: "blur(0px)" }),
    motionInitial: () => ({
      opacity: 0,
      y: 14,
      filter: "blur(6px)"
    })
  }
)

const enterState = computed(() =>
  props.animated ? props.motionEnter?.(props.index) : props.motionInitial
)
</script>

<template>
  <a
    v-motion
    target="_blank"
    rel="noopener noreferrer"
    class="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(184,126,239,0.12)]"
    :initial="props.motionInitial"
    :enter="enterState"
    :href="props.link.url"
    :class="{
      'border-primary-500/30 bg-primary-500/5 hover:border-primary-500/50': props.link.isCta
    }"
  >
    <div class="flex items-center gap-3">
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30"
      >
        <UIcon
          v-if="props.link.icon?.startsWith('i-')"
          class="size-5 text-gray-200"
          :name="props.link.icon"
          :style="props.link.customStyle"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="truncate text-sm font-medium text-white">
          {{ props.link.localizedName }}
        </div>
        <div class="truncate text-xs text-gray-400">
          {{ props.link.localizedDescription || props.link.url }}
        </div>
      </div>

      <UIcon
        name="i-lucide-arrow-up-right"
        class="size-4 shrink-0 text-gray-400 transition-colors group-hover:text-white"
      />
    </div>

    <div
      v-if="props.link.isCta"
      class="pointer-events-none absolute inset-0 bg-primary-500/5 opacity-100 transition-opacity duration-300"
    />

    <div
      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <div class="absolute -right-20 -top-20 size-40 rounded-full bg-primary-500/10 blur-2xl" />
      <div class="absolute -bottom-20 -left-20 size-40 rounded-full bg-purple-500/10 blur-2xl" />
    </div>
  </a>
</template>
