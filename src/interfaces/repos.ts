export interface Repo {
  id: string
  name: string
  description: string
  html_url: string
  topics: string[]
  homepage: string
}

export interface Topics {
  topics?: string[]
  ignoreTopics?: string[]
}

export interface GithubReposResponse extends Topics {
  items: Repo[]
}
