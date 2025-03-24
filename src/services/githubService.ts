import { useHttp } from "../composables/useHttp"
import type { Repo, Topics } from "@/interfaces"

export function useGithubService() {
  const { loading, request, error, clearError } = useHttp()

  const apiBase = "https://api.github.com/users/davidaganov"

  const getRepos = async ({ topics, ignoreTopics }: Topics) => {
    const res = await request(`${apiBase}/repos`)
    return _transformProjects({ items: res, topics, ignoreTopics })
  }

  const _transformProjects = ({
    items,
    topics,
    ignoreTopics
  }: {
    items: Repo[]
    topics?: string[]
    ignoreTopics?: string[]
  }) => {
    let filteredItems = items
      .map((item) => {
        const { id, name, description, html_url, topics, homepage } = item
        return { id, name, description, html_url, topics, homepage }
      })
      .filter((item) => item.name !== "davidaganov.github.io")
      .filter((item) => item.description)

    if (topics && topics.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        return item.topics.some((topic) => topics.includes(topic))
      })
    }

    if (ignoreTopics && ignoreTopics.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        return !item.topics.some((topic) => ignoreTopics.includes(topic))
      })
    }

    return filteredItems
  }

  return { loading, error, clearError, getRepos }
}
