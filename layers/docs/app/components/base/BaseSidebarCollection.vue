<script setup lang="ts">
import { useSidebarCollection } from "@docs/composables/useSidebarCollection"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import UiLink from "@ui/components/UiLink.vue"
import type { SidebarCollectionItem } from "@docs/types"

const props = defineProps<{
  item: SidebarCollectionItem
}>()

const {
  items,
  isOpen,
  submenuPanelId,
  expandableLabel,
  submenuVisible,
  isIndexActive,
  toggleOpen
} = await useSidebarCollection(props.item)
</script>

<template>
  <div v-if="items.length > 0">
    <template v-if="props.item.indexPage ?? true">
      <div class="flex w-full items-stretch gap-1">
        <UiLink
          class="min-w-0 flex-1 items-center"
          :to="props.item.pathPrefix || ''"
          :active="isIndexActive"
          :aria-label="item.ariaLabelKey ? $t(item.ariaLabelKey) : undefined"
        >
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <UIcon
              v-if="item.icon"
              class="size-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
              :name="item.icon"
            />
            <span class="line-clamp-1">{{ $t(item.label) }}</span>
          </div>
        </UiLink>

        <UiLink
          v-if="item.collapsible"
          is-icon
          :active="isIndexActive"
          :aria-expanded="isOpen"
          :aria-controls="submenuPanelId"
          :aria-label="expandableLabel"
          @click.prevent.stop="toggleOpen"
        >
          <UIcon
            name="i-lucide-chevron-down"
            class="size-4.5 opacity-70 transition-[transform,opacity] duration-200 group-hover:opacity-100"
            aria-hidden="true"
            :class="item.collapsible && !isOpen ? '-rotate-90' : 'rotate-0'"
          />
        </UiLink>
      </div>
    </template>

    <button
      v-else-if="props.item.collapsible"
      type="button"
      class="text-muted mb-0.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium hover:bg-black/5 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
      :class="isOpen ? 'text-primary-700 dark:text-primary-400' : ''"
      :aria-expanded="isOpen"
      :aria-controls="submenuPanelId"
      :aria-label="expandableLabel"
      @click="toggleOpen"
    >
      <UIcon
        v-if="item.icon"
        class="size-4 shrink-0 opacity-70 transition-opacity hover:opacity-100"
        aria-hidden="true"
        :name="item.icon"
      />
      <span class="line-clamp-1 flex-1 text-left">{{ $t(item.label) }}</span>
      <UIcon
        name="i-lucide-chevron-down"
        class="size-3.5 shrink-0 transition-transform duration-200"
        aria-hidden="true"
        :class="!isOpen && '-rotate-90'"
      />
    </button>

    <div
      class="grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="submenuVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      :id="submenuPanelId"
    >
      <div class="ml-2 min-h-0 space-y-0.5 overflow-hidden p-1">
        <BaseSidebarLink
          v-for="subItem in items"
          :item="subItem"
          :key="subItem.to"
        />
      </div>
    </div>
  </div>
</template>
