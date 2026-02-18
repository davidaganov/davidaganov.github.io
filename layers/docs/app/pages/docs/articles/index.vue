<script setup lang="ts">
import AppRightSidebar from "@docs/components/app/AppRightSidebar.vue"
import ArticlePage from "@docs/components/page/article/ArticlePage.vue"
import { TYPE_PAGE } from "@docs/types/enums"
</script>

<template>
  <div>
    <ArticlePage />
    <AppRightSidebar
      :main="true"
      :type="TYPE_PAGE.ARTICLE"
    />
  </div>
</template>
