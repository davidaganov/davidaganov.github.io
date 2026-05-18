import type { ContentLocale } from "@docs/types"

export const CONTENT_LOCALES = ["ru", "en"] as const

export const isContentLocale = (value: string): value is ContentLocale => {
  return (CONTENT_LOCALES as readonly string[]).includes(value)
}
