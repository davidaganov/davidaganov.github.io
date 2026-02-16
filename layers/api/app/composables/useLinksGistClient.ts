import { ApiClient } from "@api/services/client"
import type { LinksGistContent } from "@/types/links"

export const useLinksGistClient = () => {
  const links = ref<LinksGistContent>({ professional: [], personal: [] })
  const error = ref<unknown>(null)
  const pending = ref(true)

  const refresh = async () => {
    try {
      pending.value = true
      error.value = null
      links.value = await ApiClient.links.getLinks()
    } catch (e) {
      error.value = e
      links.value = { professional: [], personal: [] }
    } finally {
      pending.value = false
    }
  }

  onMounted(() => {
    refresh()
  })

  return {
    links: readonly(links),
    error: readonly(error),
    pending: readonly(pending),
    refresh
  }
}
