import { absoluteUrl, DEFAULT_LOCALE, localizedPath, normalizeSiteUrl } from "@app/utils/seo"
import {
  RSS_CONTENT_PATH_PREFIXES,
  RSS_EXCLUDED_PATH_SEGMENT,
  RSS_FEED_FILENAME
} from "@app/constants/rss.contstant"
import type { RssChannelMeta, RssPostItem, RssSiteLinks } from "@app/types"

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

export const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export const toRfc822Date = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return new Date().toUTCString()
  return date.toUTCString()
}

export const buildRssXml = (channel: RssChannelMeta, items: RssPostItem[]): string => {
  const itemXml = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.link)}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>${escapeXml(channel.language)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml" />
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
