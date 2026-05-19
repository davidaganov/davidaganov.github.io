import type { Collections } from "@nuxt/content"

const localeCodeFromEntry = (entry: unknown): string | null => {
  if (typeof entry === "string") return entry
  if (!entry || typeof entry !== "object" || !("code" in entry)) return null

  const code = (entry as { code?: unknown }).code
  return typeof code === "string" ? code : null
}

const localeCodesFromEntries = (entries: unknown): string[] => {
  if (!Array.isArray(entries)) return []
  return entries.flatMap((entry) => {
    const code = localeCodeFromEntry(entry)
    return code ? [code] : []
  })
}

const localeFromPath = (path: string, localeCodes: string[]): string | null => {
  const [firstSegment, secondSegment] = path.split("/").filter(Boolean)
  if (!firstSegment) return null
  if (localeCodes.includes(firstSegment)) return firstSegment
  return secondSegment === "docs" ? firstSegment : null
}

export const useContentCollection = () => {
  const route = useRoute()
  const { locale: i18nLocale, locales } = useI18n()

  const localeCodes = computed(() => localeCodesFromEntries(unref(locales)))
  const locale = computed(() => localeFromPath(route.path, localeCodes.value) ?? i18nLocale.value)

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  return {
    locale,
    collection
  }
}
