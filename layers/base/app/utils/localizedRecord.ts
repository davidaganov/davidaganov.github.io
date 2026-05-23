import { z } from "zod"
import { DEFAULT_LOCALE } from "@app/utils/seo"
import { normalizeSiteLocale } from "@base/utils/siteLocale"
import { getSiteLocaleCodes, isSiteLocaleCode } from "@app/constants/siteLocaleCodes"
import type { LocalizedFlexible, LocalizedRecord } from "@base/types"

const localeString = z.string().min(1)

const isLocaleLikeKey = (key: string): boolean => /^[a-z]{2}(-[a-z]{2})?$/i.test(key)

const hasAnyLocaleValue = (value: Record<string, string>): boolean => {
  return getSiteLocaleCodes().some((code) => Boolean(value[code]?.trim()))
}

const hasEveryLocaleValue = (value: Record<string, string>): boolean => {
  return getSiteLocaleCodes().every((code) => Boolean(value[code]?.trim()))
}

const onlyStrictLocaleKeys = (value: Record<string, string>): boolean => {
  return Object.keys(value).every(isSiteLocaleCode)
}

const onlyLocaleLikeKeys = (value: Record<string, string>): boolean => {
  return Object.keys(value).every(isLocaleLikeKey)
}

export const localizedRecordSchema: z.ZodType<LocalizedRecord> = z
  .record(z.string(), localeString)
  .refine(onlyStrictLocaleKeys, { message: "localized record has unknown locale keys" })
  .refine(hasEveryLocaleValue, {
    message: "localized record must include every site locale"
  })

export const localizedPartialSchema = z
  .record(z.string(), localeString)
  .refine(onlyLocaleLikeKeys, { message: "localized value has invalid locale keys" })
  .refine(hasAnyLocaleValue, { message: "localized value needs at least one site locale" })

export const localizedFlexibleSchema = z.union([
  localeString,
  localizedRecordSchema,
  localizedPartialSchema
])

const pickFromRecord = (locale: string, value: Record<string, string | undefined>): string => {
  const direct = value[locale]?.trim()
  if (direct) return direct

  const defaultLocale = DEFAULT_LOCALE
  const fallback = value[defaultLocale]?.trim()
  if (fallback) return fallback

  for (const code of getSiteLocaleCodes()) {
    const text = value[code]?.trim()
    if (text) return text
  }

  for (const text of Object.values(value)) {
    const trimmed = text?.trim()
    if (trimmed) return trimmed
  }

  return ""
}

export const resolveLocalized = (locale: string, value: LocalizedFlexible): string => {
  if (typeof value === "string") return value
  return pickFromRecord(normalizeSiteLocale(locale), value)
}

export const pickLocalized = (locale: string, value: LocalizedRecord): string => {
  return pickFromRecord(normalizeSiteLocale(locale), value)
}

export const pickRecordByLocale = <T>(locale: string, record: Record<string, T | undefined>): T => {
  const code = normalizeSiteLocale(locale)
  const direct = record[code]
  if (direct !== undefined) return direct

  const fallback = record[DEFAULT_LOCALE]
  if (fallback !== undefined) return fallback

  for (const siteCode of getSiteLocaleCodes()) {
    const value = record[siteCode]
    if (value !== undefined) return value
  }

  for (const value of Object.values(record)) {
    if (value !== undefined) return value
  }

  throw new Error("localized record has no value for any site locale")
}
