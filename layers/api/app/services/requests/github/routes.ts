export const routes = {
  repo: (repo: string) => `/api/github/repos/${repo}`,
  languages: (repo: string) => `/api/github/repos/${repo}/languages`,
  latestRelease: (repo: string) => `/api/github/repos/${repo}/releases/latest`,
  stars: (repo: string) => `/api/github/repos/${repo}`,
  user: (username: string) => `/api/github/users/${username}`
} as const
