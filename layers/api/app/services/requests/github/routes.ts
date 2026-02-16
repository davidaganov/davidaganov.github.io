export const routes = {
  repo: (repo: string) => `https://api.github.com/repos/${repo}`,
  languages: (repo: string) => `https://api.github.com/repos/${repo}/languages`,
  stars: (repo: string) => `https://api.github.com/repos/${repo}`
} as const
