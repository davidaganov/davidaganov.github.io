const COOKIE_NAME = "cookie_consent"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export type CookieConsentStatus = "accepted" | "declined" | null

export const useCookieConsent = () => {
  const consentCookie = useCookie<CookieConsentStatus>(COOKIE_NAME, {
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    default: () => null
  })

  const isDecided = computed(() => consentCookie.value !== null)
  const isAccepted = computed(() => consentCookie.value === "accepted")

  const accept = () => {
    consentCookie.value = "accepted"
  }

  const decline = () => {
    consentCookie.value = "declined"
  }

  return {
    consent: consentCookie,
    isDecided,
    isAccepted,
    accept,
    decline
  }
}
