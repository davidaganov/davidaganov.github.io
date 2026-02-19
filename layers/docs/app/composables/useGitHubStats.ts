import { ApiClient } from "@api/services/client"
import type { GitHubUserData } from "@api/types/github"
import { USERNAME } from "@base/constants/config"

export const useGitHubStats = () => {
  const user = ref<GitHubUserData | null>(null)
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
