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
        class="text-primary-400 flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5"
      >
        A
      </span>
      <span
        v-if="!props.short"
        class="text-lg font-semibold"
      >
        David Aganov
      </span>
    </NuxtLink>
  </div>
</template>
