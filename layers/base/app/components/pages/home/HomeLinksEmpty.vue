<script setup lang="ts">
import { DOCS_SECTIONS } from "@docs/config/sections"
import { getFirstPathForSection } from "@docs/utils/sections"

const localePath = useLocalePath()

const aboutSection = computed(() => DOCS_SECTIONS.find((section) => section.id === "about"))
const aboutEntryPath = computed(() => getFirstPathForSection(aboutSection.value))
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
        {{ $t("home.links.empty.title") }}
      </h3>
      <p class="max-w-md text-sm text-gray-400">
        {{ $t("home.links.empty.description") }}
      </p>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-3">
      <UButton
        variant="soft"
        color="primary"
        icon="i-lucide-book-open"
        :to="localePath(aboutEntryPath)"
        :label="$t('home.links.empty.cta')"
      />
    </div>
  </div>
</template>
