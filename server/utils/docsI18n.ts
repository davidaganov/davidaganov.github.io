import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { ContentLocale } from "@docs/types"

const cache = new Map<ContentLocale, Record<string, unknown>>()

const loadLocale = (locale: ContentLocale): Record<string, unknown> => {
  const cached = cache.get(locale)
  if (cached) return cached

  const filePath = join(process.cwd(), "i18n", "locales", `${locale}.json`)
  const raw = readFileSync(filePath, "utf8")
  const parsed = JSON.parse(raw) as Record<string, unknown>
  cache.set(locale, parsed)
  return parsed
}

const resolveKey = (messages: Record<string, unknown>, key: string): string => {
  const value = key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[part]
    }
    return undefined
  }, messages)

  return typeof value === "string" ? value : key
}

export const createDocsTranslator = (locale: ContentLocale): ((key: string) => string) => {
  const messages = loadLocale(locale)
  return (key: string) => resolveKey(messages, key)
}
