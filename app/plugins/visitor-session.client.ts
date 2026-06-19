import { useVisitorSession } from "@docs/composables/nav/useVisitorSession"
import { parseVisitCookie } from "@docs/utils/nav/visitorSession"
import { VISITOR_STATE_KEY, VISITOR_VISIT_COOKIE } from "@docs/constants"

export default defineNuxtPlugin({
  name: "visitor-session",
  enforce: "pre",
  setup() {
    const visitCookie = useCookie<string | null>(VISITOR_VISIT_COOKIE)

    useState(VISITOR_STATE_KEY, () => parseVisitCookie(visitCookie.value) !== null)

    const { finalizeSession } = useVisitorSession()

    const onSessionEnd = () => {
      finalizeSession()
    }

    window.addEventListener("pagehide", onSessionEnd)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        onSessionEnd()
      }
    })
  }
})
