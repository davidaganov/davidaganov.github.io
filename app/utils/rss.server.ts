import Database from "better-sqlite3"
import { existsSync } from "node:fs"
import type { ArticleMeta } from "@docs/types"
import type { ContentRssEntry, RssAssetChannel, RssAssetFile, RssPostItem } from "../types"
import {
  buildRssItemContentHtml,
  buildRssXml,
  getDocsOgImagePublicPath,
  getFeedChannelOgImagePublicPath,
  getRssSiteLinks,
  isRssEligibleContentPath,
  toRfc822Date
} from "./rss"
import { resolveRssEntryCategories } from "./rss-labels"
import { absoluteUrl, DEFAULT_LOCALE, localizedPath, normalizeSiteUrl } from "./seo"

interface ContentEntriesToRssItemsOptions {
  translate?: (key: string) => string
}

const sqlitePath = `${process.cwd()}/.data/content/contents.sqlite`

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

const absoluteImageUrl = (siteUrl: string, value: string): string => {
  return /^https?:\/\//i.test(value) ? value : absoluteUrl(siteUrl, value)
}

export const getDocsRssOgImageUrl = (
  siteUrl: string,
  options: {
    title: string
    description: string
    section: string
    collection?: string
  }
): string => {
  return absoluteUrl(siteUrl, getDocsOgImagePublicPath(options))
}

export const getHomeRssOgImageUrl = (
  siteUrl: string,
  options: {
    title: string
    description: string
  }
): string => {
  return absoluteUrl(siteUrl, getFeedChannelOgImagePublicPath(options))
}

export const contentEntriesToRssItems = (
  entries: ContentRssEntry[],
  locale: string,
  siteUrl: string,
  creator: string,
  options?: ContentEntriesToRssItemsOptions
): RssPostItem[] => {
  const translate = options?.translate

  return entries
    .filter((entry) => {
      const path = String(entry.path || "")
      if (!Boolean(entry.meta?.publishedAt)) return false
      return isRssEligibleContentPath(path)
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
      const tagLabels = entry.meta?.tags?.map((tag) => tag.trim()).filter(Boolean) ?? []
      const categories = entry.rssCategories?.length
        ? entry.rssCategories
        : translate
          ? resolveRssEntryCategories(entry, translate)
          : []
      const [section, collection] = categories
      const seoImageOverride =
        nonEmptyString(entry.seo?.ogImage) || nonEmptyString(entry.seo?.image)
      const imageUrl = seoImageOverride
        ? absoluteImageUrl(siteUrl, seoImageOverride)
        : getDocsRssOgImageUrl(siteUrl, {
            title,
            description,
            section: section || "",
            collection
          })

      const publishedAt = String(entry.meta?.publishedAt || "")

      const item: RssPostItem = {
        title,
        description,
        link,
        pubDate: toRfc822Date(publishedAt, contentPath),
        guid: link,
        publishedAt,
        docPath: localizedPublicPath,
        imageUrl,
        categories,
        creator,
        tags: tagLabels.length ? tagLabels : undefined
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

export const parseRssAssetPayload = (data: unknown): RssAssetFile | null => {
  if (!data || typeof data !== "object") return null

  const payload = data as Record<string, unknown>
  const entries = Array.isArray(payload.entries) ? (payload.entries as ContentRssEntry[]) : null
  const channel = payload.channel

  if (!entries || !channel || typeof channel !== "object") return null

  const { title, description, creator } = channel as Record<string, unknown>
  if (typeof title !== "string" || typeof description !== "string" || typeof creator !== "string") {
    return null
  }

  return {
    channel: { title, description, creator } satisfies RssAssetChannel,
    entries
  }
}

export const buildRssFeedXml = (locale: string, siteUrl: string, asset: RssAssetFile): string => {
  const base = normalizeSiteUrl(siteUrl)
  const { feedUrl, articlesIndexUrl } = getRssSiteLinks(base, locale, DEFAULT_LOCALE)
  const items = contentEntriesToRssItems(asset.entries, locale, base, asset.channel.creator)
  const channelImageUrl = getHomeRssOgImageUrl(base, {
    title: asset.channel.title,
    description: asset.channel.description
  })

  return buildRssXml(
    {
      title: asset.channel.title,
      description: asset.channel.description,
      link: articlesIndexUrl,
      language: locale,
      feedUrl,
      imageUrl: channelImageUrl
    },
    items
  )
}
