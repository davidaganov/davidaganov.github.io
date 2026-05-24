<script setup lang="ts">
import AppMenuTrigger from "@base/components/app/AppMenuTrigger.vue"
import { ROUTE_PATH } from "@base/types"

const localePath = useLocalePath()
</script>

<template>
  <header
    class="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 pt-6 sm:px-6 sm:pt-8"
  >
    <NuxtLink
      class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      :to="localePath(ROUTE_PATH.HOME)"
    >
      <UIcon
        name="i-lucide-arrow-left"
        aria-hidden="true"
        class="size-5"
      />
      {{ $t("layout.standalone.backToSite") }}
    </NuxtLink>

    <AppMenuTrigger />
  </header>
</template>
