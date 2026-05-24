import type { RssAssetChannel, RssFeedPageData, RssPostItem } from "../types"
import { getRssFeedUrls } from "./rss"
import { DEFAULT_LOCALE } from "./seo"

const readTag = (block: string, tag: string): string => {
  const cdata = block.match(
    new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i")
  )
  if (cdata?.[1]) return cdata[1].trim()

  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"))
  if (!plain?.[1]) return ""

  return plain[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim()
}

const readAllTags = (block: string, tag: string): string[] => {
  const values: string[] = []
  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi")
  let match = pattern.exec(block)

  while (match) {
    const value = match[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim()
    if (value) values.push(value)
    match = pattern.exec(block)
  }

  return values
}

const readMediaUrl = (block: string): string | undefined => {
  const match = block.match(/<media:(?:content|thumbnail)\b[^>]*\burl="([^"]+)"/i)
  return match?.[1]
}

const toDocPath = (link: string): string => {
  try {
    return new URL(link).pathname
  } catch {
    return link.startsWith("/") ? link : `/${link}`
  }
}

const toPublishedAt = (pubDate: string): string => {
  const date = new Date(pubDate)
  return Number.isNaN(date.getTime()) ? pubDate : date.toISOString()
}

export const parseRssFeedXml = (xml: string, locale: string, siteUrl: string): RssFeedPageData => {
  const channelMatch = xml.match(/<channel>([\s\S]*?)<\/channel>/i)
  const channelBlock = channelMatch?.[1] ?? xml

  const channel: RssAssetChannel = {
    title: readTag(channelBlock, "title"),
    description: readTag(channelBlock, "description"),
    creator: readTag(channelBlock, "dc:creator") || readTag(channelBlock, "title")
  }

  const imageBlock = channelBlock.match(/<image>([\s\S]*?)<\/image>/i)?.[1]
  const channelImageUrl = imageBlock ? readTag(imageBlock, "url") : ""
  const docsIndexUrl = readTag(channelBlock, "link")
  const feedUrls = getRssFeedUrls(siteUrl, locale, DEFAULT_LOCALE)

  const items: RssPostItem[] = []
  const itemPattern = /<item>([\s\S]*?)<\/item>/gi
  let itemMatch = itemPattern.exec(xml)

  while (itemMatch) {
    const block = itemMatch[1] ?? ""
    if (!block) {
      itemMatch = itemPattern.exec(xml)
      continue
    }

    const link = readTag(block, "link")
    const pubDate = readTag(block, "pubDate")

    items.push({
      title: readTag(block, "title"),
      description: readTag(block, "description"),
      link,
      guid: readTag(block, "guid") || link,
      pubDate,
      publishedAt: pubDate ? toPublishedAt(pubDate) : undefined,
      docPath: link ? toDocPath(link) : undefined,
      imageUrl: readMediaUrl(block),
      categories: readAllTags(block, "category"),
      creator: readTag(block, "dc:creator") || undefined
    })

    itemMatch = itemPattern.exec(xml)
  }

  const categories = [...new Set(items.flatMap((item) => item.categories ?? []))].sort((a, b) =>
    a.localeCompare(b, locale)
  )

  return {
    channel,
    items,
    categories,
    feedUrls,
    channelImageUrl,
    docsIndexUrl
  }
}
