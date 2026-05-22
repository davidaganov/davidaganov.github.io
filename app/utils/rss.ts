import Database from "better-sqlite3"
import { existsSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { joinURL } from "ufo"
import { ROUTE_PATH } from "../../layers/base/app/types"
import { getLocaleCodes } from "../config/locales"
import {
  RSS_COLLECTION_LABEL_KEYS,
  RSS_CONTENT_PATH_PREFIXES,
  RSS_EXCLUDED_PATH_SEGMENT,
  RSS_FEED_FILENAME
} from "../constants/rss.contstant"
import type {
  BuildRssFeedFileOptions,
  ContentRssEntry,
  ContentRssPrerenderRow,
  DocsRssOgImageInput,
  RssChannelMeta,
  RssContentPathMeta,
  RssPostItem,
  RssSiteLinks
} from "../types"
import {
  absoluteUrl,
  DEFAULT_LOCALE,
  localePathPrefix,
  localizedPath,
  normalizeSiteUrl
} from "./seo"

const rootDir = fileURLToPath(new URL("../..", import.meta.url))
const sqlitePath = `${rootDir}/.data/content/contents.sqlite`
const i18nDir = `${rootDir}/i18n/locales`

interface OgImageUrlResult {
  url: string
  hash?: string
}

type BuildOgImageUrlFn = (
  options: Record<string, unknown>,
  extension?: string,
  isStatic?: boolean,
  defaults?: Record<string, unknown>,
  secret?: string
) => OgImageUrlResult

const ogRequire = createRequire(import.meta.url)
const { buildOgImageUrl } = ogRequire(
  join(process.cwd(), "node_modules/nuxt-og-image/dist/runtime/shared/urlEncoding.js")
) as { buildOgImageUrl: BuildOgImageUrlFn }

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

const loadTranslator = (locale: string): ((key: string) => string) => {
  const messages = JSON.parse(readFileSync(`${i18nDir}/${locale}.json`, "utf8")) as Record<
    string,
    unknown
  >
  return (key: string) => resolveKey(messages, key)
}

const toPublicArticlePath = (contentPath: string): string => {
  const normalized = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  return `${ROUTE_PATH.DOCS}${normalized}`
}

export const getRssFeedPublicPath = (locale: string, defaultLocale = DEFAULT_LOCALE): string => {
  const path = `/${RSS_FEED_FILENAME}`
  return localizedPath(locale, path, defaultLocale)
}

export const isRssEligibleContentPath = (contentPath: string): boolean => {
  const path = contentPath.startsWith("/") ? contentPath : `/${contentPath}`

  if (path.includes(RSS_EXCLUDED_PATH_SEGMENT)) return false
  if (!RSS_CONTENT_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) return false

  const segments = path.split("/").filter(Boolean)
  return segments.length >= 3
}

export const getRssContentPathMeta = (contentPath: string): RssContentPathMeta | null => {
  const path = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  const segments = path.split("/").filter(Boolean)

  if (segments.length < 3) return null

  const sectionId = segments[0] || ""
  const collectionSource = segments[1] || ""
  const labelKeys = RSS_COLLECTION_LABEL_KEYS[`${sectionId}/${collectionSource}`]

  if (!labelKeys) return null

  return {
    sectionId,
    collectionSource,
    sectionLabelKey: labelKeys.sectionLabelKey,
    collectionLabelKey: labelKeys.collectionLabelKey
  }
}

export const getStaticOgImagePath = (
  pagePath: string,
  options: Record<string, unknown>
): string => {
  const result = buildOgImageUrl({ ...options, _path: pagePath }, "png", true, {}, undefined)
  return joinURL("/", result.url)
}

export const getDocsRssOgImageUrl = (siteUrl: string, input: DocsRssOgImageInput): string => {
  const path = getStaticOgImagePath(input.pagePath, {
    component: "DocsPage",
    extension: "png",
    width: 1200,
    height: 630,
    title: input.title,
    description: input.description,
    section: input.section,
    collection: input.collection
  })

  return absoluteUrl(siteUrl, path)
}

export const getHomeRssOgImageUrl = (
  siteUrl: string,
  pagePath: string,
  title: string,
  description: string
): string => {
  const path = getStaticOgImagePath(pagePath, {
    component: "HomePage",
    extension: "png",
    width: 1200,
    height: 630,
    title,
    description
  })

  return absoluteUrl(siteUrl, path)
}

const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export const buildRssItemSummaryHtml = (item: RssPostItem): string => {
  const parts = [`<p>${escapeHtml(item.description)}</p>`]

  if (item.readingTime) {
    parts.push(`<p><em>${escapeHtml(item.readingTime)}</em></p>`)
  }

  return parts.join("")
}

export const buildRssItemContentHtml = (item: RssPostItem): string => {
  const parts: string[] = []

  if (item.imageUrl) {
    parts.push(
      `<figure><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" width="1200" height="630" /></figure>`
    )
  }

  parts.push(buildRssItemSummaryHtml(item))

  if (item.tags?.length) {
    parts.push(`<p>${item.tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join(" ")}</p>`)
  }

  parts.push(`<p><a href="${escapeHtml(item.link)}">${escapeHtml(item.title)}</a></p>`)

  return parts.join("\n")
}

export const toRfc822Date = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return new Date().toUTCString()
  return date.toUTCString()
}

const buildRssItemXml = (item: RssPostItem): string => {
  const summaryHtml = buildRssItemSummaryHtml(item)
  const contentHtml = item.contentHtml || buildRssItemContentHtml(item)
  const mediaBlock = item.imageUrl
    ? `      <media:content url="${escapeXml(item.imageUrl)}" medium="image" type="image/png" />
      <media:thumbnail url="${escapeXml(item.imageUrl)}" />`
    : ""
  const categoryBlock = item.category
    ? `      <category>${escapeXml(item.category)}</category>`
    : ""

  return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${summaryHtml}]]></description>
${mediaBlock}
${categoryBlock}
      <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
    </item>`
}

export const buildRssXml = (channel: RssChannelMeta, items: RssPostItem[]): string => {
  const itemXml = items.map(buildRssItemXml).join("\n")
  const channelImageBlock = channel.imageUrl
    ? `    <image>
      <url>${escapeXml(channel.imageUrl)}</url>
      <title>${escapeXml(channel.title)}</title>
      <link>${escapeXml(channel.link)}</link>
      <width>1200</width>
      <height>630</height>
    </image>`
    : ""

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.link)}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>${escapeXml(channel.language)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml" />
${channelImageBlock}
${itemXml}
  </channel>
</rss>`
}

export const getRssSiteLinks = (
  siteUrl: string,
  locale: string,
  defaultLocale = DEFAULT_LOCALE
): RssSiteLinks => {
  const base = normalizeSiteUrl(siteUrl)
  return {
    feedUrl: absoluteUrl(base, getRssFeedPublicPath(locale, defaultLocale)),
    articlesIndexUrl: absoluteUrl(base, localizedPath(locale, "/docs", defaultLocale))
  }
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
        toPublicArticlePath(contentPath),
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
      const imageUrl =
        seoImageOverride ||
        getDocsRssOgImageUrl(siteUrl, {
          pagePath: localizedPublicPath,
          title,
          description,
          section: sectionLabel,
          collection: collectionLabel
        })

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

const loadRssItemsFromSqlite = (locale: string, siteUrl: string): RssPostItem[] => {
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
    .all() as ContentRssEntry[]
  db.close()

  return contentEntriesToRssItems(entries, locale, siteUrl, loadTranslator(locale))
}

export const buildRssFeedXml = (options: BuildRssFeedFileOptions): string => {
  const siteUrl = normalizeSiteUrl(options.siteUrl)
  const { feedUrl, articlesIndexUrl } = getRssSiteLinks(siteUrl, options.locale, DEFAULT_LOCALE)
  const items = loadRssItemsFromSqlite(options.locale, siteUrl)
  const channelImageUrl = getHomeRssOgImageUrl(
    siteUrl,
    localizedPath(options.locale, ROUTE_PATH.HOME, DEFAULT_LOCALE),
    options.channelTitle,
    options.channelDescription
  )

  return buildRssXml(
    {
      title: options.channelTitle,
      description: options.channelDescription,
      link: articlesIndexUrl,
      language: options.locale,
      feedUrl,
      imageUrl: channelImageUrl
    },
    items
  )
}

const ogPathsForLocale = (locale: string): string[] => {
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

  const rows = db
    .prepare(`SELECT path, title, description FROM ${table}`)
    .all() as ContentRssPrerenderRow[]
  db.close()

  const t = loadTranslator(locale)
  const paths = new Set<string>()

  for (const row of rows) {
    const contentPath = String(row.path || "")
    if (!isRssEligibleContentPath(contentPath)) continue

    const pathMeta = getRssContentPathMeta(contentPath)
    const publicPath = localizedPath(locale, toPublicArticlePath(contentPath), DEFAULT_LOCALE)
    const sectionLabel = pathMeta ? t(pathMeta.sectionLabelKey) : t("docs.seo.defaultSection")
    const collectionLabel = pathMeta ? t(pathMeta.collectionLabelKey) : ""

    paths.add(
      getStaticOgImagePath(publicPath, {
        component: "DocsPage",
        extension: "png",
        width: 1200,
        height: 630,
        title: String(row.title || ""),
        description: String(row.description || ""),
        section: sectionLabel,
        collection: collectionLabel
      })
    )
  }

  const prefix = localePathPrefix(locale)
  paths.add(
    getStaticOgImagePath(prefix || "/", {
      component: "HomePage",
      extension: "png",
      width: 1200,
      height: 630,
      title: t("layout.rss.feedTitle"),
      description: t("layout.rss.feedDescription")
    })
  )

  return [...paths]
}

export const getRssOgPrerenderRoutes = (): string[] => {
  if (!existsSync(sqlitePath)) return []

  return Array.from(new Set(getLocaleCodes().flatMap((locale) => ogPathsForLocale(locale))))
}
