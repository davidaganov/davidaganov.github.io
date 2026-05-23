/// <reference types="vite/client" />
import { createTranslator, resolveI18nKey } from "@app/utils/i18n-messages"

type LocaleMessages = Record<string, unknown>

const loadBundledLocaleMessages = (): Map<string, LocaleMessages> => {
  const map = new Map<string, LocaleMessages>()
  const modules = import.meta.glob<LocaleMessages>("../../../i18n/locales/*.json", {
    eager: true
  })

  for (const [path, messages] of Object.entries(modules)) {
    const match = path.match(/[/\\]([^/\\]+)\.json$/)
    if (match?.[1]) map.set(match[1], messages)
  }

  return map
}

const localeMessagesByCode =
  typeof import.meta.glob === "function"
    ? loadBundledLocaleMessages()
    : new Map<string, LocaleMessages>()

export const createServerTranslator = (locale: string): ((key: string) => string) => {
  const bundled = localeMessagesByCode.get(locale)
  if (bundled) return (key: string) => resolveI18nKey(bundled, key)

  return createTranslator(locale)
}
