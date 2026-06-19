interface VisitCookiePayload {
  v: 1
  lastVisitAt: number
}

export const parseVisitCookie = (raw: string | null | undefined): VisitCookiePayload | null => {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<VisitCookiePayload>
    if (parsed?.v === 1 && typeof parsed.lastVisitAt === "number") {
      return { v: 1, lastVisitAt: parsed.lastVisitAt }
    }
  } catch {
    return null
  }
  return null
}

export const serializeVisitCookie = (lastVisitAt: number): string => {
  return JSON.stringify({ v: 1, lastVisitAt } satisfies VisitCookiePayload)
}
