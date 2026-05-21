<script setup lang="ts">
import { ROUTE_PATH } from "@base/types"

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
    url?: string
  }
  isDocsContext: boolean
  docsFallbackPath: string
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const error = ref(props.error)

const isNotFound = computed(() => props.error.statusCode === 404)

const title = computed(() =>
  isNotFound.value ? t("pages.error.notFoundTitle") : t("pages.error.genericTitle")
)

const description = computed(() =>
  isNotFound.value ? t("pages.error.notFoundDescription") : t("pages.error.genericDescription")
)

const homePath = computed(() => localePath(ROUTE_PATH.HOME))

const useLeaveErrorPage = () => {
  const nuxtApp = useNuxtApp()
  const error = useError()

  const leave = async (path: string) => {
    error.value = undefined
    nuxtApp.payload.error = undefined
    await clearError()
    await navigateTo(path, { replace: true })
  }

  return { leave }
}

const goHome = () => useLeaveErrorPage().leave(homePath.value)
const goDocs = () => useLeaveErrorPage().leave(props.docsFallbackPath)
</script>

<template>
  <div
    class="flex h-full min-h-dvh flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-24"
  >
    <p
      class="text-primary-600 dark:text-primary-400 text-7xl font-bold tracking-tighter tabular-nums sm:text-8xl"
      aria-hidden="true"
    >
      {{ error.statusCode }}
    </p>

    <h1
      class="mt-4 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl dark:text-white"
    >
      {{ title }}
    </h1>

    <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
      {{ description }}
    </p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <UButton
        v-if="isDocsContext"
        size="lg"
        color="primary"
        variant="solid"
        icon="i-lucide-book-open"
        :label="t('pages.error.backDocs')"
        @click="goDocs"
      />
      <UButton
        size="lg"
        icon="i-lucide-home"
        :color="isDocsContext ? 'neutral' : 'primary'"
        :variant="isDocsContext ? 'outline' : 'solid'"
        :label="t('pages.error.backHome')"
        @click="goHome"
      />
    </div>
  </div>
</template>
