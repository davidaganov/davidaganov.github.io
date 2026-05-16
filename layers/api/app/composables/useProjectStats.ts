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
    version?: string
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

export const useProjectStats = (page: Ref<unknown | Collections[keyof Collections] | null>) => {
  const meta = computed(() => {
    const p = (page.value || {}) as { meta?: Record<string, unknown> }
    return {
      npmPackage: String(p.meta?.npmPackage || ""),
      githubRepo: String(p.meta?.githubRepo || "")
    }
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

  const fetchGithubStats = async (repo: string) => {
    try {
      const [repoData, languagesData, releaseData] = await Promise.all([
        ApiClient.github.getRepo(repo),
        ApiClient.github.getLanguages(repo),
        ApiClient.github.getLatestRelease(repo)
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
        lastCommit: repoData.pushed_at || "",
        version: releaseData?.tag_name ? releaseData.tag_name.replace(/^v/, "") : undefined,
        languages
      }
    } catch {
      return null
    }
  }

  const {
    data: stats,
    pending: loading,
    error
  } = useAsyncData(
    `project-stats-${meta.value.npmPackage}-${meta.value.githubRepo}`,
    async () => {
      const result: ProjectStats = {}
      if (!meta.value.npmPackage && !meta.value.githubRepo) return result

      const [npm, github] = await Promise.all([
        meta.value.npmPackage ? fetchNpmStats(meta.value.npmPackage) : null,
        meta.value.githubRepo ? fetchGithubStats(meta.value.githubRepo) : null
      ])

      if (npm) result.npm = npm
      if (github) result.github = github

      return result
    },
    {
      watch: [meta],
      default: () => ({})
    }
  )

  return {
    stats,
    loading,
    error,
    formatDownloads
  }
}
