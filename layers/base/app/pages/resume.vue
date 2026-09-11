<script setup lang="ts">
import { resolveOgImageFields } from "@app/utils/rss"
import { useSiteI18nHead } from "@app/composables/useSiteI18nHead"
import { useResumeData } from "@base/composables/useResumeData"
import ResumePage from "@base/components/pages/resume/ResumePage.vue"

const { t, locale } = useI18n()
const { siteUrl, canonicalUrl } = useSiteI18nHead()
const { content } = useResumeData()

definePageMeta({
  layout: "standalone",
  pageTransition: false,
  layoutTransition: false
})

const seoTitle = computed(() => t("pages.resume.seoTitle"))
const seoDescription = computed(() => t("pages.resume.seoDescription"))

const resumeOgFields = computed(() =>
  resolveOgImageFields({
    component: "ResumePage",
    title: seoTitle.value,
    description: seoDescription.value
  })
)

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogUrl: () => canonicalUrl.value,
  ogType: "profile",
  robots: "index, follow"
})

defineOgImage("ResumePage", {
  title: resumeOgFields.value.title,
  description: resumeOgFields.value.description,
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
  <ResumePage />
</template>
