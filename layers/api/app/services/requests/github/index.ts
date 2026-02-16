import { request } from "@api/services/request"
import { routes } from "@api/services/requests/github/routes"
import type { GitHubLanguages, GitHubRepoData } from "@api/types/github"

export async function getRepo(repo: string): Promise<GitHubRepoData | null> {
  try {
    return await request.get<GitHubRepoData>(routes.repo(repo))
  } catch {
    return null
  }
}

export async function getLanguages(repo: string): Promise<GitHubLanguages | null> {
  try {
    return await request.get<GitHubLanguages>(routes.languages(repo))
  } catch {
    return null
  }
}

export async function getStars(repo: string): Promise<number> {
  const data = await getRepo(repo)
  return data?.stargazers_count || 0
}
