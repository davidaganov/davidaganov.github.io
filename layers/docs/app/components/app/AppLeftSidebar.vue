<script setup lang="ts">
import BaseSidebarCollection from "@docs/components/base/BaseSidebarCollection.vue"
import BaseSidebarDivider from "@docs/components/base/BaseSidebarDivider.vue"
import BaseSidebarGroup from "@docs/components/base/BaseSidebarGroup.vue"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import { SIDEBAR_ITEMS } from "@docs/config/sidebar"
</script>

<template>
  <aside
    class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-white/5 lg:block"
  >
    <div class="py-8 pr-4">
      <nav class="space-y-1">
        <template
          v-for="(item, index) in SIDEBAR_ITEMS"
          :key="index"
        >
          <BaseSidebarLink
            v-if="item.type === 'link'"
            :item="item"
          />
          <BaseSidebarDivider
            v-else-if="item.type === 'divider'"
            :item="item"
          />
          <BaseSidebarGroup
            v-else-if="item.type === 'group'"
            :item="item"
          />
          <BaseSidebarCollection
            v-else-if="item.type === 'collection'"
            :item="item"
          />
        </template>
      </nav>
    </div>
  </aside>
</template>
