export interface GitHubRepoData {
  stargazers_count: number
  pushed_at: string
}

export interface GitHubLanguages {
  [language: string]: number
}
