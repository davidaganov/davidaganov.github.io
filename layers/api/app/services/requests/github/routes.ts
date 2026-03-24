export const routes = {
  repo: (repo: string) => `https://api.github.com/repos/${repo}`,
  languages: (repo: string) => `https://api.github.com/repos/${repo}/languages`,
  latestRelease: (repo: string) => `https://api.github.com/repos/${repo}/releases/latest`,
  stars: (repo: string) => `https://api.github.com/repos/${repo}`,
  user: (username: string) => `https://api.github.com/users/${username}`
} as const
