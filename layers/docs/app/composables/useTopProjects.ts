import type { Collections } from "@nuxt/content"
import { ApiClient } from "@api/services/client"
import { ROUTE_PATH } from "@base/types/enums"

export interface ProjectWithStars {
  title: string
  description: string
  to: string
  githubRepo: string
  stars: number
}

export function useTopProjects(limit = 3) {
  const { locale } = useI18n()

  const { data: projects, pending: loading } = useAsyncData(
    () => `top-projects:${locale.value}`,
    async () => {
      const collection = `content_${locale.value}` as keyof Collections
      const allProjects = await queryCollection(collection)
        .where("path", "LIKE", "%/projects/%")
        .all()

      const withStars = await Promise.all(
        allProjects
          .filter((p) => p.meta?.githubRepo)
          .map(async (p) => {
            const githubRepo = String(p.meta?.githubRepo || "")
            const stars = await ApiClient.github.getStars(githubRepo)
            return {
              title: String(p.title || ""),
              description: String(p.description || ""),
              to: `${ROUTE_PATH.PROJECTS}/${p.path.split("/").pop() || ""}`,
              githubRepo,
              stars
            }
          })
      )

      return withStars.sort((a, b) => b.stars - a.stars).slice(0, limit)
    },
    {
      watch: [locale],
      default: () => []
    }
  )

  return {
    projects,
    loading
  }
}
