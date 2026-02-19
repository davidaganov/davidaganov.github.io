import type { Collections } from "@nuxt/content"

export const usePageContent = (path: string) => {
  const { locale } = useI18n()

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  return useAsyncData(
    () => `content:${collection.value}:${path}`,
    async () => {
      const cleanPath = path.replace(/^\/docs/, "")
      const allContent = await queryCollection(collection.value).all()

      const found = allContent.find(
        (p) => p.path === cleanPath || p.path === `/${cleanPath}` || p.path.endsWith(cleanPath)
      )

      return found
    },
    {
      watch: [locale]
    }
  )
}
