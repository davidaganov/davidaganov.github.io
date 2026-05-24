<script setup lang="ts">
import { useSiteI18nHead } from "@app/composables/useSiteI18nHead"
import FeedPage from "@base/components/pages/feed/FeedPage.vue"

const { t, locale } = useI18n()
const { siteUrl, canonicalUrl } = useSiteI18nHead()

definePageMeta({
  layout: "standalone",
  pageTransition: false,
  layoutTransition: false
})

const seoTitle = computed(() => t("pages.feed.seoTitle"))
const seoDescription = computed(() => t("pages.feed.seoDescription"))

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogUrl: () => canonicalUrl.value,
  ogType: "website",
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterCard: "summary_large_image",
  robots: "index, follow"
})

defineOgImage("FeedPage", {
  title: seoTitle.value,
  description: seoDescription.value
})

useSchemaOrg([
  defineWebPage({
    "@type": "CollectionPage",
    name: () => seoTitle.value,
    description: () => seoDescription.value,
    url: () => canonicalUrl.value,
    inLanguage: locale.value === "ru" ? "ru-RU" : "en-US",
    isPartOf: { "@id": `${siteUrl.value}/#website` }
  })
])
</script>

<template>
  <FeedPage />
</template>
