import { VISITOR_ID_COOKIE } from "@docs/constants/navHighlight.constant"

export const useVisitorId = () => {
  const visitorCookie = useCookie<string | null>(VISITOR_ID_COOKIE, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax"
  })

  if (import.meta.client && !visitorCookie.value) {
    visitorCookie.value = crypto.randomUUID()
  }

  const visitorId = computed(() => visitorCookie.value || "")

  return { visitorId }
}
