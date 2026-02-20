import type { Collections } from "@nuxt/content"

export const usePageContent = (path: string) => {
  const { locale } = useI18n()

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  return useAsyncData(
    () => `content:${collection.value}:${path}`,
    async () => {
      const withoutDocs = path.replace(/^\/docs/, "")
      const withoutSection = path.replace(/^\/docs\/[^/]+/, "")
      const candidates = [withoutDocs, withoutSection].filter(Boolean)
      const allContent = await queryCollection(collection.value).all()

      const found = allContent.find((p) =>
        candidates.some((candidate) => {
          return p.path === candidate || p.path === `/${candidate}` || p.path.endsWith(candidate)
        })
      )

      return found
    },
    {
      watch: [locale]
    }
  )
}
