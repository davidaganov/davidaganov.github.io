import { ref } from "vue"

export function useHttp() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const request = async (
    url: string,
    method = "GET",
    body = null,
    headers = {
      "Content-Type": "application/json"
    }
  ) => {
    loading.value = true

    try {
      const response = await fetch(url, { method, body, headers })
      if (!response.ok) {
        throw new Error(`Could not fetch ${url}, status: ${response.status}`)
      }
      const data = await response.json()

      loading.value = false
      return data
    } catch (e) {
      loading.value = false
      error.value = (e as Error).message
      throw e
    }
  }

  const clearError = () => (error.value = null)

  return { loading, request, error, clearError }
}
