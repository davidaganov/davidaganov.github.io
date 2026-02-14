import type { Collections } from "@nuxt/content"

export const usePageContent = (path: string) => {
  const { locale } = useI18n()

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  return useAsyncData(
    () => `content:${collection.value}:${path}`,
    async () => {
      return await queryCollection(collection.value).path(path).first()
    },
    {
      watch: [locale]
    }
  )
}
