import type { DocsSeoOptions } from "@docs/types/docs"
import { TYPE_PAGE } from "@docs/types/enums"

export const useDocsSeo = ({
  section,
  collectionItem,
  parentCollectionItem,
  page
}: DocsSeoOptions) => {
  const { locale, t } = useI18n()
  const route = useRoute()
  const requestUrl = useRequestURL()
  const localePath = useLocalePath()
  const runtimeConfig = useRuntimeConfig()

  const getString = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined
    return value.trim().length ? value : undefined
  }

  const pageMeta = computed<Record<string, unknown>>(() => {
    const p = page.value as { seo?: Record<string, unknown> } | null | undefined
    return p?.seo ?? {}
  })

  const seoTitle = computed<string | undefined>(() => {
    const fromSeo = getString(pageMeta.value.title)
    if (fromSeo) return fromSeo

    const fromPageTitle = getString((page.value as { title?: unknown } | null | undefined)?.title)

    if (fromPageTitle) return fromPageTitle
    if (collectionItem.value?.titleKey) return t(collectionItem.value.titleKey)
    if (section.value) return t(section.value.labelKey)

    return undefined
  })

  const seoDescription = computed<string | undefined>(() => {
    const fromSeo = getString(pageMeta.value.description)
    if (fromSeo) return fromSeo

    const fromPageDescription = getString(
      (page.value as { description?: unknown } | null | undefined)?.description
    )

    if (fromPageDescription) return fromPageDescription
    if (collectionItem.value?.subtitleKey) return t(collectionItem.value.subtitleKey)

    return undefined
  })

  const siteUrl = computed(() => {
    const value = String(runtimeConfig.public.siteUrl || "").trim()
    const requestOrigin = String(requestUrl.origin || "").trim()

    if (import.meta.dev && requestOrigin) {
      return requestOrigin.endsWith("/") ? requestOrigin.slice(0, -1) : requestOrigin
    }

    const normalized = value || requestOrigin || "https://aganov.dev"
    return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized
  })

  const canonicalUrl = computed(() => `${siteUrl.value}${route.path || "/"}`)

  const breadcrumbs = computed(() => {
    const currentSection = section.value
    if (!currentSection) return []

    const items: { label: string; to?: string }[] = [
      {
        label: t(currentSection.labelKey),
        to: localePath(`/docs/${currentSection.id}`)
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

  const generatedOgImagePath = computed(() => {
    const pagePath = route.path || "/"
    const normalizedPagePath = pagePath.startsWith("/") ? pagePath : `/${pagePath}`
    const mode = import.meta.prerender ? "static" : "image"

    return `/__og-image__/${mode}${normalizedPagePath}/og.png`
  })

  const generatedOgImageUrl = computed(() => `${siteUrl.value}${generatedOgImagePath.value}`)

  const seoImageOverride = computed(() => {
    return getString(pageMeta.value.ogImage) || getString(pageMeta.value.image)
  })

  const seoImage = computed(() => {
    if (seoImageOverride.value) return seoImageOverride.value
    return generatedOgImageUrl.value
  })

  const ogSectionLabel = computed(() => {
    if (section.value) return t(section.value.labelKey)
    return locale.value === "ru" ? "Документация" : "Documentation"
  })

  const ogCollectionLabel = computed(() => {
    if (parentCollectionItem.value) return t(parentCollectionItem.value.label)
    if (collectionItem.value) return t(collectionItem.value.label)
    return ""
  })

  if (seoImageOverride.value) {
    defineOgImage({
      url: seoImageOverride.value,
      alt: seoTitle.value || undefined
    })
  } else {
    defineOgImageComponent("DocsPage", {
      title:
        seoTitle.value ||
        (locale.value === "ru" ? "Документация и заметки" : "Documentation and notes"),
      description:
        seoDescription.value ||
        (locale.value === "ru"
          ? "Практические материалы, заметки и инструменты из моего портфолио."
          : "Practical notes, guides, and tools from my portfolio."),
      section: ogSectionLabel.value,
      collection: ogCollectionLabel.value
    })
  }

  const pageRightSidebarType = computed(() => {
    const pt = parentCollectionItem.value?.pageType
    if (pt === TYPE_PAGE.PROJECT) return TYPE_PAGE.PROJECT
    return TYPE_PAGE.ARTICLE
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

  return {
    breadcrumbs,
    seoTitle,
    seoDescription
  }
}
