<script setup lang="ts">
import AppFooter from "@base/components/app/AppFooter.vue"
import UiCommandPalette from "@ui/components/UiCommandPalette.vue"

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
  <div class="bg-background-deep relative min-h-dvh w-full overflow-hidden text-white">
    <slot />
    <AppFooter />
    <UiCommandPalette />
  </div>
</template>
