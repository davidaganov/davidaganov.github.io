<script setup lang="ts">
const { toggle } = useCommandPalette()
</script>

<template>
  <UButton
    size="sm"
    variant="ghost"
    type="button"
    class="h-8 justify-start px-2.5 py-0 hover:bg-white/10 sm:w-full sm:max-w-3xs"
    :ui="{
      base: 'bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-gray-900 dark:text-white'
    }"
    :aria-label="$t('layout.a11y.openSearchPalette')"
    @click="toggle"
  >
    <div class="flex items-center gap-2">
      <UIcon
        name="i-lucide-search"
        class="size-4 shrink-0"
        aria-hidden="true"
      />
      <span class="hidden text-xs sm:inline">{{ $t("global.actions.search") }}</span>
    </div>
    <kbd
      aria-hidden="true"
      class="ml-auto hidden rounded bg-black/20 px-1 font-mono text-[10px] sm:inline-block dark:bg-white/10"
    >
      Ctrl K
    </kbd>
  </UButton>
</template>
