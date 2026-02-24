<script setup lang="ts">
import type { Collections } from "@nuxt/content"
import AppIndexPage from "@docs/components/app/AppIndexPage.vue"
import AppRightSidebar from "@docs/components/app/AppRightSidebar.vue"
import { TYPE_PAGE } from "@docs/types/enums"
import type { SidebarCollectionItem } from "@docs/types/sidebar"
import { getQueryPrefix, getRelativePath } from "@docs/utils/content"
import {
  getFirstPathForFirstSection,
  getFirstPathForSection,
  getSectionById
} from "@docs/utils/sections"

const { locale, t } = useI18n()

const route = useRoute()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()

const sectionParam = computed(() => String(route.params.section || ""))

const slugParam = computed(() => {
  const value = route.params.slug
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  if (!value) return []
  return [String(value)]
})

const section = computed(() => getSectionById(sectionParam.value))
const collection = computed(() => `content_${locale.value}` as keyof Collections)

if (!section.value) {
  await navigateTo(localePath(getFirstPathForFirstSection()), { replace: true })
}

if (!slugParam.value.length) {
  await navigateTo(localePath(getFirstPathForSection(section.value)), { replace: true })
}

const docsPath = computed(() => `/docs/${sectionParam.value}/${slugParam.value.join("/")}`)

const collectionItem = computed<SidebarCollectionItem | undefined>(() => {
  if (slugParam.value.length !== 1) return undefined
  const topLevelSlug = slugParam.value[0] || ""
  const items = section.value?.sidebarItems || []
  return items.find(
    (item): item is SidebarCollectionItem =>
      item.type === "collection" && item.source === topLevelSlug
  )
})

const getCollectionPathPrefix = (source: string): string => `/docs/${sectionParam.value}/${source}`

const getFirstChildPath = async (pathPrefix: string): Promise<string | undefined> => {
  const queryPrefix = getQueryPrefix(pathPrefix)

  const pages = await queryCollection(collection.value)
    .where("path", "LIKE", `%${queryPrefix}%`)
    .select("path")
    .all()

  const first = pages.find((page) => typeof page.path === "string")
  if (!first?.path) return undefined

  const relativePath = getRelativePath(String(first.path), queryPrefix)
  return `${pathPrefix}${relativePath}`
}

if (collectionItem.value?.indexPage === false) {
  const pathPrefix = getCollectionPathPrefix(collectionItem.value.source)
  const firstChildPath = await getFirstChildPath(pathPrefix)

  if (firstChildPath) {
    await navigateTo(localePath(firstChildPath), { replace: true })
  }
}

const getString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined
  return value.trim().length ? value : undefined
}

const { data: page } = await usePageContent(docsPath.value)

const pageMeta = computed<Record<string, unknown>>(() => {
  const p = page.value as { seo?: Record<string, unknown> } | null | undefined
  return p?.seo ?? {}
})

const seoTitle = computed<string | undefined>(() => {
  const fromSeo = getString(pageMeta.value.title)
  if (fromSeo) return fromSeo

  const fromPageTitle = getString((page.value as { title?: unknown } | null | undefined)?.title)
  if (fromPageTitle) return fromPageTitle

  if (collectionItem.value?.titleKey) {
    return t(collectionItem.value.titleKey)
  }

  if (section.value) {
    return t(section.value.labelKey)
  }

  return undefined
})

const siteUrl = computed(() => {
  const value = String(runtimeConfig.public.siteUrl || "").trim()
  const normalized = value || "https://aganov.dev"
  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized
})

const canonicalUrl = computed(() => `${siteUrl.value}${route.path || "/"}`)

const generatedOgImageUrl = computed(() => {
  const encodedSegments = [sectionParam.value, ...slugParam.value]
    .map((item) => encodeURIComponent(String(item || "").trim()))
    .filter(Boolean)

  const path = encodedSegments.join("/")
  const title = encodeURIComponent(seoTitle.value || "")
  const description = encodeURIComponent(seoDescription.value || "")

  return `${siteUrl.value}/og/${encodeURIComponent(locale.value)}/${path}.png?title=${title}&description=${description}`
})

const seoImage = computed(() => {
  const fromSeo = getString(pageMeta.value.ogImage) || getString(pageMeta.value.image)
  if (fromSeo) return fromSeo
  return generatedOgImageUrl.value
})

const seoDescription = computed<string | undefined>(() => {
  const fromSeo = getString(pageMeta.value.description)
  if (fromSeo) return fromSeo

  const fromPageDescription = getString(
    (page.value as { description?: unknown } | null | undefined)?.description
  )
  if (fromPageDescription) return fromPageDescription

  if (collectionItem.value?.subtitleKey) {
    return t(collectionItem.value.subtitleKey)
  }

  return undefined
})

const titleKey = computed(() => collectionItem.value?.titleKey)
const subtitleKey = computed(() => collectionItem.value?.subtitleKey)
const emptyKey = computed(() => collectionItem.value?.emptyKey)

const parentCollectionItem = computed<SidebarCollectionItem | undefined>(() => {
  const topLevelSlug = slugParam.value[0] || ""
  if (!topLevelSlug) return undefined
  const items = section.value?.sidebarItems || []
  return items.find(
    (item): item is SidebarCollectionItem =>
      item.type === "collection" && item.source === topLevelSlug
  )
})

const resolvePageType = (pt: string | undefined): TYPE_PAGE => {
  if (pt === TYPE_PAGE.PROJECT) return TYPE_PAGE.PROJECT
  return TYPE_PAGE.ARTICLE
}

const rightSidebarType = computed(() => resolvePageType(collectionItem.value?.pageType))
const pageRightSidebarType = computed(() => resolvePageType(parentCollectionItem.value?.pageType))

const breadcrumbs = computed(() => {
  const currentSection = section.value
  if (!currentSection) return []

  const items: { label: string; to?: string }[] = [
    {
      label: t(currentSection.labelKey),
      to: localePath(getFirstPathForSection(currentSection))
    }
  ]

  const parentCollection = parentCollectionItem.value
  if (parentCollection) {
    items.push({
      label: t(parentCollection.label),
      to: localePath(
        parentCollection.pathPrefix || `/docs/${currentSection.id}/${parentCollection.source}`
      )
    })
  }

  return items
})

const structuredDataJson = computed<string | undefined>(() => {
  const pageTitle = seoTitle.value
  if (!pageTitle) return undefined

  const pageDescription = seoDescription.value
  const language = locale.value === "ru" ? "ru-RU" : "en-US"
  const meta = (page.value as { meta?: Record<string, unknown> } | null | undefined)?.meta || {}

  const breadcrumbItemList = [
    ...breadcrumbs.value,
    {
      label: pageTitle,
      to: route.path
    }
  ].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: `${siteUrl.value}${item.to || route.path || "/"}`
  }))

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItemList
  }

  const basePageSchema = {
    "@context": "https://schema.org",
    "@type": collectionItem.value ? "CollectionPage" : "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl.value,
    inLanguage: language
  }

  if (collectionItem.value) {
    return JSON.stringify([basePageSchema, breadcrumbSchema])
  }

  if (pageRightSidebarType.value === TYPE_PAGE.PROJECT) {
    const projectSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: pageTitle,
      description: pageDescription,
      url: canonicalUrl.value,
      codeRepository: getString(meta.githubUrl),
      inLanguage: language
    }

    return JSON.stringify([projectSchema, breadcrumbSchema])
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: pageDescription,
    url: canonicalUrl.value,
    image: seoImage.value,
    datePublished: getString(meta.publishedAt),
    inLanguage: language,
    author: {
      "@type": "Person",
      name: locale.value === "ru" ? "Давид Аганов" : "David Aganov"
    }
  }

  return JSON.stringify([articleSchema, breadcrumbSchema])
})

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogUrl: () => canonicalUrl.value,
  ogImage: () => seoImage.value,
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => seoImage.value,
  twitterCard: "summary_large_image"
})

useHead({
  script: [
    {
      key: "ld-docs-page",
      type: "application/ld+json",
      innerHTML: structuredDataJson
    }
  ]
})
</script>

<template>
  <div v-if="collectionItem">
    <UBreadcrumb
      v-if="breadcrumbs.length"
      class="mb-6"
      :items="breadcrumbs"
    />
    <AppIndexPage
      :title-key="titleKey"
      :subtitle-key="subtitleKey"
      :empty-key="emptyKey"
      :path-prefix="getCollectionPathPrefix(collectionItem.source)"
      :show-source-tabs="collectionItem.showSourceTabs ?? false"
    />
    <AppRightSidebar
      :main="true"
      :type="rightSidebarType"
    />
  </div>
  <div v-else-if="page">
    <UBreadcrumb
      v-if="breadcrumbs.length"
      class="mb-6"
      :items="breadcrumbs"
    />
    <ContentRenderer :value="page" />
    <AppRightSidebar
      :page="page"
      :type="pageRightSidebarType"
    />
  </div>
</template>
