import type { H3Event } from "h3"
import { buildRssFeedXml, parseRssAssetPayload } from "@app/utils/rss.server"
import { normalizeSiteUrl } from "@app/utils/seo"
import type { RssAssetFile, ServeRssFeedOptions } from "@app/types"

const loadRssAsset = async (locale: string): Promise<RssAssetFile | null> => {
  try {
    const data = await useStorage("assets:server").getItem(`rss-${locale}.json`)
    return parseRssAssetPayload(data)
  } catch (error) {
    console.error("rss: error reading from server assets:", error)
    return null
  }
}

export const serveRssFeed = async (
  event: H3Event,
  options: ServeRssFeedOptions
): Promise<string> => {
  try {
    const rssAsset = await loadRssAsset(options.locale)
    if (!rssAsset) {
      throw createError({ statusCode: 404, statusMessage: "Feed not found" })
    }

    const runtimeConfig = useRuntimeConfig()
    const siteUrl = normalizeSiteUrl(String(runtimeConfig.public.siteUrl || ""))
    const xml = buildRssFeedXml(options.locale, siteUrl, rssAsset)

    setResponseHeader(event, "Content-Type", "application/rss+xml; charset=utf-8")
    setResponseHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600")

    return xml
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error
    }

    console.error(`rss: failed to serve feed (${options.locale}):`, error)
    throw createError({
      statusCode: 500,
      statusMessage: "RSS feed failed to generate"
    })
  }
}
