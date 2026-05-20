<script setup lang="ts">
import AppMenu from "@base/components/app/AppMenu.vue"

const props = withDefaults(
  defineProps<{
    buttonClass?: string
  }>(),
  {
    buttonClass: "size-8"
  }
)

const isOpen = ref(false)
</script>

<template>
  <UButton
    variant="ghost"
    size="sm"
    type="button"
    icon="i-lucide-menu"
    aria-controls="site-nav"
    class="items-center justify-center"
    :class="[props.buttonClass]"
    :aria-expanded="isOpen"
    :aria-label="$t('layout.a11y.openMenu')"
    @click="isOpen = true"
  />

  <AppMenu v-model:open="isOpen" />
</template>
