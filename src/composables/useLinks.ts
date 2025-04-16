import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useLinksService } from "@/services/linksService"
import { LINKS_MODE } from "@/enums/linksModeEnum"
import type { Link } from "@/interfaces"

export const useLinks = () => {
  const route = useRoute()
  const router = useRouter()

  const { getLinks } = useLinksService()

  const mode = ref<LINKS_MODE>(LINKS_MODE.PROFESSIONAL)
  const links = ref<Link[]>()

  const linksProfessional = ref<Link[]>([])
  const linksPersonal = ref<Link[]>([])

  const updateLinks = async () => {
    try {
      const linksData = await getLinks()

      linksProfessional.value = linksData?.professional || []
      linksPersonal.value = linksData?.personal || []

      links.value = getLinkSets(mode.value)
    } catch (error) {
      console.error("Error loading links:", error)
    }
  }

  const getLinkSets = (mode: LINKS_MODE) => {
    switch (mode) {
      case LINKS_MODE.PROFESSIONAL:
        return linksProfessional.value
      case LINKS_MODE.PERSONAL:
        return linksPersonal.value
    }
  }

  const setMode = (newMode: LINKS_MODE) => {
    mode.value = newMode
    links.value = getLinkSets(newMode)
  }

  const toggleMode = (newMode: LINKS_MODE) => {
    setMode(newMode)

    router.replace({
      query: {
        ...route.query,
        mode: newMode
      }
    })
  }

  const initLinks = () => {
    updateLinks()

    const urlMode = route.query.mode as LINKS_MODE
    if (urlMode && Object.values(LINKS_MODE).includes(urlMode)) {
      setMode(urlMode)
    } else {
      setMode(LINKS_MODE.PROFESSIONAL)
    }
  }

  onMounted(() => {
    initLinks()
  })

  return {
    mode,
    links,
    toggleMode,
    updateLinks
  }
}
