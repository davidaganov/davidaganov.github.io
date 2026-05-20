<script setup lang="ts">
import { getSidebarItemKey } from "@docs/utils/sidebar/sidebarItemKey"
import BaseSidebarCollection from "@docs/components/base/BaseSidebarCollection.vue"
import BaseSidebarDivider from "@docs/components/base/BaseSidebarDivider.vue"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import type { SidebarItem } from "@docs/types"

const props = defineProps<{
  items: SidebarItem[]
}>()

const emit = defineEmits<{
  navigate: []
}>()
</script>

<template>
  <template
    v-for="item in props.items"
    :key="getSidebarItemKey(item)"
  >
    <BaseSidebarLink
      v-if="item.type === 'link'"
      :item="item"
      @click="emit('navigate')"
    />
    <BaseSidebarDivider
      v-else-if="item.type === 'divider'"
      :item="item"
    />
    <BaseSidebarCollection
      v-else-if="item.type === 'collection'"
      :item="item"
      @click="emit('navigate')"
    />
  </template>
</template>
