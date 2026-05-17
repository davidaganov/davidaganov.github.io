<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <a
    href="#main-content"
    tabindex="0"
    class="app-skip-link rounded-lg bg-white px-4 py-2.5 text-sm font-semibold shadow-lg dark:bg-neutral-950 dark:text-white"
    v-bind="$attrs"
  >
    <slot>{{ $t("layout.a11y.skipToContent") }}</slot>
  </a>
</template>

<style scoped>
.app-skip-link {
  position: absolute;
  inset-inline-start: -9999px;
  top: auto;
  z-index: 100;
}

.app-skip-link:focus,
.app-skip-link:focus-visible {
  position: fixed;
  inset-inline-start: 14px;
  top: 14px;
  z-index: 99999;
}
</style>
