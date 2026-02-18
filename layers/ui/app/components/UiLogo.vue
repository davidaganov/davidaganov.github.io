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
  <div class="bg-background-deep">
    <NuxtLink
      class="inline-flex items-center gap-2 font-semibold text-white transition-opacity hover:opacity-80"
      :to="localePath(ROUTE_PATH.HOME)"
    >
      <span
        class="text-primary-400 flex size-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-center text-sm sm:size-8 sm:rounded-lg sm:text-base"
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
