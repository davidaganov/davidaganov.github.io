import { queryCollection } from "@nuxt/content/server"
import type { H3Event } from "h3"
import { buildRssXml, getRssSiteLinks } from "@app/utils/rss"
import { contentEntriesToRssItems, getHomeRssOgImageUrl } from "@app/utils/rss.server"
import { DEFAULT_LOCALE, normalizeSiteUrl } from "@app/utils/seo"
import type { ContentRssEntry, ServeRssFeedOptions } from "@app/types"
import { createDocsTranslator } from "./docsI18n"

export const fetchRssPostItems = async (
  event: H3Event,
  locale: string,
  siteUrl: string,
  t: (key: string) => string
) => {
  const collection = `content_${locale}` as "content_ru" | "content_en"
  const entries = (await queryCollection(event, collection)
    .select("title", "description", "meta", "path", "seo")
    .all()) as ContentRssEntry[]

  return contentEntriesToRssItems(entries, locale, siteUrl, t)
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
  const channelImageUrl = getHomeRssOgImageUrl(siteUrl, options.locale)

  const xml = buildRssXml(
    {
      title: t("layout.rss.feedTitle"),
      description: t("layout.rss.feedDescription"),
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
