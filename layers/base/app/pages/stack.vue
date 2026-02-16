<script setup lang="ts">
import AppRightSidebar from "@base/components/app/AppRightSidebar.vue"
import { ROUTE_PATH } from "@base/types/enums"

const { data: page } = await usePageContent(ROUTE_PATH.STACK)
</script>

<template>
  <div v-if="page">
    <ContentRenderer :value="page" />
    <AppRightSidebar :page="page" />
  </div>
  <div v-else>
    <h1>Not found</h1>
  </div>
</template>
