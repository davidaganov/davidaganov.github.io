import { ApiClient } from "@api/services/client"
import { USERNAME } from "@base/constants/config"

interface GitHubUser {
  public_repos: number
  public_gists: number
  followers: number
  following: number
}

export function useGitHubStats() {
  const user = ref<GitHubUser | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchStats = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await ApiClient.github.getUser(USERNAME)
      user.value = data
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchStats()
  })

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error)
  }
}
