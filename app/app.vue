<script setup lang="ts">
import { computed } from "vue"
import AppCookieBanner from "@base/components/app/AppCookieBanner.vue"
import UiCommandPalette from "@ui/components/UiCommandPalette.vue"

const { locale, t } = useI18n()

const route = useRoute()
const switchLocalePath = useSwitchLocalePath()
const runtimeConfig = useRuntimeConfig()
const colorMode = useColorMode()

const siteUrl = computed(() => {
  const value = String(runtimeConfig.public.siteUrl || "").trim()
  return value.endsWith("/") ? value.slice(0, -1) : value
})

const canonicalUrl = computed(() => `${siteUrl.value}${route.path || "/"}`)
const ruUrl = computed(() => `${siteUrl.value}${switchLocalePath("ru") || "/ru"}`)
const enUrl = computed(() => `${siteUrl.value}${switchLocalePath("en") || "/en"}`)

const websiteJsonLd = computed(() =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aganov.dev",
    url: siteUrl.value,
    inLanguage: locale.value === "ru" ? "ru-RU" : "en-US"
  })
)

const personJsonLd = computed(() =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: t("global.name"),
    url: siteUrl.value,
    sameAs: ["https://github.com/davidaganov", "https://www.npmjs.com/~davidaganov"]
  })
)

useHead({
  titleTemplate: (title?: string) => {
    if (!title) return t("global.name")
    return `${title} — ${t("global.name")}`
  },
  link: [
    { rel: "canonical", href: canonicalUrl },
    { rel: "alternate", hreflang: "ru", href: ruUrl },
    { rel: "alternate", hreflang: "en", href: enUrl },
    { rel: "alternate", hreflang: "x-default", href: ruUrl }
  ],
  htmlAttrs: {
    class: () => (colorMode.value === "dark" ? "dark" : "")
  },
  script: [
    {
      key: "ld-website",
      type: "application/ld+json",
      innerHTML: websiteJsonLd
    },
    {
      key: "ld-person",
      type: "application/ld+json",
      innerHTML: personJsonLd
    }
  ]
})

useSeoMeta({
  ogSiteName: "Aganov.dev",
  ogType: "website",
  twitterCard: "summary_large_image",
  ogUrl: () => canonicalUrl.value,
  ogImage: () => `${siteUrl.value}/android-chrome-512x512.png`,
  twitterImage: () => `${siteUrl.value}/android-chrome-512x512.png`
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
      <UiCommandPalette />
    </NuxtLayout>
    <AppCookieBanner />
  </UApp>
</template>
