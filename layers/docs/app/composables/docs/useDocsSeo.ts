import { absoluteUrl, localizedCanonicalPath } from "@app/utils/seo"
import { getFirstPathForSection } from "@docs/utils/sections"
import { buildStructuredDataNodes } from "@docs/utils/structuredData"
import { type DocsPageData, type DocsSeoOptions, TYPE_PAGE } from "@docs/types"

export const useDocsSeo = ({
  section,
  collectionItem,
  parentCollectionItem,
  page
}: DocsSeoOptions) => {
  const { locale, locales, defaultLocale, t } = useI18n()
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

  const localeCodes = computed(() =>
    locales.value.map((entry) => (typeof entry === "string" ? entry : entry.code))
  )

  const defaultLocaleCode = computed(() => String(defaultLocale))

  const canonicalPath = computed(() =>
    localizedCanonicalPath(
      String(locale.value),
      route.path || "/",
      localeCodes.value,
      defaultLocaleCode.value
    )
  )

  const canonicalUrl = computed(() => absoluteUrl(siteUrl.value, canonicalPath.value))

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

  const seoImage = computed(() => seoImageOverride.value)

  const pageType = computed<TYPE_PAGE>(() => {
    const pt = parentCollectionItem.value?.pageType
    switch (pt) {
      case TYPE_PAGE.PROJECT:
        return TYPE_PAGE.PROJECT
      case TYPE_PAGE.TEMPLATE:
        return TYPE_PAGE.TEMPLATE
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

  const slugTitleFallback = computed(() => {
    const slug = route.params.slug
    const segments = Array.isArray(slug)
      ? slug.filter(Boolean).map(String)
      : slug
        ? [String(slug)]
        : []
    const leaf = segments.at(-1)
    if (!leaf) return undefined

    return leaf
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  })

  const resolvedPageTitle = computed(
    () => seoTitle.value || slugTitleFallback.value || t("docs.seo.defaultTitle")
  )
  const resolvedOgDescription = computed(
    () => seoDescription.value || t("docs.seo.defaultDescription")
  )

  useSeoMeta({
    title: () => resolvedPageTitle.value,
    description: () => resolvedOgDescription.value,
    ogTitle: () => resolvedPageTitle.value,
    ogDescription: () => resolvedOgDescription.value,
    ogUrl: () => canonicalUrl.value,
    ogImage: () => seoImage.value,
    twitterTitle: () => resolvedPageTitle.value,
    twitterDescription: () => resolvedOgDescription.value,
    twitterImage: () => seoImage.value,
    twitterCard: "summary_large_image"
  })

  const ogImageTitle = computed(() => seoTitle.value || slugTitleFallback.value)

  if (!seoImageOverride.value && ogImageTitle.value) {
    defineOgImage("DocsPage", {
      title: ogImageTitle.value,
      description: resolvedOgDescription.value,
      section: section.value ? t(section.value.labelKey) : t("docs.seo.defaultSection"),
      collection: parentCollectionItem.value
        ? t(parentCollectionItem.value.label)
        : collectionItem.value
          ? t(collectionItem.value.label)
          : ""
    })
  }

  return {
    breadcrumbs,
    seoTitle,
    seoDescription,
    pageType
  }
}
