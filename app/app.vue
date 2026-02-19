<script setup lang="ts">
import AppCookieBanner from "@base/components/app/AppCookieBanner.vue"
import UiCommandPalette from "@ui/components/UiCommandPalette.vue"
</script>

<template>
  <UApp class="text-white">
    <NuxtLayout>
      <NuxtPage />
      <UiCommandPalette />
    </NuxtLayout>
    <AppCookieBanner />
  </UApp>
</template>
