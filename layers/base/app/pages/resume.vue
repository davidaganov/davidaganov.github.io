<script setup lang="ts">
import { useSiteI18nHead } from "@app/composables/useSiteI18nHead"
import { useResumeData } from "@base/composables/useResumeData"
import ResumePage from "@base/components/pages/resume/ResumePage.vue"

const { t, locale } = useI18n()
const { siteUrl, canonicalUrl } = useSiteI18nHead()
const { content } = useResumeData()

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
  ogUrl: () => canonicalUrl.value,
  ogType: "profile",
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterCard: "summary_large_image",
  robots: "index, follow"
})

defineOgImage("ResumePage", {
  title: seoTitle.value,
  description: seoDescription.value,
  role: content.value.role
})

useSchemaOrg([
  defineWebPage({
    "@type": "ProfilePage",
    name: () => seoTitle.value,
    description: () => seoDescription.value,
    url: () => canonicalUrl.value,
    inLanguage: locale.value === "ru" ? "ru-RU" : "en-US",
    mainEntity: { "@id": `${siteUrl.value}/#person` }
  })
])
</script>

<template>
  <div class="min-h-dvh bg-white text-gray-900 dark:bg-[#060a15] dark:text-gray-100">
    <ResumePage />
  </div>
</template>
