<script setup lang="ts">
import { useSiteNav } from "@docs/composables/useSiteNav"
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import BaseSidebarNavList from "@docs/components/base/BaseSidebarNavList.vue"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiThemeToggle from "@ui/components/UiThemeToggle.vue"

const props = defineProps<{
  open: boolean
}>()

const route = useRoute()

const emit = defineEmits<{
  close: []
  "update:open": [value: boolean]
}>()

const { flatNavItems } = await useSiteNav()

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
    :ui="{
      content: 'max-w-none sm:max-w-md',
      overlay: 'bg-black/80 backdrop-blur-sm pointer-events-auto',
      header:
        'flex items-center justify-between py-5 gap-2 min-h-fit border-b border-black/8 px-4 dark:border-white/8',
      title: 'text-base font-semibold',
      body: 'p-0',
      close: 'size-8'
    }"
  >
    <template #body>
      <div class="flex h-full flex-col overflow-hidden">
        <div class="min-h-0 flex-1 overflow-hidden px-1 pr-2">
          <BaseScrollbar height="100%">
            <nav
              id="site-nav"
              class="space-y-1 py-3 pb-4"
              :aria-label="$t('layout.navigation.aria.title')"
            >
              <BaseSidebarNavList
                :items="flatNavItems"
                @navigate="handleClose"
              />
            </nav>
          </BaseScrollbar>
        </div>

        <div
          class="mt-auto flex items-center justify-end gap-2 border-t border-black/8 px-4 pt-3 dark:border-white/8"
        >
          <UiThemeToggle />
          <UiLanguageSwitcher />
        </div>
      </div>
    </template>
  </USlideover>
</template>
