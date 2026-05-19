<script setup lang="ts">
import { useSiteI18nHead } from "@app/composables/useSiteI18nHead"
import { absoluteUrl } from "@app/utils/seo"
import { GITHUB_LINK, HABR_LINK, SOCIAL_LINKS } from "@base/constants"
import AppSkipLink from "@base/components/app/AppSkipLink.vue"
import UiCommandPalette from "@ui/components/UiCommandPalette.vue"
import { ROUTE_PATH } from "@base/types"

const { t } = useI18n()
const { siteUrl, canonicalUrl, i18nHeadLinks, htmlLang } = useSiteI18nHead()

useSchemaOrg([
  defineWebSite({
    "@id": () => `${siteUrl.value}/#website`,
    name: "Aganov.dev",
    url: () => absoluteUrl(siteUrl.value, ROUTE_PATH.HOME)
  }),
  definePerson({
    "@id": () => `${siteUrl.value}/#person`,
    name: () => t("global.name"),
    url: () => absoluteUrl(siteUrl.value, ROUTE_PATH.HOME),
    jobTitle: "Frontend Developer",
    email: "mailto:davidaganov21@gmail.com",
    knowsAbout: ["Vue", "Nuxt", "TypeScript", "Tailwind CSS", "Frontend Architecture"],
    sameAs: [
      GITHUB_LINK,
      HABR_LINK,
      "https://www.npmjs.com/~davidaganov",
      ...SOCIAL_LINKS.map((link) => link.href).filter((href) => href.startsWith("https://"))
    ]
  })
])

useHead({
  titleTemplate: (title?: string) => {
    if (!title) return t("global.name")
    return `${title} — ${t("global.name")}`
  },
  link: i18nHeadLinks,
  htmlAttrs: {
    lang: htmlLang
  }
})

useSeoMeta({
  ogSiteName: "Aganov.dev",
  ogType: "website",
  twitterCard: "summary_large_image",
  ogUrl: () => canonicalUrl.value,
  ogImage: () => `${siteUrl.value}/favicons/android-chrome-512x512.png`,
  twitterImage: () => `${siteUrl.value}/favicons/android-chrome-512x512.png`
})
</script>

<template>
  <UApp>
    <AppSkipLink />
    <NuxtLayout>
      <NuxtPage />
      <UiCommandPalette />
    </NuxtLayout>
  </UApp>
</template>
