<script setup lang="ts">
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import BaseSidebarCollection from "@docs/components/base/BaseSidebarCollection.vue"
import BaseSidebarDivider from "@docs/components/base/BaseSidebarDivider.vue"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import { useSidebarItems } from "@docs/composables/useSidebarItems"

const { renderedSidebarItems } = useSidebarItems()
</script>

<template>
  <aside
    class="sticky top-(--ui-header-height) h-fit max-h-[calc(100vh-var(--ui-header-height))] w-[240px] shrink-0 overflow-hidden pr-2"
  >
    <BaseScrollbar height="calc(100vh - var(--ui-header-height))">
      <div class="pb-8">
        <nav class="flex flex-col gap-1">
          <template
            v-for="(item, index) in renderedSidebarItems"
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
            <BaseSidebarCollection
              v-else-if="item.type === 'collection'"
              :item="item"
            />
          </template>
        </nav>
      </div>
    </BaseScrollbar>
  </aside>
</template>
