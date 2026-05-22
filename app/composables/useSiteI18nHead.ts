import { getRssFeedPublicPath } from "@app/utils/rssFeed"
import { absoluteUrl, localizedCanonicalPath, normalizeSiteUrl } from "@app/utils/seo"
import { ROUTE_PATH } from "@base/types"

const resolveLocaleCode = (entry: string | { code: string }): string =>
  typeof entry === "string" ? entry : entry.code

export const useSiteI18nHead = () => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const { locale, locales, defaultLocale, t } = useI18n()

  const siteUrl = computed(() => normalizeSiteUrl(runtimeConfig.public.siteUrl))
  const localeCodes = computed(() => locales.value.map(resolveLocaleCode))
  const defaultLocaleCode = computed(() => String(defaultLocale))

  const pathForLocale = (code: string) =>
    localizedCanonicalPath(
      code,
      route.path || ROUTE_PATH.HOME,
      localeCodes.value,
      defaultLocaleCode.value
    )

  const canonicalUrl = computed(() =>
    absoluteUrl(siteUrl.value, pathForLocale(String(locale.value)))
  )

  const localeAlternateUrl = (code: string) => absoluteUrl(siteUrl.value, pathForLocale(code))

  const rssFeedUrl = computed(() =>
    absoluteUrl(siteUrl.value, getRssFeedPublicPath(String(locale.value), defaultLocaleCode.value))
  )

  const i18nHeadLinks = computed(() => [
    { rel: "canonical" as const, href: canonicalUrl.value },
    {
      rel: "alternate" as const,
      type: "application/rss+xml",
      title: t("layout.rss.feedTitle"),
      href: rssFeedUrl.value
    },
    ...localeCodes.value.map((code) => ({
      rel: "alternate" as const,
      hreflang: code,
      href: localeAlternateUrl(code)
    })),
    {
      rel: "alternate" as const,
      hreflang: "x-default",
      href: localeAlternateUrl(defaultLocaleCode.value)
    }
  ])

  return {
    siteUrl,
    canonicalUrl,
    i18nHeadLinks,
    htmlLang: locale
  }
}
