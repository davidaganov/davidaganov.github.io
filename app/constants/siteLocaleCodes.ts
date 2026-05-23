export const SITE_LOCALE_CODES = ["ru", "en"] as const

export type SiteLocaleCode = (typeof SITE_LOCALE_CODES)[number]

const siteLocaleCodeSet = new Set<string>(SITE_LOCALE_CODES)

export const isSiteLocaleCode = (value: string): value is SiteLocaleCode => {
  return siteLocaleCodeSet.has(value)
}

export const getSiteLocaleCodes = (): SiteLocaleCode[] => [...SITE_LOCALE_CODES]
