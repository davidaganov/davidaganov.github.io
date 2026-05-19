import type { Collections } from "@nuxt/content"
import { LOCALE_PREFIX_RE } from "@base/constants"
import { LOCALE } from "@base/types"

const isLocale = (value: string): value is LOCALE => {
  return value === LOCALE.EN || value === LOCALE.RU
}

const localeFromPath = (path: string): LOCALE | null => {
  const match = path.match(LOCALE_PREFIX_RE)
  if (!match) return null
  const code = match[0].slice(1)
  return isLocale(code) ? code : null
}

export const useContentCollection = () => {
  const route = useRoute()
  const { locale: i18nLocale } = useI18n()

  const locale = computed(
    () => localeFromPath(route.path) ?? (isLocale(i18nLocale.value) ? i18nLocale.value : LOCALE.RU)
  )

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  return {
    locale,
    collection
  }
}
