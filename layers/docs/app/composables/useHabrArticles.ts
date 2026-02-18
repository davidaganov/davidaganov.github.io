import type { Collections } from "@nuxt/content"

export const useHabrArticles = () => {
  const { locale } = useI18n()

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  const { data: articles } = useAsyncData(
    "habr-articles",
    async () => {
      return await queryCollection(collection.value)
        .where("path", "LIKE", "%/articles/%")
        .select("title", "description", "meta", "path")
        .all()
    },
    {
      watch: [locale]
    }
  )

  const habrArticles = computed(() =>
    (articles.value || []).filter((a) => (a.meta as Record<string, unknown>)?.habrUrl)
  )

  const siteArticles = computed(() =>
    (articles.value || []).filter((a) => !(a.meta as Record<string, unknown>)?.habrUrl)
  )

  return {
    articles,
    habrArticles,
    siteArticles,
    habrCount: computed(() => habrArticles.value.length),
    siteCount: computed(() => siteArticles.value.length)
  }
}
