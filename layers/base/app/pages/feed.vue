<script setup lang="ts">
import { resolveOgImageFields } from "@app/utils/rss"
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

const feedOgFields = computed(() =>
  resolveOgImageFields({
    component: "FeedPage",
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
  ogType: "website",
  robots: "index, follow"
})

defineOgImage("FeedPage", {
  title: feedOgFields.value.title,
  description: feedOgFields.value.description
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
