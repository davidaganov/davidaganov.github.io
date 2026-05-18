import type { Collections } from "@nuxt/content"
import { findContentPageByPublicPath } from "@docs/utils/path/pathResolve"

export const usePageContent = (path: string) => {
  const { locale } = useI18n()

  const collection = computed(() => `content_${locale.value}` as keyof Collections)
  const key = computed(() => `content:${collection.value}:${path}`)

  return useAsyncData(
    key.value,
    async () => {
      const allContent = await queryCollection(collection.value).all()
      const found = findContentPageByPublicPath(allContent, path)

      return found ?? null
    },
    {
      watch: [locale]
    }
  )
}
