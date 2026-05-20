<script setup lang="ts">
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import BaseSidebarNavList from "@docs/components/base/BaseSidebarNavList.vue"
import type { SidebarItem } from "@docs/types"

defineProps<{
  items: SidebarItem[]
}>()
</script>

<template>
  <aside class="sticky top-(--ui-header-height) h-fit w-[240px] shrink-0 overflow-hidden pt-3 pr-2">
    <BaseScrollbar height="calc(100vh - var(--ui-header-height))">
      <div class="pb-8">
        <nav
          class="flex flex-col gap-1 p-1"
          :aria-label="$t('layout.navigation.aria.docsSidebar')"
        >
          <BaseSidebarNavList :items="items" />
        </nav>
      </div>
    </BaseScrollbar>
  </aside>
</template>
