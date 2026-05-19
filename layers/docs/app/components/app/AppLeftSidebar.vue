<script setup lang="ts">
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import BaseSidebarCollection from "@docs/components/base/BaseSidebarCollection.vue"
import BaseSidebarDivider from "@docs/components/base/BaseSidebarDivider.vue"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import type { SidebarItem } from "@docs/types"

defineProps<{
  items: SidebarItem[]
}>()

const getSidebarItemKey = (item: SidebarItem): string => {
  if (item.type === "link") {
    return `link:${item.name || item.to || item.href || item.label || "unknown"}`
  }

  if (item.type === "collection") {
    return `collection:${item.source}`
  }

  return `divider:${item.label || item.class || "divider"}`
}
</script>

<template>
  <aside class="sticky top-(--ui-header-height) h-fit w-[240px] shrink-0 overflow-hidden pt-3 pr-2">
    <BaseScrollbar height="calc(100vh - var(--ui-header-height))">
      <div class="pb-8">
        <nav
          class="flex flex-col gap-1 p-1"
          :aria-label="$t('layout.navigation.aria.docsSidebar')"
        >
          <template
            v-for="item in items"
            :key="getSidebarItemKey(item)"
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
