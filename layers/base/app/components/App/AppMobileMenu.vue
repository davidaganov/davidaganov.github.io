<script setup lang="ts">
import { useSidebarItems } from "@docs/composables/useSidebarItems"
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import BaseSidebarCollection from "@docs/components/base/BaseSidebarCollection.vue"
import BaseSidebarDivider from "@docs/components/base/BaseSidebarDivider.vue"
import BaseSidebarLink from "@docs/components/base/BaseSidebarLink.vue"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiThemeToggle from "@ui/components/UiThemeToggle.vue"
import { ROUTE_PATH } from "@base/types"

const props = defineProps<{
  open: boolean
}>()

const route = useRoute()

const isDocsRoute = computed(() => route.path.includes(ROUTE_PATH.DOCS))

const graphNavItem = computed(() => ({
  type: "link" as const,
  to: ROUTE_PATH.DOCS_GRAPH,
  label: "docs.graph.sidebar",
  icon: "i-lucide-git-fork",
  translate: true
}))

const emit = defineEmits<{
  (e: "close"): void
  (e: "update:open", value: boolean): void
}>()

const { renderedSidebarItems } = await useSidebarItems()

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
            <nav
              class="space-y-1 pb-4"
              :aria-label="$t('layout.navigation.aria.title')"
              id="site-mobile-nav"
            >
              <BaseSidebarLink
                v-if="isDocsRoute"
                :item="graphNavItem"
                @click="handleClose"
              />
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
