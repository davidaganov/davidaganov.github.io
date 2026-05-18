<script setup lang="ts">
import { defineShortcuts } from "@nuxt/ui/composables"
import { useCommandPalette } from "@base/composables/useCommandPalette"
import AppFooter from "@base/components/app/AppFooter.vue"

const { toggle, close } = useCommandPalette()

defineShortcuts({
  meta_k: () => {
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
    <main
      tabindex="-1"
      class="outline-none"
      id="main-content"
    >
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
