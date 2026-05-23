import type { ContentLocale } from "@docs/types"
import en from "../../i18n/locales/en.json"
import ru from "../../i18n/locales/ru.json"

const messagesByLocale: Record<ContentLocale, Record<string, unknown>> = {
  ru,
  en
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
  const messages = messagesByLocale[locale]
  return (key: string) => resolveKey(messages, key)
}
