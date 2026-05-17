export interface GitHubRepoData {
  stargazers_count: number
  pushed_at: string
}

export interface GitHubUserData {
  public_repos: number
  public_gists: number
  followers: number
  following: number
}

export interface GitHubLanguages {
  [language: string]: number
}
