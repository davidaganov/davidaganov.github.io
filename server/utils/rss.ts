import type { H3Event } from "h3"
import { readFileSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { getLocaleCodes } from "@app/config/locales"
import { buildRssXml, getRssSiteLinks } from "@app/utils/rss"
import { contentEntriesToRssItems, getHomeRssOgImageUrl } from "@app/utils/rss.server"
import { DEFAULT_LOCALE, normalizeSiteUrl } from "@app/utils/seo"
import type { ContentRssEntry, ServeRssFeedOptions } from "@app/types"

const resolveKey = (messages: Record<string, unknown>, key: string): string => {
  const value = key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[part]
    }
    return undefined
  }, messages)

  return typeof value === "string" ? value : key
}

const i18nDir = join(process.cwd(), "i18n", "locales")

export const loadTranslator = (locale: string): ((key: string) => string) => {
  try {
    const fileContent = readFileSync(join(i18nDir, `${locale}.json`), "utf8")
    const messages = JSON.parse(fileContent) as Record<string, unknown>
    return (key: string) => resolveKey(messages, key)
  } catch (e) {
    return (key: string) => key
  }
}

const parseRssAssetPayload = (data: unknown): ContentRssEntry[] => {
  if (Array.isArray(data)) return data as ContentRssEntry[]
  if (data && typeof data === "object" && Array.isArray((data as { entries?: unknown }).entries)) {
    return (data as { entries: ContentRssEntry[] }).entries
  }
  return []
}

const loadRssEntries = async (locale: string): Promise<ContentRssEntry[]> => {
  try {
    const data = await useStorage("assets:server").getItem(`rss-${locale}.json`)
    const entries = parseRssAssetPayload(data)
    if (entries.length) return entries
  } catch (error) {
    console.error("rss: error reading from server assets:", error)
  }

  try {
    const raw = await readFile(join(process.cwd(), "public", `rss-${locale}.json`), "utf8")
    return parseRssAssetPayload(JSON.parse(raw) as unknown)
  } catch {
    return []
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

  const runtimeConfig = useRuntimeConfig()
  const siteUrl = normalizeSiteUrl(String(runtimeConfig.public.siteUrl || ""))
  const { feedUrl, articlesIndexUrl } = getRssSiteLinks(siteUrl, options.locale, DEFAULT_LOCALE)
  const t = loadTranslator(options.locale)
  const entries = await loadRssEntries(options.locale)
  const items = contentEntriesToRssItems(entries, options.locale, siteUrl, t)
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
