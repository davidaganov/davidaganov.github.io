import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { toContentPrefix } from "@docs/utils/content/paths"
import { ROUTE_PATH } from "@base/types"

export const useHabrArticles = () => {
  const { collection } = useContentCollection()
  const contentPrefix = toContentPrefix(ROUTE_PATH.ABOUT_ARTICLES)

  const { data: articles } = useAsyncData(
    () => `habr-articles:${collection.value}`,
    async () => {
      return await queryCollection(collection.value)
        .where("path", "LIKE", `${contentPrefix}%`)
        .select("title", "description", "meta", "path")
        .all()
    },
    {
      watch: [collection]
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
