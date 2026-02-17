<script setup lang="ts">
import UiGitHubStars from "@ui/components/UiGitHubStars.vue"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiLogo from "@ui/components/UiLogo.vue"
import UiSearchTrigger from "@ui/components/UiSearchTrigger.vue"
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-white/5 bg-(--ui-bg)/75 backdrop-blur-md">
    <div class="container flex h-18 items-center justify-between">
      <UiLogo />
      <UiSearchTrigger />

      <div class="flex items-center gap-2">
        <UiGitHubStars />
        <UiLanguageSwitcher />
      </div>
    </div>
  </header>
</template>
