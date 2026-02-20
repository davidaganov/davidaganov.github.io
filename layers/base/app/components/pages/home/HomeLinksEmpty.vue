<script setup lang="ts">
const { localizedPath: aboutEntryPath } = useDocsSectionEntryPath("about")
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-6 rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md"
  >
    <div
      class="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/30"
    >
      <UIcon
        name="i-lucide-inbox"
        class="size-8 text-gray-400"
      />
    </div>

    <div class="space-y-2">
      <h3 class="text-lg font-medium text-white">
        {{ $t("home.emptyTitle") }}
      </h3>
      <p class="max-w-md text-sm text-gray-400">
        {{ $t("home.emptyDesc") }}
      </p>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-3">
      <UButton
        variant="soft"
        color="primary"
        icon="i-lucide-book-open"
        :to="aboutEntryPath"
        :label="$t('home.emptyCta')"
      />
    </div>
  </div>
</template>
