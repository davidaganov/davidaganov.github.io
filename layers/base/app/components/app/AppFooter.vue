<script setup lang="ts">
import { ROUTE_PATH } from "@base/types/enums/route.enum"
import UiDivider from "@ui/components/UiDivider.vue"
import UiLogo from "@ui/components/UiLogo.vue"

const localePath = useLocalePath()
const { t } = useI18n()

const year = computed(() => new Date().getFullYear())

const docLinks = computed(() => [
  { label: t("footer.links.gettingStarted"), to: ROUTE_PATH.GETTING_STARTED },
  { label: t("footer.links.about"), to: ROUTE_PATH.ABOUT }
])
</script>

<template>
  <footer class="w-full">
    <div class="relative">
      <div class="absolute mx-auto flex justify-center left-0 right-0 -translate-y-1/2 z-1">
        <UiLogo />
      </div>

      <UiDivider />
    </div>

    <div class="mx-auto w-full max-w-6xl relative px-6 py-16">
      <div class="flex gap-16 flex-col md:flex-row">
        <div>
          <div class="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {{ $t("footer.sections.docs") }}
          </div>
          <nav class="mt-4 space-y-2">
            <NuxtLink
              v-for="item in docLinks"
              class="block text-sm text-gray-400 transition-colors hover:text-white"
              :to="localePath(item.to)"
              :key="item.to"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>

    <div class="relative">
      <UiDivider />
    </div>

    <div class="mx-auto w-full max-w-6xl relative px-6 my-6">
      <div
        class="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>© {{ year }} David Aganov</div>

        <a
          class="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
          href="https://github.com/davidaganov/davidaganov.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <UIcon
            name="i-lucide-github"
            class="size-4 opacity-80 transition-opacity group-hover:opacity-100"
          />
          <span>{{ $t("footer.links.repository") }}</span>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-4 opacity-60"
          />
        </a>
      </div>
    </div>
  </footer>
</template>
