import type { Collections } from "@nuxt/content"
import { ApiClient } from "@api/services/client"

interface ProjectStats {
  npm?: {
    version: string
    downloads: number
  }
  github?: {
    stars: number
    lastCommit: string
    languages: Array<{ name: string; percentage: number; color: string }>
  }
}

const githubColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Vue: "#4fc08d",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  C: "#555555",
  Shell: "#89e051",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#ffac45",
  Dart: "#00B4AB"
}

export function useProjectStats(page: Ref<unknown | Collections[keyof Collections] | null>) {
  const meta = computed(() => {
    const p = (page.value || {}) as { meta?: Record<string, unknown> }
    return {
      npmPackage: String(p.meta?.npmPackage || ""),
      githubRepo: String(p.meta?.githubRepo || "")
    }
  })

  const stats = ref<ProjectStats>({})
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const formatDownloads = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`
    return String(num)
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "today"
    if (diffDays === 1) return "yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const fetchNpmStats = async (packageName: string) => {
    try {
      const [packageData, downloadsData] = await Promise.all([
        ApiClient.npm.getPackage(packageName),
        ApiClient.npm.getDownloads(packageName)
      ])

      return {
        version: packageData?.["dist-tags"]?.latest || "?",
        downloads: downloadsData?.downloads || 0
      }
    } catch {
      return null
    }
  }

  const fetchGithubStats = async (repo: string) => {
    try {
      const [repoData, languagesData] = await Promise.all([
        ApiClient.github.getRepo(repo),
        ApiClient.github.getLanguages(repo)
      ])

      if (!repoData || !languagesData) return null

      const totalBytes = Object.values(languagesData).reduce((a, b) => a + b, 0)

      const languages = Object.entries(languagesData)
        .map(([name, bytes]) => ({
          name,
          percentage: Math.round((bytes / totalBytes) * 1000) / 10,
          color: githubColors[name] || "#7c3aed"
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5)

      return {
        stars: repoData.stargazers_count || 0,
        lastCommit: repoData.pushed_at || "",
        languages
      }
    } catch {
      return null
    }
  }

  const fetchStats = async () => {
    if (!meta.value.npmPackage && !meta.value.githubRepo) return

    loading.value = true
    error.value = null

    try {
      const [npm, github] = await Promise.all([
        meta.value.npmPackage ? fetchNpmStats(meta.value.npmPackage) : null,
        meta.value.githubRepo ? fetchGithubStats(meta.value.githubRepo) : null
      ])

      if (npm) stats.value.npm = npm
      if (github) stats.value.github = github
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  watch(
    () => meta.value,
    () => fetchStats(),
    { immediate: true }
  )

  return {
    stats: readonly(stats),
    loading: readonly(loading),
    error: readonly(error),
    formatDownloads,
    formatDate
  }
}
