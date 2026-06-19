import { parseVisitCookie, serializeVisitCookie } from "@docs/utils/nav/visitorSession"
import { VISITOR_STATE_KEY, VISITOR_VISIT_COOKIE } from "@docs/constants"

export const useVisitorSession = () => {
  const visitCookie = useCookie<string | null>(VISITOR_VISIT_COOKIE, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax"
  })

  const hadBaselineAtSessionStart = useState<boolean>(VISITOR_STATE_KEY, () => false)

  const lastVisitAt = computed(() => {
    if (!hadBaselineAtSessionStart.value) return null
    return parseVisitCookie(visitCookie.value)?.lastVisitAt ?? null
  })

  const canShowHighlights = computed(() => {
    return hadBaselineAtSessionStart.value && lastVisitAt.value !== null
  })

  const finalizeSession = () => {
    visitCookie.value = serializeVisitCookie(Date.now())
  }

  return {
    hadBaselineAtSessionStart,
    lastVisitAt,
    canShowHighlights,
    finalizeSession
  }
}
