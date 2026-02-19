<script setup lang="ts">
import AppContentPanel from "@docs/components/app/AppContentPanel.vue"
import AppLeftSidebar from "@docs/components/app/AppLeftSidebar.vue"
import BaseLight from "@docs/components/base/BaseLight.vue"
import AppFooter from "@base/components/app/AppFooter.vue"
import AppHeader from "@base/components/app/AppHeader.vue"

const { toggle, close } = useCommandPalette()
const { light } = usePageTransitionLight()

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
        <div class="flex flex-1">
          <AppContentPanel>
            <slot />
          </AppContentPanel>

          <div
            class="hidden w-[300px] shrink-0 lg:block lg:pl-8"
            id="app-right-sidebar-root"
          />
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
