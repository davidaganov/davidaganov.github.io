import {
  RSS_COLLECTION_LABEL_KEYS,
  RSS_CONTENT_PATH_PREFIXES,
  RSS_EXCLUDED_PATH_SEGMENT,
  RSS_FEED_FILENAME
} from "../constants/rss.contstant"
import type { RssChannelMeta, RssContentPathMeta, RssPostItem, RssSiteLinks } from "../types"
import { absoluteUrl, DEFAULT_LOCALE, localizedPath, normalizeSiteUrl } from "./seo"

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
