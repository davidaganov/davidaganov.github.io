<script setup lang="ts">
import AppContentPanel from "@docs/components/app/AppContentPanel.vue"
import AppLeftSidebar from "@docs/components/app/AppLeftSidebar.vue"
import BaseLight from "@docs/components/base/BaseLight.vue"
import { isChangelogDocsPath } from "@docs/utils/sections"
import AppFooter from "@base/components/app/AppFooter.vue"
import AppHeader from "@base/components/app/AppHeader.vue"

const route = useRoute()

const { toggle, close } = useCommandPalette()
const { light } = usePageTransitionLight()

const hideDocsRightColumn = computed(() => isChangelogDocsPath(route.path))

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

    <div class="container">
      <div class="flex">
        <AppLeftSidebar class="hidden lg:block" />
        <div class="flex min-w-0 flex-1 lg:border-l lg:border-black/5 dark:lg:border-white/5">
          <AppContentPanel :class="{ 'w-full lg:max-w-none': hideDocsRightColumn }">
            <slot />
          </AppContentPanel>

          <div
            v-if="!hideDocsRightColumn"
            v-motion="'sidebar-right'"
            class="hidden shrink-0 lg:block lg:w-[300px] lg:pl-6"
            :initial="{ opacity: 0, x: 20 }"
            :enter="{
              opacity: 1,
              x: 0,
              transition: { duration: 600, ease: [0.16, 1, 0.3, 1], delay: 200 }
            }"
            id="app-right-sidebar-root"
          />
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
