import { joinURL } from "ufo"
import { ROUTE_PATH } from "../../layers/base/app/types"
import {
  RSS_CHANNEL_IMAGE_HEIGHT,
  RSS_CHANNEL_IMAGE_WIDTH,
  RSS_COLLECTION_LABEL_KEYS,
  RSS_CONTENT_PATH_PREFIXES,
  RSS_FEED_FILENAME
} from "../constants/rss.contstant"
import type {
  ContentRssEntry,
  RssChannelMeta,
  RssContentPathMeta,
  RssFeedUrls,
  RssPostItem,
  RssSiteLinks
} from "../types"
import { resolveRssEntryCategories } from "./rss-labels"
import { absoluteUrl, DEFAULT_LOCALE, localizedPath, normalizeSiteUrl } from "./seo"

const NUXT_SEO_OG_STATIC_PREFIX = "/_og/d"
const OG_IMAGE_COMPONENT_DOCS_PAGE = "DocsPage"
const OG_IMAGE_COMPONENT_HOME_PAGE = "HomePage"

interface OgImageUrlOptions {
  component: string
  title?: string
  description?: string
  section?: string
  collection?: string
}

const OG_IMAGE_PARAM_ALIASES: Record<string, string> = {
  component: "c"
}

const MAX_OG_PUBLIC_PATH_LENGTH = 255
const STRICT_OG_SIGNATURE_SUFFIX_LENGTH = 20

const pathSegmentNormalized = (pagePath: string): string => {
  return pagePath.startsWith("/") ? pagePath : `/${pagePath}`
}

const truncateText = (value: string, maxLength: number): string => {
  const trimmed = value.trim()
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`
}

const toBase64Url = (value: string): string => {
  const bytes = new TextEncoder().encode(value)
  let binary = ""

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "~")
}

const estimateStrictOgPathOverhead = (pagePath?: string): number => {
  const pathSegment = pagePath?.trim()
    ? `,p_${toBase64Url(JSON.stringify(pathSegmentNormalized(pagePath)))}`
    : ""

  return pathSegment.length + STRICT_OG_SIGNATURE_SUFFIX_LENGTH + 2
}

const encodeOgImageValue = (value: string): string => {
  const escaped = value.startsWith("~") ? `~${value}` : value
  const encoded = encodeURIComponent(escaped.replace(/_/g, "__")).replace(/%20/g, "+")
  const hasNonAscii = [...value].some((char) => char.charCodeAt(0) > 127)

  return encoded.includes("%") || hasNonAscii ? `~${toBase64Url(value)}` : encoded
}

const buildOgImagePublicPath = (options: OgImageUrlOptions): string => {
  const params = Object.entries(options)
    .filter(([, value]) => typeof value === "string" && value.trim().length)
    .map(([key, value]) => {
      const alias = OG_IMAGE_PARAM_ALIASES[key] || key
      return `${alias}_${encodeOgImageValue(String(value))}`
    })
    .join(",")

  return joinURL(NUXT_SEO_OG_STATIC_PREFIX, `${params || "default"}.png`)
}

const fitOgImagePublicPath = (options: OgImageUrlOptions): string => {
  const path = buildOgImagePublicPath(options)
  if (path.length <= MAX_OG_PUBLIC_PATH_LENGTH) return path

  const description = options.description?.trim()
  if (!description) return path

  for (let maxLength = description.length - 1; maxLength > 0; maxLength -= 8) {
    const candidate = buildOgImagePublicPath({
      ...options,
      description: truncateText(description, maxLength)
    })
    if (candidate.length <= MAX_OG_PUBLIC_PATH_LENGTH) return candidate
  }

  return buildOgImagePublicPath({ ...options, description: undefined })
}

const getOgImagePublicPath = (options: OgImageUrlOptions): string => fitOgImagePublicPath(options)

const resolveOgImageDescription = (
  description: string,
  options: Omit<OgImageUrlOptions, "description"> & { pagePath?: string }
): string => {
  const trimmed = description.trim()
  if (!trimmed) return trimmed

  const maxPublicPathLength =
    MAX_OG_PUBLIC_PATH_LENGTH - estimateStrictOgPathOverhead(options.pagePath)

  for (let maxLength = trimmed.length; maxLength > 0; maxLength -= 8) {
    const candidate = truncateText(trimmed, maxLength)
    if (
      buildOgImagePublicPath({ ...options, description: candidate }).length <= maxPublicPathLength
    ) {
      return candidate
    }
  }

  return ""
}

export const resolveOgImageFields = (
  fields: OgImageUrlOptions & { pagePath?: string }
): Pick<OgImageUrlOptions, "title" | "description"> => {
  const title = fields.title?.trim() || ""
  const description = fields.description?.trim() || ""
  const maxPublicPathLength =
    MAX_OG_PUBLIC_PATH_LENGTH - estimateStrictOgPathOverhead(fields.pagePath)

  const fits = (next: OgImageUrlOptions): boolean =>
    buildOgImagePublicPath(next).length <= maxPublicPathLength

  const fittedDescription = resolveOgImageDescription(description, {
    component: fields.component,
    title,
    section: fields.section,
    collection: fields.collection,
    pagePath: fields.pagePath
  })

  if (
    fits({
      ...fields,
      title,
      description: fittedDescription
    })
  ) {
    return { title, description: fittedDescription }
  }

  for (let titleLength = title.length; titleLength > 0; titleLength -= 4) {
    const nextTitle = truncateText(title, titleLength)
    const nextDescription = resolveOgImageDescription(description, {
      component: fields.component,
      title: nextTitle,
      section: fields.section,
      collection: fields.collection,
      pagePath: fields.pagePath
    })

    if (
      fits({
        ...fields,
        title: nextTitle,
        description: nextDescription
      })
    ) {
      return { title: nextTitle, description: nextDescription }
    }
  }

  return {
    title: truncateText(title, 24),
    description: ""
  }
}

const getDocsOgImagePublicPath = (options: {
  title: string
  description: string
  section: string
  collection?: string
}): string => {
  return getOgImagePublicPath({
    component: OG_IMAGE_COMPONENT_DOCS_PAGE,
    title: options.title,
    description: options.description,
    section: options.section,
    collection: options.collection
  })
}

export const getFeedChannelOgImagePublicPath = (options: {
  title: string
  description: string
}): string => {
  return getOgImagePublicPath({
    component: OG_IMAGE_COMPONENT_HOME_PAGE,
    title: options.title,
    description: options.description
  })
}

const rssEntryHasCustomImage = (entry: ContentRssEntry): boolean => {
  const ogImage = entry.seo?.ogImage
  const image = entry.seo?.image
  return (
    (typeof ogImage === "string" && ogImage.trim().length > 0) ||
    (typeof image === "string" && image.trim().length > 0)
  )
}

export const getRssEntryOgImagePublicPath = (
  entry: ContentRssEntry,
  options: {
    categories?: string[]
    translate?: (key: string) => string
  } = {}
): string | null => {
  const path = String(entry.path || "")
  if (!entry.meta?.publishedAt) return null
  if (!isRssEligibleContentPath(path)) return null
  if (rssEntryHasCustomImage(entry)) return null

  const categories = options.categories?.length
    ? options.categories
    : options.translate
      ? resolveRssEntryCategories(entry, options.translate)
      : []
  const [section, collection] = categories

  const title = String(entry.title || "")
  const description = String(entry.description || "")

  return getDocsOgImagePublicPath({
    title,
    description: resolveOgImageDescription(description, {
      component: OG_IMAGE_COMPONENT_DOCS_PAGE,
      title,
      section: section || "",
      collection
    }),
    section: section || "",
    collection
  })
}

export const getRssFeedPublicPath = (locale: string, defaultLocale = DEFAULT_LOCALE): string => {
  return localizedPath(locale, `/${RSS_FEED_FILENAME}`, defaultLocale)
}

export const getFeedPagePublicPath = (locale: string, defaultLocale = DEFAULT_LOCALE): string => {
  return localizedPath(locale, ROUTE_PATH.FEED, defaultLocale)
}

export const isRssEligibleContentPath = (contentPath: string): boolean => {
  const path = contentPath.startsWith("/") ? contentPath : `/${contentPath}`

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

export const buildRssItemContentHtml = (item: RssPostItem): string => {
  const parts: string[] = []

  if (item.imageUrl) {
    parts.push(`<p><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" /></p>`)
  }

  parts.push(`<p>${escapeHtml(item.description)}</p>`)

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
  const plainDescription = String(item.description || "").trim()
  const contentHtml = item.contentHtml || buildRssItemContentHtml(item)
  const mediaBlock = item.imageUrl
    ? `      <media:content url="${escapeXml(item.imageUrl.trim())}" medium="image" type="image/png" />`
    : ""
  const categoryBlocks = (item.categories ?? [])
    .map((category) => `      <category>${escapeXml(category.trim())}</category>`)
    .join("\n")
  const creatorBlock = item.creator
    ? `      <dc:creator>${escapeXml(item.creator.trim())}</dc:creator>`
    : ""

  return `    <item>
      <title>${escapeXml(item.title.trim())}</title>
      <link>${escapeXml(item.link.trim())}</link>
      <guid isPermaLink="true">${escapeXml(item.guid.trim())}</guid>
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

export const getRssFeedUrls = (
  siteUrl: string,
  locale: string,
  defaultLocale = DEFAULT_LOCALE
): RssFeedUrls => {
  const base = normalizeSiteUrl(siteUrl)

  return {
    page: absoluteUrl(base, getFeedPagePublicPath(locale, defaultLocale)),
    rss: absoluteUrl(base, getRssFeedPublicPath(locale, defaultLocale))
  }
}

export const getRssReaderSubscribeUrl = (
  reader: "feedly" | "inoreader",
  feedUrl: string
): string => {
  const encoded = encodeURIComponent(feedUrl)

  if (reader === "feedly") {
    return `https://feedly.com/i/subscription/feed/${encoded}`
  }

  return `https://www.inoreader.com/?add_feed=${encoded}`
}
