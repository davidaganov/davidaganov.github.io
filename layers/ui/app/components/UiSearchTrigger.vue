<script setup lang="ts">
const { toggle } = useCommandPalette()
</script>

<template>
  <button
    class="text-muted flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs transition-colors hover:border-white/10 hover:bg-white/10"
    @click="toggle"
  >
    <UIcon
      name="i-lucide-search"
      class="h-4 w-4"
    />
    <span>{{ $t("layout.search") }}</span>
    <kbd class="hidden rounded bg-black/20 px-1 font-mono text-[10px] sm:inline-block">Ctrl K</kbd>
  </button>
</template>
