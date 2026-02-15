<script setup lang="ts">
const { isOpen } = useCommandPalette()
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isOpen"
      :title="$t('commandPalette.title')"
      :description="$t('commandPalette.description')"
      :close="false"
      :ui="{
        overlay: 'bg-black/80 backdrop-blur-sm',
        content: 'bg-transparent shadow-none',
        header: 'sr-only',
        title: 'sr-only',
        description: 'sr-only'
      }"
      class="max-w-2xl"
    >
      <span class="hidden" />

      <template #content>
        <div
          class="overflow-hidden rounded-xl border border-white/10 bg-black/90 shadow-2xl shadow-purple-500/10"
        >
          <!-- Search Input -->
          <div class="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <UIcon
              name="i-lucide-search"
              class="h-5 w-5 text-gray-400"
            />
            <UInput
              type="text"
              variant="none"
              class="flex-1"
              :placeholder="$t('commandPalette.placeholder')"
              :ui="{
                base: 'bg-transparent text-white placeholder:text-gray-500 focus:outline-none'
              }"
            />
            <kbd class="rounded border border-white/20 bg-white/5 px-2 py-1 text-xs text-gray-400">
              ESC
            </kbd>
          </div>

          <!-- Content Area -->
          <div class="flex min-h-[200px] items-center justify-center p-4">
            <div class="flex h-full flex-col items-center justify-center gap-2 text-gray-500">
              <UIcon
                name="i-lucide-command"
                class="h-8 w-8"
              />
              <p class="text-sm">
                {{ $t("commandPalette.empty") }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between border-t border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-400"
          >
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <kbd class="rounded border border-white/20 bg-white/5 px-1.5 py-0.5">↑</kbd>
                <kbd class="rounded border border-white/20 bg-white/5 px-1.5 py-0.5">↓</kbd>
                <span class="ml-1">{{ $t("commandPalette.navigate") }}</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd class="rounded border border-white/20 bg-white/5 px-1.5 py-0.5">↵</kbd>
                <span class="ml-1">{{ $t("commandPalette.select") }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
