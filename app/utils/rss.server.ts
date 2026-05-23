import Database from "better-sqlite3"
import { existsSync, readFileSync } from "node:fs"
import type { ArticleMeta } from "@docs/types"
import type { ContentRssEntry, RssPostItem } from "../types"
import {
  buildRssItemContentHtml,
  getDocsOgImagePublicPath,
  getFeedChannelOgImagePublicPath,
  getRssContentPathMeta,
  isRssEligibleContentPath,
  toRfc822Date
} from "./rss"
import { absoluteUrl, DEFAULT_LOCALE, localizedPath } from "./seo"

const sqlitePath = `${process.cwd()}/.data/content/contents.sqlite`
const i18nDir = `${process.cwd()}/i18n/locales`

const parseJsonColumn = <T>(value: unknown): T | null => {
  if (value == null || value === "") return null
  if (typeof value === "object") return value as T
  if (typeof value !== "string") return null

  try {
    const parsed = JSON.parse(value) as T
    return parsed && typeof parsed === "object" ? parsed : null
  } catch {
    return null
  }
}

const mapSqliteRssEntry = (row: Record<string, unknown>): ContentRssEntry => ({
  title: row.title as string | null | undefined,
  description: row.description as string | null | undefined,
  path: row.path as string | null | undefined,
  meta: parseJsonColumn<ArticleMeta>(row.meta),
  seo: parseJsonColumn<ContentRssEntry["seo"]>(row.seo)
})

const nonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined
  return value.trim().length ? value : undefined
}

const resolveKey = (messages: Record<string, unknown>, key: string): string => {
  const value = key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[part]
    }
    return undefined
  }, messages)

  return typeof value === "string" ? value : key
}

export const loadTranslator = (locale: string): ((key: string) => string) => {
  const messages = JSON.parse(readFileSync(`${i18nDir}/${locale}.json`, "utf8")) as Record<
    string,
    unknown
  >
  return (key: string) => resolveKey(messages, key)
}

export const getDocsRssOgImageUrl = (
  siteUrl: string,
  locale: string,
  contentPath: string
): string => {
  return absoluteUrl(siteUrl, getDocsOgImagePublicPath(locale, contentPath))
}

export const getHomeRssOgImageUrl = (siteUrl: string, locale: string): string => {
  return absoluteUrl(siteUrl, getFeedChannelOgImagePublicPath(locale))
}

export const contentEntriesToRssItems = (
  entries: ContentRssEntry[],
  locale: string,
  siteUrl: string,
  t: (key: string) => string
): RssPostItem[] => {
  return entries
    .filter((entry) => {
      const path = String(entry.path || "")
      return isRssEligibleContentPath(path) && Boolean(entry.meta?.publishedAt)
    })
    .sort((a, b) => {
      const dateA = new Date(a.meta?.publishedAt || 0).getTime()
      const dateB = new Date(b.meta?.publishedAt || 0).getTime()
      return dateB - dateA
    })
    .map((entry) => {
      const contentPath = String(entry.path || "")
      const localizedPublicPath = localizedPath(
        locale,
        `/docs${contentPath.startsWith("/") ? contentPath : `/${contentPath}`}`,
        DEFAULT_LOCALE
      )
      const link = absoluteUrl(siteUrl, localizedPublicPath)
      const title = String(entry.title || "")
      const description = String(entry.description || "")
      const pathMeta = getRssContentPathMeta(contentPath)
      const sectionLabel = pathMeta ? t(pathMeta.sectionLabelKey) : t("docs.seo.defaultSection")
      const collectionLabel = pathMeta ? t(pathMeta.collectionLabelKey) : ""
      const category = collectionLabel ? `${sectionLabel} / ${collectionLabel}` : sectionLabel
      const seoImageOverride =
        nonEmptyString(entry.seo?.ogImage) || nonEmptyString(entry.seo?.image)
      const imageUrl = seoImageOverride || getDocsRssOgImageUrl(siteUrl, locale, contentPath)

      const item: RssPostItem = {
        title,
        description,
        link,
        pubDate: toRfc822Date(String(entry.meta?.publishedAt)),
        guid: link,
        imageUrl,
        category,
        readingTime: nonEmptyString(entry.meta?.readingTime),
        tags: entry.meta?.tags?.filter((tag) => Boolean(tag?.trim()))
      }

      item.contentHtml = buildRssItemContentHtml(item)
      return item
    })
}

export const loadRssContentEntriesFromSqlite = (locale: string): ContentRssEntry[] => {
  if (!existsSync(sqlitePath)) return []

  const db = new Database(sqlitePath, { readonly: true })
  const table = `_content_content_${locale}`
  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
    .get(table)

  if (!tableExists) {
    db.close()
    return []
  }

  const entries = db
    .prepare(`SELECT title, description, path, meta, seo FROM ${table}`)
    .all()
    .map((row) => mapSqliteRssEntry(row as Record<string, unknown>))
  db.close()

  return entries
}
