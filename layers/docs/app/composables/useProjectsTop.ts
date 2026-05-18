import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { ApiClient } from "@api/services/client"
import { toContentPrefix } from "@docs/utils/content/paths"
import { contentPathToPublicPath } from "@docs/utils/path/publicPath"
import { ROUTE_PATH } from "@base/types"

const DEFAULT_LIMIT = 3

export const useProjectsTop = async (limit = DEFAULT_LIMIT) => {
  const { collection } = useContentCollection()
  const contentPrefix = toContentPrefix(ROUTE_PATH.ABOUT_PROJECTS)

  const { data: projects, pending: loading } = await useAsyncData(
    () => `top-projects:${collection.value}`,
    async () => {
      const rows = await queryCollection(collection.value)
        .where("path", "LIKE", `${contentPrefix}%`)
        .select("title", "description", "meta", "path")
        .all()

      const withStars = await Promise.all(
        rows
          .filter((row) => row.meta?.githubRepo)
          .map(async (row) => {
            const githubRepo = String(row.meta?.githubRepo || "")
            const stars = await ApiClient.github.getStars(githubRepo)
            const slug =
              String(row.path || "")
                .split("/")
                .filter(Boolean)
                .at(-1) || ""

            return {
              title: String(row.title || ""),
              description: String(row.description || ""),
              to: contentPathToPublicPath(`${contentPrefix}/${slug}`),
              githubRepo,
              stars
            }
          })
      )

      return withStars.sort((a, b) => b.stars - a.stars).slice(0, limit)
    },
    {
      watch: [collection],
      default: () => []
    }
  )

  return {
    projects,
    loading
  }
}
