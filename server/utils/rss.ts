import type { H3Event } from "h3"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { buildRssXml, getRssSiteLinks } from "@app/utils/rss"
import { contentEntriesToRssItems, getHomeRssOgImageUrl } from "@app/utils/rss.server"
import { DEFAULT_LOCALE, normalizeSiteUrl } from "@app/utils/seo"
import type { ContentRssEntry, ServeRssFeedOptions } from "@app/types"
import { createDocsTranslator } from "./docsI18n"

const parseRssAssetPayload = (data: unknown): ContentRssEntry[] => {
  if (Array.isArray(data)) return data as ContentRssEntry[]
  if (data && typeof data === "object" && Array.isArray((data as { entries?: unknown }).entries)) {
    return (data as { entries: ContentRssEntry[] }).entries
  }
  return []
}

const loadRssContentEntriesFromAssets = async (locale: string): Promise<ContentRssEntry[]> => {
  try {
    const data = await useStorage("assets:server").getItem(`rss-${locale}.json`)
    const entries = parseRssAssetPayload(data)
    if (entries.length) return entries
  } catch (error) {
    console.error("Error reading RSS from server assets:", error)
  }

  const filePath = join(process.cwd(), "public", `rss-${locale}.json`)

  try {
    const raw = await readFile(filePath, "utf8")
    return parseRssAssetPayload(JSON.parse(raw) as unknown)
  } catch {
    return []
  }
}

export const fetchRssPostItems = async (
  locale: string,
  siteUrl: string,
  t: (key: string) => string
) => {
  const entries = await loadRssContentEntriesFromAssets(locale)
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
  const items = await fetchRssPostItems(options.locale, siteUrl, t)
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
