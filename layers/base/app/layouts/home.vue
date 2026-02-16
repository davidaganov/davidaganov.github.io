<script setup lang="ts">
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
    <slot />
    <AppFooter />
  </div>
</template>
