import { useHttp } from "../composables/useHttp"

export function useSkillsService() {
  const { loading, request, error, clearError } = useHttp()

  const GIST_ID = "303cbe740ed121f1fb37dc6df9999fdc"
  const gistUrl = `https://api.github.com/gists/${GIST_ID}`

  const getSkills = async () => {
    try {
      const gistData = await request(gistUrl)

      const skillsContent = gistData.files.skills?.content

      if (!skillsContent) {
        console.error("File with skills not found in Gist")
        return { skills: [] }
      }

      const skillsData = JSON.parse(skillsContent)

      return {
        skills: skillsData.skills || []
      }
    } catch (e) {
      console.error("Failed to load skills", e)
      return { skills: [] }
    }
  }

  return { loading, error, clearError, getSkills }
}
