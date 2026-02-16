<script setup lang="ts">
import AppContentPanel from "@base/components/app/AppContentPanel.vue"
import AppFooter from "@base/components/app/AppFooter.vue"
import AppHeader from "@base/components/app/AppHeader.vue"
import AppLeftSidebar from "@base/components/app/AppLeftSidebar.vue"

const { toggle, close } = useCommandPalette()

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

    <div class="container">
      <div class="flex items-start">
        <AppLeftSidebar />
        <div class="flex flex-1 items-start">
          <AppContentPanel>
            <slot />
          </AppContentPanel>

          <div
            class="hidden w-[300px] shrink-0 self-start pt-8 pb-14 lg:block lg:pl-8"
            id="app-right-sidebar-root"
          />
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
