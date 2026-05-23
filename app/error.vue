<script setup lang="ts">
import { DEFAULT_LOCALE, normalizeUrlPath } from "@app/utils/seo"
import {
  getFirstPathForFirstSection,
  getFirstPathForSection,
  getSectionById,
  getSectionIdByPath
} from "@docs/utils/sections"
import { isSiteLocaleCode } from "@app/constants/siteLocaleCodes"
import ErrorPage from "@base/components/pages/error/ErrorPage.vue"

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
    url?: string
  }
}>()

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

const errorPath = computed(() => {
  const url = props.error.url
  if (!url) return route.path

  try {
    return new URL(url, "http://localhost").pathname
  } catch {
    return route.path
  }
})

const stripLocalePathPrefix = (path: string): string => {
  const normalized = normalizeUrlPath(path.split("?")[0] ?? path)
  const segments = normalized.split("/").filter(Boolean)
  const first = segments[0]

  if (first && isSiteLocaleCode(first) && first !== DEFAULT_LOCALE) {
    return `/${segments.slice(1).join("/")}`
  }

  return normalized
}

const isDocsErrorPath = (path: string): boolean => {
  const stripped = stripLocalePathPrefix(path)
  return stripped === "/docs" || stripped.startsWith("/docs/")
}

const isDocsContext = computed(() => isDocsErrorPath(errorPath.value))

const docsFallbackPath = computed(() => {
  const sectionId = getSectionIdByPath(errorPath.value)
  const section = getSectionById(sectionId)
  const path = section ? getFirstPathForSection(section) : getFirstPathForFirstSection()
  return localePath(path)
})

setPageLayout(isDocsContext.value ? "default" : "clean")

watch(isDocsContext, (docs) => {
  setPageLayout(docs ? "default" : "clean")
})

const seoTitle = computed(() =>
  props.error.statusCode === 404 ? t("pages.error.notFoundTitle") : t("pages.error.genericTitle")
)

useSeoMeta({
  title: () => seoTitle.value,
  robots: "noindex, nofollow"
})
</script>

<template>
  <div class="min-h-dvh bg-white text-gray-900 dark:bg-[#060a15] dark:text-gray-100">
    <ErrorPage
      :error="error"
      :docs-fallback-path="docsFallbackPath"
      :is-docs-context="isDocsContext"
    />
  </div>
</template>
