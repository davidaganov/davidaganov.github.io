<script setup lang="ts">
import AppRightSidebar from "@docs/components/app/AppRightSidebar.vue"
import ProjectPage from "@docs/components/page/project/ProjectPage.vue"
import { TYPE_PAGE } from "@docs/types/enums"
</script>

<template>
  <div>
    <ProjectPage />
    <AppRightSidebar
      :main="true"
      :type="TYPE_PAGE.PROJECT"
    />
  </div>
</template>
