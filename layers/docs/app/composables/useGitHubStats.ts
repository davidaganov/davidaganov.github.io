import { ApiClient } from "@api/services/client"
import { USERNAME } from "@base/constants"

export const useGitHubStats = () => {
  const {
    data: user,
    status,
    error
  } = useAsyncData(`github-user-${USERNAME}`, () => ApiClient.github.getUser(USERNAME), {
    server: true,
    lazy: false,
    default: () => null
  })

  const loading = computed(() => status.value === "pending")

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error)
  }
}
