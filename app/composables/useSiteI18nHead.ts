import {
  absoluteUrl,
  canonicalPathForRequest,
  normalizeDefaultLocalePath,
  normalizeSiteUrl
} from "@app/utils/seo"
import { ROUTE_PATH } from "@base/types"

const resolveLocaleCode = (entry: string | { code: string }): string =>
  typeof entry === "string" ? entry : entry.code

export const useSiteI18nHead = () => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const { locale, locales, defaultLocale } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const siteUrl = computed(() => normalizeSiteUrl(runtimeConfig.public.siteUrl))
  const localeCodes = computed(() => locales.value.map(resolveLocaleCode))
  const defaultLocaleCode = computed(() => String(defaultLocale))
  const canonicalPath = computed(() => canonicalPathForRequest(route.path || ROUTE_PATH.HOME))
  const canonicalUrl = computed(() => absoluteUrl(siteUrl.value, canonicalPath.value))

  const localeAlternateUrl = (code: string) => {
    const localizedPath = switchLocalePath(code as Parameters<typeof switchLocalePath>[0])
    return absoluteUrl(siteUrl.value, normalizeDefaultLocalePath(localizedPath || ROUTE_PATH.HOME))
  }

  const defaultAlternateUrl = computed(() => localeAlternateUrl(defaultLocaleCode.value))

  const i18nHeadLinks = computed(() => [
    { rel: "canonical" as const, href: () => canonicalUrl.value },
    ...localeCodes.value.map((code) => ({
      rel: "alternate" as const,
      hreflang: code,
      href: () => localeAlternateUrl(code)
    })),
    {
      rel: "alternate" as const,
      hreflang: "x-default",
      href: () => defaultAlternateUrl.value
    }
  ])

  return {
    siteUrl,
    canonicalUrl,
    i18nHeadLinks,
    htmlLang: locale
  }
}
