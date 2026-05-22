import { queryCollection } from "@nuxt/content/server"
import type { H3Event } from "h3"
import {
  buildRssItemContentHtml,
  buildRssXml,
  getRssSiteLinks,
  isRssEligibleContentPath,
  toRfc822Date
} from "@app/utils/rssFeed"
import { absoluteUrl, DEFAULT_LOCALE, localizedPath, normalizeSiteUrl } from "@app/utils/seo"
import type { ContentRssEntry, RssPostItem, ServeRssFeedOptions } from "@app/types"
import { ROUTE_PATH } from "@base/types"
import { createDocsTranslator } from "./docsI18n"
import { getDocsRssOgImageUrl, getHomeRssOgImageUrl } from "./rssOgImage"
import { getRssContentPathMeta } from "./rssPathMeta"

const nonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined
  return value.trim().length ? value : undefined
}

const toPublicArticlePath = (contentPath: string): string => {
  const normalized = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  return `${ROUTE_PATH.DOCS}${normalized}`
}

export const fetchRssPostItems = async (
  event: H3Event,
  locale: string,
  siteUrl: string,
  t: (key: string) => string
): Promise<RssPostItem[]> => {
  const collection = `content_${locale}` as "content_ru" | "content_en"
  const entries = (await queryCollection(event, collection)
    .select("title", "description", "meta", "path", "seo")
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
      const contentPath = String(entry.path || "")
      const publicPath = toPublicArticlePath(contentPath)
      const localizedPublicPath = localizedPath(locale, publicPath, DEFAULT_LOCALE)
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
      const readingTime = nonEmptyString(entry.meta?.readingTime)
      const tags = entry.meta?.tags?.filter((tag) => Boolean(tag?.trim()))

      const item: RssPostItem = {
        title,
        description,
        link,
        pubDate: toRfc822Date(String(entry.meta?.publishedAt)),
        guid: link,
        imageUrl,
        category,
        readingTime,
        tags
      }

      item.contentHtml = buildRssItemContentHtml(item)

      return item
    })
}

export const serveRssFeed = async (
  event: H3Event,
  options: ServeRssFeedOptions
): Promise<string> => {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = normalizeSiteUrl(String(runtimeConfig.public.siteUrl || ""))
  const { feedUrl, articlesIndexUrl } = getRssSiteLinks(siteUrl, options.locale, DEFAULT_LOCALE)
  const t = createDocsTranslator(options.locale as "ru" | "en")
  const items = await fetchRssPostItems(event, options.locale, siteUrl, t)
  const channelImageUrl = getHomeRssOgImageUrl(
    siteUrl,
    localizedPath(options.locale, ROUTE_PATH.HOME, DEFAULT_LOCALE),
    options.channelTitle,
    options.channelDescription
  )

  const xml = buildRssXml(
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

  setResponseHeader(event, "Content-Type", "application/rss+xml; charset=utf-8")
  setResponseHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600")

  return xml
}
