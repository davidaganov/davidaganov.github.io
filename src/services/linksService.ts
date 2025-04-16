import { useHttp } from "../composables/useHttp"

export function useLinksService() {
  const { loading, request, error, clearError } = useHttp()

  const GIST_ID = "57134a7f95965e88aa3127837b02dd9b"
  const gistUrl = `https://api.github.com/gists/${GIST_ID}`

  const getLinks = async () => {
    try {
      const gistData = await request(gistUrl)

      const linksContent = gistData.files.links.content
      const linksData = JSON.parse(linksContent)

      return {
        professional: linksData.professional || [],
        personal: linksData.personal || []
      }
    } catch (e) {
      console.error("Failed to load links", e)
    }
  }

  return { loading, error, clearError, getLinks }
}
