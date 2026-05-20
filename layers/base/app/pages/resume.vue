<script setup lang="ts">
import { useSiteI18nHead } from "@app/composables/useSiteI18nHead"
import ResumePage from "@base/components/pages/resume/ResumePage.vue"

const { t } = useI18n()
const { canonicalUrl } = useSiteI18nHead()

definePageMeta({
  layout: "clean",
  pageTransition: false,
  layoutTransition: false
})

const seoTitle = computed(() => t("pages.resume.seoTitle"))
const seoDescription = computed(() => t("pages.resume.seoDescription"))

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterCard: "summary",
  robots: "index, follow",
  ogUrl: () => canonicalUrl.value
})
</script>

<template>
  <div class="min-h-dvh bg-white text-gray-900 dark:bg-[#060a15] dark:text-gray-100">
    <ResumePage />
  </div>
</template>
