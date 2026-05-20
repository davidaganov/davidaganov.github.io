import {
  formatResumeDuration,
  formatResumeMonthYear,
  formatResumePresentLabel,
  normalizeSiteLocale
} from "@base/utils/siteLocale"
import type { ResumeExperienceDates } from "@base/types"

const parseYearMonth = (value: string): { year: number; month: number } => {
  const [yearStr, monthStr] = value.split("-")
  return { year: Number(yearStr), month: Number(monthStr) }
}

const getEndYearMonth = (end: string | null): { year: number; month: number } => {
  if (!end) {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }
  return parseYearMonth(end)
}

export const getExperienceMonths = (dates: ResumeExperienceDates): number => {
  const start = parseYearMonth(dates.start)
  const end = getEndYearMonth(dates.end)
  const months = (end.year - start.year) * 12 + (end.month - start.month)
  return Math.max(months, 1)
}

export const formatExperiencePeriod = (dates: ResumeExperienceDates, locale: string): string => {
  const code = normalizeSiteLocale(locale)
  const startLabel = formatResumeMonthYear(dates.start, code)
  const endLabel = dates.end
    ? formatResumeMonthYear(dates.end, code)
    : formatResumePresentLabel(code)

  return `${startLabel} — ${endLabel}`
}

export const formatExperienceDuration = (dates: ResumeExperienceDates, locale: string): string => {
  return formatResumeDuration(getExperienceMonths(dates), normalizeSiteLocale(locale))
}
