import { existsSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { DEFAULT_LOCALE } from "../app/utils/seo"

interface SiteLocale {
  code: string
  file: string
}

const projectRoot = fileURLToPath(new URL("../", import.meta.url))
const localesDir = `${projectRoot}/i18n/locales`

export const getSiteLocales = (): SiteLocale[] => {
  if (!existsSync(localesDir)) {
    return [{ code: DEFAULT_LOCALE, file: `${DEFAULT_LOCALE}.json` }]
  }

  const seen = new Set<string>()
  const locales = readdirSync(localesDir)
    .filter((entry) => entry.endsWith(".json"))
    .map((file) => ({
      code: file.replace(/\.json$/, ""),
      file
    }))
    .filter((locale) => {
      if (!locale.code || seen.has(locale.code)) return false
      seen.add(locale.code)
      return true
    })
    .sort((a, b) => {
      if (a.code === DEFAULT_LOCALE) return -1
      if (b.code === DEFAULT_LOCALE) return 1
      return a.code.localeCompare(b.code)
    })

  return locales.length ? locales : [{ code: DEFAULT_LOCALE, file: `${DEFAULT_LOCALE}.json` }]
}

export const getLocaleCodes = (): string[] => getSiteLocales().map((locale) => locale.code)
export const getNuxtI18nLocales = (): never => getSiteLocales() as never
export const getNuxtDefaultLocale = (): never => DEFAULT_LOCALE as never
