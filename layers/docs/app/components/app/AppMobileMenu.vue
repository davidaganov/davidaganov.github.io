<script setup lang="ts">
import BaseSidebarCollection from "@docs/components/base/BaseSidebarCollection.vue"
import BaseSidebarDivider from "@docs/components/base/BaseSidebarDivider.vue"
import BaseSidebarGroup from "@docs/components/base/BaseSidebarGroup.vue"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import { SIDEBAR_ITEMS } from "@docs/config/sidebar"

const props = defineProps<{
  open: boolean
}>()

const route = useRoute()

const emit = defineEmits<{
  (e: "close"): void
}>()

const handleClose = () => {
  emit("close")
}

watch(
  () => route.path,
  () => {
    handleClose()
  }
)
</script>

<template>
  <USlideover
    title="Navigation"
    description="Navigation"
    side="left"
    :open="props.open"
    :ui="{
      overlay: 'bg-black/80 backdrop-blur-sm',
      header: 'sr-only',
      title: 'sr-only'
    }"
    @update:open="(val) => !val && handleClose()"
  >
    <template #content>
      <div class="relative flex h-full flex-col overflow-y-auto bg-(--ui-bg)">
        <UButton
          class="absolute top-2 right-2"
          variant="ghost"
          size="sm"
          icon="i-lucide-x"
          @click="handleClose"
        />
        <nav class="max-w-[calc(100%-30px)] flex-1 space-y-1 p-4">
          <template
            v-for="(item, index) in SIDEBAR_ITEMS"
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
            <BaseSidebarGroup
              v-else-if="item.type === 'group'"
              :item="item"
            />
            <BaseSidebarCollection
              v-else-if="item.type === 'collection'"
              :item="item"
            />
          </template>
        </nav>
      </div>
    </template>
  </USlideover>
</template>
