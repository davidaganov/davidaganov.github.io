import type { Collections } from "@nuxt/content"

export const useContentCollection = () => {
  const { locale } = useI18n()
  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  return {
    locale,
    collection
  }
}
