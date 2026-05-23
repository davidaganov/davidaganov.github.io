import { joinURL } from "ufo"
import {
  RSS_CHANNEL_IMAGE_HEIGHT,
  RSS_CHANNEL_IMAGE_WIDTH,
  RSS_COLLECTION_LABEL_KEYS,
  RSS_CONTENT_PATH_PREFIXES,
  RSS_EXCLUDED_PATH_SEGMENT,
  RSS_FEED_FILENAME
} from "../constants/rss.contstant"
import type { RssChannelMeta, RssContentPathMeta, RssPostItem, RssSiteLinks } from "../types"
import {
  absoluteUrl,
  DEFAULT_LOCALE,
  localePathPrefix,
  localizedPath,
  normalizeSiteUrl
} from "./seo"

const NUXT_SEO_OG_STATIC_PREFIX = "/_og/d"

export const getDocsOgImagePublicPath = (locale: string, contentPath: string): string => {
  const normalized = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  const localizedDocsPath = localizedPath(locale, `/docs${normalized}`, DEFAULT_LOCALE).replace(
    /^\//,
    ""
  )

  return joinURL(NUXT_SEO_OG_STATIC_PREFIX, localizedDocsPath, "og.png")
}

export const getFeedChannelOgImagePublicPath = (locale: string): string => {
  const prefix = localePathPrefix(locale).replace(/^\//, "")
  return prefix
    ? joinURL(NUXT_SEO_OG_STATIC_PREFIX, prefix, "og.png")
    : joinURL(NUXT_SEO_OG_STATIC_PREFIX, "og.png")
}

export const getRssFeedPublicPath = (locale: string, defaultLocale = DEFAULT_LOCALE): string => {
  return localizedPath(locale, `/${RSS_FEED_FILENAME}`, defaultLocale)
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

export const buildRssItemPlainDescription = (item: RssPostItem): string => {
  const parts = [item.description.trim()]

  if (item.readingTime) {
    parts.push(`(${item.readingTime})`)
  }

  return parts.filter(Boolean).join(" ")
}

export const buildRssItemContentHtml = (item: RssPostItem): string => {
  const parts: string[] = [`<p>${escapeHtml(item.description)}</p>`]

  if (item.readingTime) {
    parts.push(`<p><em>${escapeHtml(item.readingTime)}</em></p>`)
  }

  parts.push(`<p><a href="${escapeHtml(item.link)}">${escapeHtml(item.title)}</a></p>`)

  return parts.join("")
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const stableMinutesFromSeed = (seed: string): number => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return (hash % (24 * 60 - 1)) + 1
}

export const toRfc822Date = (value: string, stableSeed?: string): string => {
  const trimmed = value.trim()
  let date: Date

  if (DATE_ONLY_PATTERN.test(trimmed)) {
    date = new Date(`${trimmed}T00:00:00.000Z`)
    if (stableSeed) {
      date.setUTCMinutes(stableMinutesFromSeed(stableSeed))
    } else {
      date.setUTCHours(12)
    }
  } else {
    date = new Date(trimmed)
  }

  if (Number.isNaN(date.getTime())) return new Date().toUTCString()
  return date.toUTCString()
}

const buildRssItemXml = (item: RssPostItem): string => {
  const plainDescription = buildRssItemPlainDescription(item)
  const contentHtml = item.contentHtml || buildRssItemContentHtml(item)
  const mediaBlock = item.imageUrl
    ? `      <media:content url="${escapeXml(item.imageUrl)}" medium="image" type="image/png" />`
    : ""
  const categoryBlocks = (item.categories ?? [])
    .map((category) => `      <category>${escapeXml(category)}</category>`)
    .join("\n")
  const creatorBlock = item.creator
    ? `      <dc:creator><![CDATA[${item.creator}]]></dc:creator>`
    : ""

  return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${plainDescription}]]></description>
${mediaBlock}
${categoryBlocks}
${creatorBlock}
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
      <width>${RSS_CHANNEL_IMAGE_WIDTH}</width>
      <height>${RSS_CHANNEL_IMAGE_HEIGHT}</height>
    </image>`
    : ""

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
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
