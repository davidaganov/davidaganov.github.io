<script setup lang="ts">
import { computed } from "vue"
import { LOCALE } from "@base/types/enums"

const props = defineProps<{
  page: any
}>()

const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const languageOriginal = computed(() => {
  return props.page?.languageOriginal || props.page?.meta?.languageOriginal
})

const shouldShow = computed(() => {
  return languageOriginal.value && languageOriginal.value !== locale.value
})

const originalLangName = computed(() => {
  switch (languageOriginal.value) {
    case LOCALE.RU:
      return t("pages.articles.languages.ru")
    case LOCALE.EN:
      return t("pages.articles.languages.en")
    default:
      return languageOriginal.value
  }
})

const switchToOriginalPath = computed(() => {
  if (!languageOriginal.value) return null
  return switchLocalePath(languageOriginal.value)
})
</script>

<template>
  <ClientOnly>
    <div
      v-if="shouldShow"
      class="relative mb-8 overflow-hidden"
    >
      <div class="relative flex flex-wrap items-center gap-x-4 gap-y-3 p-2">
        <div
          class="flex shrink-0 items-center justify-center rounded-full bg-amber-100 p-3 text-amber-600 ring-4 ring-amber-50 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500/10"
        >
          <UIcon
            name="i-lucide-languages"
            class="size-6"
          />
        </div>

        <div class="min-w-0 flex-1">
          <h3 class="text-base font-semibold text-amber-900 dark:text-amber-300">
            {{ $t("pages.articles.translationWarning.title") }}
          </h3>
          <p class="mt-1 text-sm leading-relaxed text-amber-800/80 dark:text-amber-200/70">
            {{ $t("pages.articles.translationWarning.description", { lang: originalLangName }) }}
          </p>
        </div>

        <NuxtLink
          v-if="switchToOriginalPath"
          class="group flex w-full items-center justify-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-100/60 px-3 py-1.5 text-xs font-medium text-amber-700 transition-all hover:border-amber-400 hover:bg-amber-200/60 md:ml-auto md:w-auto md:justify-start dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:border-amber-400/50 dark:hover:bg-amber-500/20"
          :to="switchToOriginalPath"
        >
          {{ $t("pages.articles.translationWarning.readOriginal") }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </NuxtLink>
      </div>
    </div>
  </ClientOnly>
</template>
