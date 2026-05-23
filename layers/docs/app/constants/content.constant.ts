import { getSiteLocaleCodes } from "@base/constants/siteLocaleCodes"

export const CONTENT_LOCALES = getSiteLocaleCodes()

export const isContentLocale = (value: string): value is string => {
  return CONTENT_LOCALES.includes(value)
}
