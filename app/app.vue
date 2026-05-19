<script setup lang="ts">
import { absoluteUrl, canonicalPathForLocale, normalizeDefaultLocalePath } from "@app/utils/seo"
import { GITHUB_LINK, HABR_LINK, SOCIAL_LINKS } from "@base/constants"
import AppSkipLink from "@base/components/app/AppSkipLink.vue"
import UiCommandPalette from "@ui/components/UiCommandPalette.vue"

const { locale, t } = useI18n()

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const colorMode = useColorMode()

const switchLocalePath = useSwitchLocalePath()

const siteUrl = computed(() => {
  const value = String(runtimeConfig.public.siteUrl || "").trim()
  return value.endsWith("/") ? value.slice(0, -1) : value
})

const canonicalPath = computed(() => {
  const path = route.path || "/"
  return canonicalPathForLocale(locale.value, path)
})

const canonicalUrl = computed(() => `${siteUrl.value}${canonicalPath.value}`)
const ruUrl = computed(
  () => `${siteUrl.value}${normalizeDefaultLocalePath(switchLocalePath("ru") || "/")}`
)
const enUrl = computed(() => `${siteUrl.value}${switchLocalePath("en") || "/en"}`)

useSchemaOrg([
  defineWebSite({
    "@id": () => `${siteUrl.value}/#website`,
    name: "Aganov.dev",
    url: () => absoluteUrl(siteUrl.value, "/")
  }),
  definePerson({
    "@id": () => `${siteUrl.value}/#person`,
    name: () => t("global.name"),
    url: () => absoluteUrl(siteUrl.value, "/"),
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
  link: [
    { rel: "canonical", href: canonicalUrl },
    { rel: "alternate", hreflang: "ru", href: ruUrl },
    { rel: "alternate", hreflang: "en", href: enUrl },
    { rel: "alternate", hreflang: "x-default", href: ruUrl }
  ],
  htmlAttrs: {
    lang: computed(() =>
      locale.value === "ru" ? "ru" : locale.value === "en" ? "en" : locale.value
    ),
    class: () => (colorMode.value === "dark" ? "dark" : "")
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
