<script setup lang="ts">
import AppRightSidebarArticleMeta from "@docs/components/app/AppRightSidebarArticleMeta.vue"
import AppRightSidebarProjectMeta from "@docs/components/app/AppRightSidebarProjectMeta.vue"
import AppRightSidebarToc from "@docs/components/app/AppRightSidebarToc.vue"

defineProps<{
  page: unknown
}>()
</script>

<template>
  <ClientOnly>
    <Teleport to="#app-right-sidebar-root">
      <aside class="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 lg:pb-14">
        <div class="space-y-6">
          <AppRightSidebarToc :page="page" />
          <AppRightSidebarProjectMeta :page="page" />
          <AppRightSidebarArticleMeta :page="page" />
        </div>
      </aside>
    </Teleport>
  </ClientOnly>
</template>
