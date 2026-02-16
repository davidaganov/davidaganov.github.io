<script setup lang="ts">
import type { SidebarDividerItem } from "@docs/types/sidebar"

const props = defineProps<{
  item: SidebarDividerItem
}>()
</script>

<template>
  <div :class="props.item.class">
    <div
      v-if="props.item.label"
      class="text-muted mb-3 px-3 text-xs font-semibold tracking-wider uppercase"
    >
      {{ $t(props.item.label) }}
    </div>
  </div>
</template>
