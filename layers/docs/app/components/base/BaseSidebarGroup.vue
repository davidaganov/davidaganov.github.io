<script setup lang="ts">
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import type { SidebarGroupItem } from "@docs/types/sidebar"

const props = defineProps<{
  item: SidebarGroupItem
}>()
</script>

<template>
  <div :class="props.item.class">
    <div
      v-if="props.item.label"
      class="text-muted/50 mb-2 px-3 text-xs font-semibold tracking-wider uppercase"
    >
      {{ $t(props.item.label) }}
    </div>

    <div class="space-y-1">
      <BaseSidebarLink
        v-for="(subItem, idx) in props.item.items"
        :item="subItem"
        :key="subItem.label || idx"
      />
    </div>
  </div>
</template>
