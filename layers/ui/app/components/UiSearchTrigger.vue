<script setup lang="ts">
const { toggle } = useCommandPalette()
</script>

<template>
  <button
    class="text-muted flex w-full max-w-2xs items-center gap-2 rounded-lg border border-white/5 bg-white/5 py-1.5 pr-3 pl-1.5 text-xs transition-colors hover:border-white/10 hover:bg-white/10"
    @click="toggle"
  >
    <UIcon
      name="i-lucide-search"
      class="size-4"
    />
    <span>{{ $t("layout.search") }}</span>
    <kbd class="ml-auto hidden rounded bg-black/20 px-1 font-mono text-[10px] sm:inline-block">
      Ctrl K
    </kbd>
  </button>
</template>
