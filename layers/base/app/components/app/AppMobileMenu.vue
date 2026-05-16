<script setup lang="ts">
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import BaseSidebarCollection from "@docs/components/base/BaseSidebarCollection.vue"
import BaseSidebarDivider from "@docs/components/base/BaseSidebarDivider.vue"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import { useSidebarItems } from "@docs/composables/useSidebarItems"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiThemeToggle from "@ui/components/UiThemeToggle.vue"

const props = defineProps<{
  open: boolean
}>()

const route = useRoute()

const emit = defineEmits<{
  (e: "close"): void
  (e: "update:open", value: boolean): void
}>()

const { renderedSidebarItems } = useSidebarItems()

const isOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit("update:open", val)
    if (!val) emit("close")
  }
})

const handleClose = () => {
  isOpen.value = false
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
    v-model:open="isOpen"
    side="right"
    :title="$t('layout.navigation.aria.title')"
    :description="$t('layout.navigation.aria.description')"
    :ui="{
      content: 'max-w-none sm:max-w-md',
      overlay: 'bg-black/80 backdrop-blur-sm pointer-events-auto'
    }"
  >
    <template #body>
      <div class="flex h-full flex-col overflow-hidden">
        <div class="min-h-0 flex-1 overflow-hidden pr-2">
          <BaseScrollbar height="100%">
            <nav class="space-y-1 pb-4">
              <template
                v-for="(item, index) in renderedSidebarItems"
                :key="index"
              >
                <BaseSidebarLink
                  v-if="item.type === 'link'"
                  :item="item"
                  @click="handleClose"
                />
                <BaseSidebarDivider
                  v-else-if="item.type === 'divider'"
                  :item="item"
                />
                <BaseSidebarCollection
                  v-else-if="item.type === 'collection'"
                  :item="item"
                  @click="handleClose"
                />
              </template>
            </nav>
          </BaseScrollbar>
        </div>

        <div
          class="mt-auto flex items-center justify-end gap-2 border-t border-black/8 pt-4 pb-2 dark:border-white/8"
        >
          <UiThemeToggle />
          <UiLanguageSwitcher />
        </div>
      </div>
    </template>
  </USlideover>
</template>
