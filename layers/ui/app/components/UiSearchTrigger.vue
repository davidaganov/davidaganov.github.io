<script setup lang="ts">
const { toggle } = useCommandPalette()
</script>

<template>
  <UButton
    size="sm"
    variant="ghost"
    class="h-[30px] justify-start py-0 hover:bg-white/10 sm:w-full sm:max-w-3xs"
    :ui="{ base: 'bg-white/10 border border-white/20 text-white' }"
    @click="toggle"
  >
    <div class="flex items-center gap-2">
      <UIcon
        name="i-lucide-search"
        class="size-4"
      />
      <span class="hidden text-xs sm:inline">{{ $t("common.search") }}</span>
    </div>
    <kbd class="ml-auto hidden rounded bg-black/20 px-1 font-mono text-[10px] sm:inline-block">
      Ctrl K
    </kbd>
  </UButton>
</template>
