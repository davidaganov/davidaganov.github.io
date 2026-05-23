import { DEFAULT_LOCALE } from "@app/utils/seo"

const localeFiles =
  typeof import.meta.glob === "function" ? import.meta.glob("../../../../i18n/locales/*.json") : {}

const parseLocaleCode = (path: string): string | null => {
  const match = path.match(/[/\\]([^/\\]+)\.json$/)
  return match?.[1] ?? null
}

const discoverLocaleCodes = (): string[] => {
  const seen = new Set<string>()
  const codes: string[] = []

  for (const path of Object.keys(localeFiles)) {
    const code = parseLocaleCode(path)
    if (!code || seen.has(code)) continue
    seen.add(code)
    codes.push(code)
  }

  codes.sort((a, b) => {
    if (a === DEFAULT_LOCALE) return -1
    if (b === DEFAULT_LOCALE) return 1
    return a.localeCompare(b)
  })

  return codes.length ? codes : [DEFAULT_LOCALE]
}

let cachedCodes: string[] | null = null

export const getSiteLocaleCodes = (): string[] => {
  if (!cachedCodes) cachedCodes = discoverLocaleCodes()
  return cachedCodes
}
