import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import type { RssAssetFile } from "../types"
import { createTranslator } from "../utils/i18n-messages"
import { getFeedChannelOgImagePublicPath } from "../utils/rss"
import { getLocaleCodes } from "./locales"

const loadRssAssetFromDisk = (locale: string): RssAssetFile | null => {
  const filePath = resolve(process.cwd(), "server/assets", `rss-${locale}.json`)
  if (!existsSync(filePath)) return null

  try {
    const payload = JSON.parse(readFileSync(filePath, "utf8")) as RssAssetFile
    if (!payload?.channel || !Array.isArray(payload.entries)) return null
    return payload
  } catch {
    return null
  }
}

const loadSyncedOgPrerenderRoutes = (): string[] => {
  const filePath = resolve(process.cwd(), "server/assets", "og-prerender-routes.json")
  if (!existsSync(filePath)) return []

  try {
    const payload = JSON.parse(readFileSync(filePath, "utf8")) as { routes?: string[] }
    if (!Array.isArray(payload.routes)) return []
    return payload.routes.filter((route) => typeof route === "string" && route.startsWith("/_og/"))
  } catch {
    return []
  }
}

const rssChannelOgRoutesForLocale = (locale: string): string[] => {
  const asset = loadRssAssetFromDisk(locale)
  if (!asset) return []

  const t = createTranslator(locale)

  return [
    getFeedChannelOgImagePublicPath({
      title: asset.channel.title || t("layout.rss.feedTitle"),
      description: asset.channel.description || t("layout.rss.feedDescription")
    })
  ]
}

export const getOgImagePrerenderRoutes = (): string[] => {
  const synced = loadSyncedOgPrerenderRoutes()
  if (synced.length > 0) return Array.from(new Set(synced))

  const routes = getLocaleCodes().flatMap((locale) => rssChannelOgRoutesForLocale(locale))

  return Array.from(new Set(routes))
}
