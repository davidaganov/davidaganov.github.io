import type { Collections } from "@nuxt/content"
import { ApiClient } from "@api/services/client"
import type { ProjectStats } from "@api/types"

const githubColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Vue: "#4fc08d",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Shell: "#89e051",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#ffac45",
  Dart: "#00B4AB"
}

export const useProjectStats = (page: Ref<unknown | Collections[keyof Collections] | null>) => {
  const meta = computed(() => {
    const p = (page.value || {}) as { meta?: Record<string, unknown> }
    return {
      npmPackage: String(p.meta?.npmPackage || ""),
      githubRepo: String(p.meta?.githubRepo || "")
    }
  })

  const statsKey = computed(() => {
    const { npmPackage, githubRepo } = meta.value
    if (!npmPackage && !githubRepo) return "project-stats:idle"
    return `project-stats:${npmPackage}:${githubRepo}`
  })

  const formatDownloads = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`
    return String(num)
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

  const fetchGithubStats = async (repo: string, includeRelease: boolean) => {
    try {
      const [repoData, languagesData, releaseData] = await Promise.all([
        ApiClient.github.getRepo(repo),
        ApiClient.github.getLanguages(repo),
        includeRelease ? ApiClient.github.getLatestRelease(repo) : Promise.resolve(null)
      ])

      if (!repoData || !languagesData) return null

      const langs = languagesData as Record<string, number>
      const totalBytes = Object.values(langs).reduce((a: number, b: number) => a + b, 0)

      const languages = Object.entries(langs)
        .map(([name, bytes]: [string, number]) => ({
          name,
          percentage: Math.round((bytes / totalBytes) * 1000) / 10,
          color: githubColors[name] || "#7c3aed"
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5)

      return {
        stars: repoData.stargazers_count || 0,
        version: releaseData?.tag_name ? releaseData.tag_name.replace(/^v/, "") : undefined,
        languages
      }
    } catch {
      return null
    }
  }

  const {
    data: stats,
    status,
    error
  } = useAsyncData(
    () => statsKey.value,
    async (): Promise<ProjectStats> => {
      const { npmPackage, githubRepo } = meta.value
      if (!npmPackage && !githubRepo) return {}

      const result: ProjectStats = {}

      const [npm, github] = await Promise.all([
        npmPackage ? fetchNpmStats(npmPackage) : null,
        githubRepo ? fetchGithubStats(githubRepo, Boolean(npmPackage)) : null
      ])

      if (npm) result.npm = npm
      if (github) result.github = github

      return result
    },
    {
      server: false,
      lazy: false,
      watch: [statsKey],
      default: (): ProjectStats => ({})
    }
  )

  return {
    stats,
    loading: computed(() => status.value === "pending"),
    error,
    formatDownloads
  }
}
