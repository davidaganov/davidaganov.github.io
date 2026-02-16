import { ApiClient } from "@api/services/client"
import type { Collections } from "@nuxt/content"

export interface ProjectWithStars {
  title: string
  description: string
  to: string
  githubRepo: string
  stars: number
}

export function useTopProjects(limit = 3) {
  const { locale } = useI18n()
  const projects = ref<ProjectWithStars[]>([])
  const loading = ref(false)

  const fetchProjects = async () => {
    loading.value = true
    try {
      const collection = `content_${locale.value}` as keyof Collections
      const allProjects = await queryCollection(collection)
        .where("path", "LIKE", "/projects/%")
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
              to: `/projects/${p.path.split("/").pop() || ""}`,
              githubRepo,
              stars
            }
          })
      )

      projects.value = withStars.sort((a, b) => b.stars - a.stars).slice(0, limit)
    } finally {
      loading.value = false
    }
  }

  watch(
    () => locale.value,
    () => fetchProjects(),
    { immediate: true }
  )

  return {
    projects: readonly(projects),
    loading: readonly(loading)
  }
}
