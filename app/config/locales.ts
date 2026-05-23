import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { getSiteLocaleCodes, SITE_LOCALE_CODES } from "../constants/siteLocaleCodes"
import { DEFAULT_LOCALE } from "../utils/seo"

interface SiteLocale {
  code: string
  file: string
}

const projectRoot = fileURLToPath(new URL("../../", import.meta.url))
const localesDir = `${projectRoot}/i18n/locales`

export const getSiteLocales = (): SiteLocale[] => {
  const locales = SITE_LOCALE_CODES.map((code) => ({
    code,
    file: `${code}.json`
  })).filter((locale) => existsSync(`${localesDir}/${locale.file}`))

  return locales.length ? locales : [{ code: DEFAULT_LOCALE, file: `${DEFAULT_LOCALE}.json` }]
}

export const getLocaleCodes = (): string[] => getSiteLocaleCodes()

export const getNuxtI18nLocales = (): never => getSiteLocales() as never

export const getNuxtDefaultLocale = (): never => DEFAULT_LOCALE as never
