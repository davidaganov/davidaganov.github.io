<script setup lang="ts">
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiLogo from "@ui/components/UiLogo.vue"
import UiSearchTrigger from "@ui/components/UiSearchTrigger.vue"
</script>

<template>
  <header>
    <div class="container flex h-14 items-center justify-between">
      <UiLogo />
      <UiSearchTrigger />

      <div class="flex items-center gap-2">
        <UiLanguageSwitcher />
      </div>
    </div>
  </header>
</template>
