import { ApiClient } from "@api/services/client"
import type { GitHubUserData } from "@api/types/github"
import { USERNAME } from "@base/constants/config"

export const useGitHubStats = () => {
  const {
    data: user,
    status,
    error
  } = useAsyncData(`github-user-${USERNAME}`, () => ApiClient.github.getUser(USERNAME), {
    lazy: true,
    server: true
  })

  const loading = computed(() => status.value === "pending")

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error)
  }
}
