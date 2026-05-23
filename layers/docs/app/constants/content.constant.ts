import {
  getSiteLocaleCodes,
  isSiteLocaleCode,
  type SiteLocaleCode
} from "@app/constants/siteLocaleCodes"

export const CONTENT_LOCALES = getSiteLocaleCodes()

export const isContentLocale = (value: string): value is SiteLocaleCode => isSiteLocaleCode(value)
