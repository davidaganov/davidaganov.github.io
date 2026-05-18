<script setup lang="ts">
import UiLink from "@ui/components/UiLink.vue"
import type { SidebarLinkItem } from "@docs/types"

const props = defineProps<{
  item: SidebarLinkItem
}>()

const localePath = useLocalePath()
const route = useRoute()

/**
 * Checks if the link is currently active based on the current route.
 */
const isActive = computed(() => {
  if (!props.item.to) return false
  return route.path === localePath(props.item.to)
})

/**
 * Normalizes the label for display, handling translation if needed.
 */
const label = computed(() => {
  if (props.item.translate === false) {
    return props.item.label || props.item.name || ""
  }
  return props.item.label ? useI18n().t(props.item.label) : ""
})
</script>

<template>
  <UiLink
    v-if="props.item.to"
    class="w-full"
    :to="props.item.to"
    :active="isActive"
  >
    <UIcon
      v-if="props.item.icon"
      class="size-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
      :name="props.item.icon"
    />
    <span class="truncate">
      {{ label }}
    </span>
  </UiLink>

  <UiLink
    v-else-if="props.item.href"
    class="ml-2 w-[calc(100%-0.5rem)]"
    :href="props.item.href"
    :target="props.item.target"
  >
    <UIcon
      v-if="props.item.icon"
      class="size-4"
      :name="props.item.icon"
    />
    <span class="line-clamp-1">
      {{ label }}
    </span>
  </UiLink>
</template>
