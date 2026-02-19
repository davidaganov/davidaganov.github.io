import { request } from "@api/services/request"
import { routes } from "@api/services/requests/github/routes"
import type { GitHubLanguages, GitHubRepoData, GitHubUserData } from "@api/types/github"

export const getRepo = async (repo: string): Promise<GitHubRepoData | null> => {
  try {
    return await request.get<GitHubRepoData>(routes.repo(repo))
  } catch {
    return null
  }
}

export const getLanguages = async (repo: string): Promise<GitHubLanguages | null> => {
  try {
    return await request.get<GitHubLanguages>(routes.languages(repo))
  } catch {
    return null
  }
}

export const getStars = async (repo: string): Promise<number> => {
  const data = await getRepo(repo)
  return data?.stargazers_count || 0
}

export const getUser = async (username: string): Promise<GitHubUserData | null> => {
  try {
    return await request.get<GitHubUserData>(routes.user(username))
  } catch {
    return null
  }
}
