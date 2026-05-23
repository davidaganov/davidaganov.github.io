import type { H3Event } from "h3"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { getLocaleCodes } from "@app/config/locales"
import { buildRssXml, getRssSiteLinks } from "@app/utils/rss"
import { contentEntriesToRssItems, getHomeRssOgImageUrl } from "@app/utils/rss.server"
import { DEFAULT_LOCALE, normalizeSiteUrl } from "@app/utils/seo"
import type { ContentRssEntry, RssAssetFile, ServeRssFeedOptions } from "@app/types"

const parseRssAssetPayload = (data: unknown): RssAssetFile | null => {
  if (!data || typeof data !== "object") return null

  const payload = data as Record<string, unknown>
  const entries = Array.isArray(payload.entries) ? (payload.entries as ContentRssEntry[]) : null
  const channel = payload.channel

  if (!entries || !channel || typeof channel !== "object") return null

  const { title, description, creator } = channel as Record<string, unknown>
  if (typeof title !== "string" || typeof description !== "string" || typeof creator !== "string") {
    return null
  }

  return {
    channel: { title, description, creator },
    entries
  }
}

const loadRssAsset = async (locale: string): Promise<RssAssetFile | null> => {
  try {
    const data = await useStorage("assets:server").getItem(`rss-${locale}.json`)
    const asset = parseRssAssetPayload(data)
    if (asset) return asset
  } catch (error) {
    console.error("rss: error reading from server assets:", error)
  }

  try {
    const raw = await readFile(join(process.cwd(), "public", `rss-${locale}.json`), "utf8")
    return parseRssAssetPayload(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

export const serveRssFeed = async (
  event: H3Event,
  options: ServeRssFeedOptions
): Promise<string> => {
  const localeCodes = getLocaleCodes()

  if (!localeCodes.includes(options.locale)) {
    throw createError({ statusCode: 404, statusMessage: "Feed not found" })
  }

  const rssAsset = await loadRssAsset(options.locale)
  if (!rssAsset) {
    throw createError({
      statusCode: 503,
      statusMessage: "RSS feed is not built yet. Run npm run build:docs-assets."
    })
  }

  const runtimeConfig = useRuntimeConfig()
  const siteUrl = normalizeSiteUrl(String(runtimeConfig.public.siteUrl || ""))
  const { feedUrl, articlesIndexUrl } = getRssSiteLinks(siteUrl, options.locale, DEFAULT_LOCALE)
  const { channel, entries } = rssAsset
  const items = contentEntriesToRssItems(entries, options.locale, siteUrl, channel.creator)
  const channelImageUrl = getHomeRssOgImageUrl(siteUrl, options.locale)

  const xml = buildRssXml(
    {
      title: channel.title,
      description: channel.description,
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
