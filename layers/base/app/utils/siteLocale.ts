import { DEFAULT_LOCALE } from "@app/utils/seo"
import { getSiteLocaleCodes } from "@base/constants/siteLocaleCodes"

export const normalizeSiteLocale = (code: string): string => {
  const codes = getSiteLocaleCodes()
  return codes.includes(code) ? code : DEFAULT_LOCALE
}

const usesRussianFormatting = (locale: string): boolean => locale === "ru"

export const formatResumeMonthYear = (yearMonth: string, locale: string): string => {
  const [yearStr, monthStr] = yearMonth.split("-")
  const year = Number(yearStr)
  const month = Number(monthStr)

  if (usesRussianFormatting(locale)) {
    return `${String(month).padStart(2, "0")}.${year}`
  }

  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(
    new Date(year, month - 1)
  )
}

const PRESENT_LABELS: Record<string, string> = {
  ru: "н.в.",
  en: "present"
}

export const formatResumePresentLabel = (locale: string): string => {
  return PRESENT_LABELS[locale] ?? PRESENT_LABELS[DEFAULT_LOCALE] ?? ""
}

const ruPlural = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

export const formatResumeDuration = (totalMonths: number, locale: string): string => {
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (!usesRussianFormatting(locale)) {
    const parts: string[] = []
    if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`)
    if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`)
    return parts.join(" ") || "1 month"
  }

  const parts: string[] = []
  if (years > 0) parts.push(`${years} ${ruPlural(years, "год", "года", "лет")}`)
  if (months > 0) parts.push(`${months} ${ruPlural(months, "месяц", "месяца", "месяцев")}`)
  return parts.join(" ") || "1 месяц"
}
