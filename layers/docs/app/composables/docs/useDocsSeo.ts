import { canonicalPathForLocale } from "@app/utils/seo"
import { getFirstPathForSection } from "@docs/utils/sections"
import { buildStructuredDataNodes } from "@docs/utils/structuredData"
import { type DocsPageData, type DocsSeoOptions, TYPE_PAGE } from "@docs/types"

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

  const nonEmptyString = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined
    return value.trim().length ? value : undefined
  }

  const trimTrailingSlash = (url: string) => (url.endsWith("/") ? url.slice(0, -1) : url)

  const typedPage = computed<DocsPageData | undefined>(() => {
    return (page.value as DocsPageData) || undefined
  })

  const pageSeo = computed(() => typedPage.value?.seo || {})

  const seoTitle = computed<string | undefined>(() => {
    return (
      nonEmptyString(pageSeo.value.title) ||
      nonEmptyString(typedPage.value?.title) ||
      (collectionItem.value?.titleKey ? t(collectionItem.value.titleKey) : undefined) ||
      (section.value ? t(section.value.labelKey) : undefined)
    )
  })

  const seoDescription = computed<string | undefined>(() => {
    return (
      nonEmptyString(pageSeo.value.description) ||
      nonEmptyString(typedPage.value?.description) ||
      (collectionItem.value?.subtitleKey ? t(collectionItem.value.subtitleKey) : undefined)
    )
  })

  const siteUrl = computed(() => {
    const configured = String(runtimeConfig.public.siteUrl || "").trim()
    const origin = String(requestUrl.origin || "").trim()

    if (import.meta.dev && origin) return trimTrailingSlash(origin)

    return trimTrailingSlash(configured || origin || "https://aganov.dev")
  })

  const canonicalPath = computed(() => {
    const path = route.path || "/"
    return canonicalPathForLocale(locale.value, path)
  })

  const canonicalUrl = computed(() => `${siteUrl.value}${canonicalPath.value}`)

  const breadcrumbs = computed(() => {
    const currentSection = section.value
    if (!currentSection) return []

    const items = [
      {
        label: t(currentSection.labelKey),
        to: localePath(getFirstPathForSection(currentSection))
      }
    ]

    const parent = parentCollectionItem.value
    if (parent) {
      items.push({
        label: t(parent.label),
        to: localePath(parent.pathPrefix || `/docs/${currentSection.id}/${parent.source}`),
        ...(parent.ariaLabelKey ? { "aria-label": t(parent.ariaLabelKey) } : {})
      })
    }

    return items
  })

  const seoImageOverride = computed(
    () => nonEmptyString(pageSeo.value.ogImage) || nonEmptyString(pageSeo.value.image)
  )

  const generatedOgImageUrl = computed(() => {
    const pagePath = route.path || "/"
    const normalizedPath = pagePath.startsWith("/") ? pagePath : `/${pagePath}`
    const mode = import.meta.prerender ? "static" : "image"
    return `${siteUrl.value}/__og-image__/${mode}${normalizedPath}/og.png`
  })

  const seoImage = computed(() => seoImageOverride.value ?? generatedOgImageUrl.value)

  const pageType = computed<TYPE_PAGE>(() => {
    const pt = parentCollectionItem.value?.pageType
    switch (pt) {
      case TYPE_PAGE.PROJECT:
        return TYPE_PAGE.PROJECT
      case TYPE_PAGE.STARTER:
        return TYPE_PAGE.STARTER
      default:
        return TYPE_PAGE.ARTICLE
    }
  })

  const structuredDataNodes = computed<Record<string, unknown>[]>(() => {
    const pageTitle = seoTitle.value
    if (!pageTitle) return []

    return buildStructuredDataNodes({
      pageTitle,
      pageDescription: seoDescription.value,
      canonicalUrl: canonicalUrl.value,
      siteUrl: siteUrl.value,
      seoImage: seoImage.value,
      language: locale.value === "ru" ? "ru-RU" : "en-US",
      pageType: pageType.value,
      isCollectionPage: !!collectionItem.value,
      meta: typedPage.value?.meta ?? {},
      breadcrumbs: breadcrumbs.value,
      currentPath: canonicalPath.value,
      authorName: t("global.name")
    })
  })

  useSchemaOrg(() => structuredDataNodes.value)

  if (!seoImageOverride.value) {
    defineOgImage("DocsPage", {
      title: seoTitle.value || t("docs.seo.defaultTitle"),
      description: seoDescription.value || t("docs.seo.defaultDescription"),
      section: section.value ? t(section.value.labelKey) : t("docs.seo.defaultSection"),
      collection: parentCollectionItem.value
        ? t(parentCollectionItem.value.label)
        : collectionItem.value
          ? t(collectionItem.value.label)
          : ""
    })
  }

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

  return {
    breadcrumbs,
    seoTitle,
    seoDescription,
    pageType
  }
}
