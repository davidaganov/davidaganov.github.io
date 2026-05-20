<script setup lang="ts">
import { defineShortcuts } from "@nuxt/ui/composables"
import { useCommandPalette } from "@base/composables/useCommandPalette"
import { useDocsLayoutTransition } from "@docs/composables/docs/useDocsLayoutTransition"
import { useSidebarItems } from "@docs/composables/useSidebarItems"
import { isChangelogDocsPath, isGraphDocsPath } from "@docs/utils/sections"
import AppFooter from "@base/components/app/AppFooter.vue"
import AppHeader from "@base/components/app/AppHeader.vue"
import AppContentPanel from "@docs/components/app/AppContentPanel.vue"
import AppLeftSidebar from "@docs/components/app/AppLeftSidebar.vue"
import BaseLight from "@docs/components/base/BaseLight.vue"

const route = useRoute()

const { renderedSidebarItems } = await useSidebarItems()
const { toggle, close } = useCommandPalette()
const { light } = useDocsLayoutTransition()

const hideDocsRightColumn = computed(() => {
  return isChangelogDocsPath(route.path) || isGraphDocsPath(route.path)
})

const isGraphPage = computed(() => isGraphDocsPath(route.path))

defineShortcuts({
  meta_k: () => {
    toggle()
  },
  ctrl_k: () => {
    toggle()
  },
  escape: {
    usingInput: true,
    handler: () => close()
  }
})
</script>

<template>
  <div>
    <AppHeader />
    <BaseLight :light="light" />

    <div :class="isGraphPage ? 'w-full max-w-none' : 'container'">
      <div
        class="flex"
        :class="{
          'min-h-[calc(100dvh-7.5rem)] max-lg:h-[calc(100dvh-var(--ui-header-height,7rem))] max-lg:max-h-[calc(100dvh-var(--ui-header-height,7rem))] max-lg:min-h-0 max-lg:overflow-hidden':
            isGraphPage
        }"
      >
        <AppLeftSidebar
          v-show="!isGraphPage"
          class="hidden lg:block"
          :items="renderedSidebarItems"
        />
        <main
          tabindex="-1"
          id="main-content"
          class="flex min-w-0 flex-1 outline-none"
          :class="isGraphPage ? '' : 'lg:border-l lg:border-black/5 dark:lg:border-white/5'"
        >
          <AppContentPanel
            :bare="isGraphPage"
            :class="{ 'w-full lg:max-w-none': hideDocsRightColumn }"
          >
            <slot />
          </AppContentPanel>

          <aside
            v-show="!hideDocsRightColumn"
            class="hidden shrink-0 lg:block lg:w-[300px] lg:pl-6"
            id="app-right-sidebar-root"
          />
        </main>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
