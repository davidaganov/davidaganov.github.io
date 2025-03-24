import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { LINKS_MODE } from "@/enums/linksModeEnum"
import type { Link } from "@/interfaces"
import router from "@/router"

export const useLinks = () => {
  const { locale, t } = useI18n()
  const route = useRoute()

  const mode = ref<LINKS_MODE>(LINKS_MODE.PROFESSIONAL)
  const links = ref<Link[]>()

  const linksProfessional = ref<Link[]>([])
  const linksPersonal = ref<Link[]>([])

  const updateLinks = () => {
    linksProfessional.value = [
      {
        name: "GitHub",
        url: "https://github.com/davidaganov",
        icon: "mdi-github"
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/david-aganov/",
        icon: "mdi-linkedin"
      },
      {
        name: t("links.professional.email"),
        url: "mailto:davidaganov21@gmail.com",
        icon: "mdi-email"
      },
      {
        name: t("links.professional.telegram"),
        url: "https://t.me/davidaganov",
        icon: "mdi-send",
        customStyle: "transform: rotate(-30deg); margin: 0 0 8px 8px;"
      }
    ]

    linksPersonal.value = [
      {
        name: t("links.personal.telegram"),
        url: "https://t.me/davidaganov",
        icon: "mdi-send",
        customStyle: "transform: rotate(-30deg); margin: 0 0 8px 8px;"
      },
      {
        name: t("links.personal.telegramChannel"),
        url: "https://t.me/vueshn",
        icon: "mdi-send",
        customStyle: "transform: rotate(-30deg); margin: 0 0 8px 8px;"
      },
      {
        name: "Habr",
        url: "https://habr.com/ru/users/davidaganov/",
        icon: "mdi-newspaper-variant"
      },
      {
        name: "CodePen",
        url: "https://codepen.io/davidaganov",
        icon: "mdi-code-array"
      },
      {
        name: "Steam",
        url: "https://steamcommunity.com/id/davidaganov/",
        icon: "mdi-steam"
      }
    ]
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

  watch(locale, () => {
    updateLinks()
    links.value = getLinkSets(mode.value)
  })

  onMounted(() => {
    initLinks()
  })

  return {
    mode,
    links,
    toggleMode
  }
}
