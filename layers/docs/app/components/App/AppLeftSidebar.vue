<script setup lang="ts">
import { useSidebarItems } from "@docs/composables/useSidebarItems"
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import BaseSidebarCollection from "@docs/components/base/BaseSidebarCollection.vue"
import BaseSidebarDivider from "@docs/components/base/BaseSidebarDivider.vue"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"

const { renderedSidebarItems } = useSidebarItems()
</script>

<template>
  <aside
    class="sticky top-(--ui-sticky-top) h-fit max-h-[calc(100vh-var(--ui-sticky-top))] w-[240px] shrink-0 overflow-hidden pr-2"
  >
    <BaseScrollbar height="calc(100vh - var(--ui-sticky-top))">
      <div class="pb-8">
        <nav
          class="flex flex-col gap-1 p-1"
          :aria-label="$t('layout.navigation.aria.docsSidebar')"
        >
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
