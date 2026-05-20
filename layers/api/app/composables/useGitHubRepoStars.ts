export const fetchGitHubStarsMap = (repos: string[]): Promise<Record<string, number>> => {
  const unique = [...new Set(repos.map((repo) => repo.trim()).filter(Boolean))]
  if (!unique.length) return Promise.resolve({})

  return $fetch<Record<string, number>>("/api/github/stars", {
    query: { repos: unique.join(",") }
  })
}

export const useGitHubRepoStars = (repo: MaybeRefOrGetter<string>) => {
  const repoRef = computed(() => toValue(repo).trim())

  return useAsyncData(
    () => (repoRef.value ? `github-stars:${repoRef.value}` : "github-stars:empty"),
    async () => {
      const name = repoRef.value
      if (!name) return null

      const map = await fetchGitHubStarsMap([name])
      return map[name] ?? 0
    },
    {
      server: true,
      lazy: false,
      watch: [repoRef],
      default: () => null
    }
  )
}
