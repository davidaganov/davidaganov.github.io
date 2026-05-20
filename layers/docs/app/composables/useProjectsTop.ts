import { fetchGitHubStarsMap } from "@api/composables/useGitHubRepoStars"
import { useContentCollection } from "@docs/composables/content/useContentCollection"
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

      const repoRows = rows.filter((row) => row.meta?.githubRepo)
      const repos = repoRows.map((row) => String(row.meta?.githubRepo || ""))
      const starsMap = await fetchGitHubStarsMap(repos)

      const withStars = repoRows.map((row) => {
        const githubRepo = String(row.meta?.githubRepo || "")
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
          stars: starsMap[githubRepo] ?? 0
        }
      })

      return withStars.sort((a, b) => b.stars - a.stars).slice(0, limit)
    },
    {
      watch: [collection],
      lazy: false,
      server: true,
      default: () => []
    }
  )

  return {
    projects,
    loading
  }
}
