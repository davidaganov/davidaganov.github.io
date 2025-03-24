import { createI18n } from "vue-i18n"
import en from "@/locales/en.json"

export const SUPPORT_LOCALES = ["en", "ru"]

type MessageSchema = typeof en

export function setupI18n(options = { locale: "en", legacy: false }) {
  const i18n = createI18n<[MessageSchema], "en" | string, false>({
    ...options,
    messages: {
      en
    },
    availableLocales: SUPPORT_LOCALES
  })
  setI18nLanguage(i18n, options.locale)
  return i18n
}

export function setI18nLanguage(i18n: ReturnType<typeof setupI18n>, locale: string) {
  i18n.global.locale.value = locale
  document?.querySelector("html")?.setAttribute("lang", locale)
}
