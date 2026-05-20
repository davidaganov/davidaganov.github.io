const parseRepos = (raw: string): string[] => {
  return [
    ...new Set(
      raw
        .split(",")
        .map((repo) => repo.trim())
        .filter(Boolean)
    )
  ]
}

export default defineCachedEventHandler(
  async (event) => {
    const repos = parseRepos(String(getQuery(event).repos || ""))
    if (!repos.length) return {}

    const config = useRuntimeConfig()
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Nuxt-Portfolio"
    }

    if (config.githubToken) {
      headers.Authorization = `Bearer ${config.githubToken}`
    }

    const entries = await Promise.all(
      repos.map(async (repo) => {
        try {
          const data = await $fetch<{ stargazers_count?: number }>(
            `https://api.github.com/repos/${repo}`,
            { headers }
          )
          return [repo, data.stargazers_count ?? 0] as const
        } catch {
          return [repo, 0] as const
        }
      })
    )

    return Object.fromEntries(entries)
  },
  {
    maxAge: 60 * 60,
    swr: true,
    getKey: (event) => {
      const repos = parseRepos(String(getQuery(event).repos || ""))
      return `github-stars:${repos.sort().join(",")}`
    }
  }
)
