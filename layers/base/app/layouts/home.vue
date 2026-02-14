<script setup lang="ts">
import BaseFooter from "@base/components/BaseFooter.vue"
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
  <div class="relative min-h-dvh w-full overflow-hidden bg-background-deep text-white">
    <slot />
    <BaseFooter />
    <UiCommandPalette />
  </div>
</template>
