<script setup lang="ts">
const { localizedPath: aboutEntryPath } = useDocsSectionEntryPath("about")
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-6 rounded-xl border border-black/10 bg-black/3 p-8 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/5"
  >
    <div
      class="flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-black/5 dark:border-white/10 dark:bg-black/30"
    >
      <UIcon
        name="i-lucide-inbox"
        class="size-8 text-gray-400"
      />
    </div>

    <div class="space-y-2">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        {{ $t("pages.home.fallback.title") }}
      </h3>
      <p class="max-w-md text-sm text-gray-500 dark:text-gray-400">
        {{ $t("pages.home.fallback.description") }}
      </p>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-3">
      <UButton
        variant="soft"
        color="primary"
        icon="i-lucide-book-open"
        :to="aboutEntryPath"
        :label="$t('pages.home.fallback.cta')"
      />
    </div>
  </div>
</template>
