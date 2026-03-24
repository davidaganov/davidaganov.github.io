<script setup lang="ts">
import type { SidebarLinkItem } from "@docs/types/sidebar"

const props = defineProps<{
  item: SidebarLinkItem
}>()

const localePath = useLocalePath()
const route = useRoute()
</script>

<template>
  <NuxtLink
    v-if="props.item.to"
    :to="localePath(props.item.to)"
    class="group ml-2 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all"
    :class="
      route.path === localePath(props.item.to)
        ? 'bg-primary-200/50 dark:bg-primary-500/10 text-primary-800 dark:text-primary-400'
        : 'text-muted hover:bg-black/5 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white'
    "
  >
    <div class="flex items-center gap-3">
      <UIcon
        v-if="props.item.icon"
        class="size-4 opacity-70 transition-opacity group-hover:opacity-100"
        :name="props.item.icon"
      />
      <span class="line-clamp-1">
        {{
          props.item.translate === false
            ? props.item.label || props.item.name || ""
            : $t(props.item.label || "")
        }}
      </span>
    </div>
  </NuxtLink>

  <a
    v-else-if="props.item.href"
    rel="noopener noreferrer"
    class="group text-muted flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-black/5 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
    :href="props.item.href"
    :target="props.item.target"
  >
    <UIcon
      v-if="props.item.icon"
      class="size-4"
      :name="props.item.icon"
    />
    <span class="line-clamp-1">
      {{
        props.item.translate === false
          ? props.item.label || props.item.name || ""
          : $t(props.item.label || "")
      }}
    </span>
  </a>
</template>
