import { getSiteLocaleCodes } from "@app/constants/siteLocaleCodes"

const stripHtml = (value: string): string => {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const resolveLocalized = (
  locale: string,
  value: string | Record<string, string> | undefined
): string => {
  if (!value) return ""
  if (typeof value === "string") return stripHtml(value)
  return stripHtml(value[locale] ?? value.en ?? Object.values(value)[0] ?? "")
}

const collectLocalizedStrings = (locale: string, value: unknown, parts: string[]): void => {
  if (!value) return
  if (typeof value === "string") {
    parts.push(stripHtml(value))
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) collectLocalizedStrings(locale, item, parts)
    return
  }

  if (typeof value !== "object") return

  const record = value as Record<string, unknown>
  if (getSiteLocaleCodes().some((code) => code in record)) {
    parts.push(resolveLocalized(locale, record as Record<string, string>))
    return
  }

  for (const child of Object.values(record)) {
    collectLocalizedStrings(locale, child, parts)
  }
}

export const extractResumeSearchText = (
  locale: string,
  resume: Record<string, unknown>
): string => {
  const parts: string[] = []
  const localeContent = resume[locale]

  if (localeContent && typeof localeContent === "object") {
    const content = localeContent as Record<string, unknown>
    if (typeof content.role === "string") parts.push(content.role)
    if (typeof content.summary === "string") parts.push(content.summary)
  }

  collectLocalizedStrings(locale, resume.employment, parts)
  collectLocalizedStrings(locale, resume.experience, parts)

  if (Array.isArray(resume.skills)) {
    for (const skill of resume.skills) {
      if (
        skill &&
        typeof skill === "object" &&
        typeof (skill as { name?: string }).name === "string"
      ) {
        parts.push((skill as { name: string }).name)
      }
    }
  }

  return [...new Set(parts.map((part) => part.trim()).filter(Boolean))].join(" ")
}
