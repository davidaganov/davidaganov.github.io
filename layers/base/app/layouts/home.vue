<script setup lang="ts">
import AppFooter from "@base/components/App/AppFooter.vue"

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
