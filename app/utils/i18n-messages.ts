import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const localesDir = join(fileURLToPath(new URL("../../", import.meta.url)), "i18n", "locales")
const messagesCache = new Map<string, Record<string, unknown>>()

const loadLocaleMessages = (locale: string): Record<string, unknown> | null => {
  const cached = messagesCache.get(locale)
  if (cached) return cached

  const filePath = join(localesDir, `${locale}.json`)
  if (!existsSync(filePath)) return null

  try {
    const messages = JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>
    messagesCache.set(locale, messages)
    return messages
  } catch {
    return null
  }
}

export const resolveI18nKey = (messages: Record<string, unknown>, key: string): string => {
  const value = key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[part]
    }
    return undefined
  }, messages)

  return typeof value === "string" ? value : key
}

export const createTranslator = (locale: string): ((key: string) => string) => {
  const messages = loadLocaleMessages(locale)
  if (!messages) return (key: string) => key
  return (key: string) => resolveI18nKey(messages, key)
}
