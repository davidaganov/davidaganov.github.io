<script setup lang="ts">
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
    side="left"
    :title="$t('layout.navigation.aria.title')"
    :description="$t('layout.navigation.aria.description')"
    :ui="{
      overlay: 'bg-black/80 backdrop-blur-sm'
    }"
  >
    <template #body>
      <nav class="h-[calc(100%-47px)] max-w-full flex-1 space-y-1">
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

      <div
        class="mt-auto flex items-center justify-end gap-2 border-t border-black/8 pt-4 dark:border-white/8"
      >
        <UiThemeToggle />
        <UiLanguageSwitcher />
      </div>
    </template>
  </USlideover>
</template>
