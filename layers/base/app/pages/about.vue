<script setup lang="ts">
import { ROUTE_PATH } from "@base/types/enums"

const { data: page } = await usePageContent(ROUTE_PATH.ABOUT)
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
  <div v-else>
    <h1>Not found</h1>
  </div>
</template>
