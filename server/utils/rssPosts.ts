import { queryCollection } from "@nuxt/content/server"
import type { H3Event } from "h3"
import {
  buildRssXml,
  getRssSiteLinks,
  isRssEligibleContentPath,
  toRfc822Date
} from "@app/utils/rssFeed"
import { absoluteUrl, DEFAULT_LOCALE, localizedPath, normalizeSiteUrl } from "@app/utils/seo"
import type { ContentRssEntry, RssPostItem, ServeRssFeedOptions } from "@app/types"
import { ROUTE_PATH } from "@base/types"

const toPublicArticlePath = (contentPath: string): string => {
  const normalized = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  return `${ROUTE_PATH.DOCS}${normalized}`
}

export const fetchRssPostItems = async (
  event: H3Event,
  locale: string,
  siteUrl: string
): Promise<RssPostItem[]> => {
  const collection = `content_${locale}` as "content_ru" | "content_en"
  const entries = (await queryCollection(event, collection)
    .select("title", "description", "meta", "path")
    .all()) as ContentRssEntry[]

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
      const publicPath = toPublicArticlePath(String(entry.path || ""))
      const link = absoluteUrl(siteUrl, localizedPath(locale, publicPath, DEFAULT_LOCALE))

      return {
        title: String(entry.title || ""),
        description: String(entry.description || ""),
        link,
        pubDate: toRfc822Date(String(entry.meta?.publishedAt)),
        guid: link
      }
    })
}

export const serveRssFeed = async (
  event: H3Event,
  options: ServeRssFeedOptions
): Promise<string> => {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = normalizeSiteUrl(String(runtimeConfig.public.siteUrl || ""))
  const { feedUrl, articlesIndexUrl } = getRssSiteLinks(siteUrl, options.locale, DEFAULT_LOCALE)
  const items = await fetchRssPostItems(event, options.locale, siteUrl)

  const xml = buildRssXml(
    {
      title: options.channelTitle,
      description: options.channelDescription,
      link: articlesIndexUrl,
      language: options.locale,
      feedUrl
    },
    items
  )

  setResponseHeader(event, "Content-Type", "application/rss+xml; charset=utf-8")
  setResponseHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600")

  return xml
}
