<script setup lang="ts">
import AppRightSidebarMeta from "@base/components/app/AppRightSidebarMeta.vue"
import AppRightSidebarToc from "@base/components/app/AppRightSidebarToc.vue"

defineProps<{
  page: unknown
}>()
</script>

<template>
  <Teleport to="#app-right-sidebar-root">
    <aside class="sticky top-12 h-fit self-start">
      <div class="space-y-6">
        <AppRightSidebarToc :page="page" />
        <AppRightSidebarMeta :page="page" />
      </div>
    </aside>
  </Teleport>
</template>
