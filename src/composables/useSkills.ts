import { ref, onMounted } from "vue"
import { useSkillsService } from "@/services/skillsService"
import type { SkillCategory } from "@/interfaces"

export function useSkills() {
  const { loading, error, getSkills } = useSkillsService()
  const skills = ref<SkillCategory[]>([])

  const updateSkills = async () => {
    const data = await getSkills()
    skills.value = data.skills
  }

  onMounted(async () => {
    await updateSkills()
  })

  return {
    skills,
    loading,
    error,
    updateSkills
  }
}
