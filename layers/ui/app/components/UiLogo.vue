<script setup lang="ts">
import { ROUTE_PATH } from "@base/types/enums/route.enum"

const props = withDefaults(
  defineProps<{
    short?: boolean
  }>(),
  {
    short: false
  }
)

const localePath = useLocalePath()
</script>

<template>
  <div class="dark:bg-background-deep rounded-md bg-[#f8fafc] sm:rounded-lg">
    <NuxtLink
      class="inline-flex items-center gap-2 font-semibold text-gray-900 transition-opacity hover:opacity-80 dark:text-white"
      :to="localePath(ROUTE_PATH.HOME)"
    >
      <span
        class="text-primary-500 dark:text-primary-400 flex size-6 items-center justify-center rounded-md border border-black/10 bg-black/5 text-center text-sm sm:size-8 sm:rounded-lg sm:text-base dark:border-white/10 dark:bg-white/5"
      >
        A
      </span>
      <span
        v-if="!props.short"
        class="text-base font-semibold sm:text-lg"
      >
        David Aganov
      </span>
    </NuxtLink>
  </div>
</template>
