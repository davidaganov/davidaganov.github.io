<script setup lang="ts">
import AppRightSidebar from "@docs/components/app/AppRightSidebar.vue"
import { ROUTE_PATH } from "@base/types/enums"

const localePath = useLocalePath()

const { data: page } = await usePageContent(ROUTE_PATH.GETTING_STARTED)
</script>

<template>
  <div v-if="page">
    <NuxtLink
      class="text-primary mb-1.5 block text-sm font-semibold"
      :to="localePath(ROUTE_PATH.GETTING_STARTED)"
    >
      {{ $t("layout.sidebar.nav.gettingStarted") }}
    </NuxtLink>
    <ContentRenderer :value="page" />
    <AppRightSidebar :page="page" />
  </div>
  <div v-else>
    <h1>Not found</h1>
  </div>
</template>
