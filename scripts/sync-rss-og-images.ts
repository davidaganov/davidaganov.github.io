import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { getLocaleCodes } from "../app/config/locales"
import type { RssAssetFile } from "../app/types/rss.interface"
import { getFeedChannelOgImagePublicPath } from "../app/utils/rss"
import { localizedPath } from "../app/utils/seo"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const root = resolve(__dirname, "..")
const serverAssetsDir = resolve(root, "server/assets")

const staticRoots = [resolve(root, ".vercel/output/static"), resolve(root, ".output/public")]

const extractOgImagePath = (html: string): string | null => {
  const match = html.match(/property="og:image"\s+content="([^"]+)"/)
  if (!match?.[1]) return null

  try {
    return new URL(match[1]).pathname
  } catch {
    return match[1].startsWith("/") ? match[1] : null
  }
}

const ogFileExists = (publicPath: string): boolean => {
  const relative = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath

  return staticRoots.some((staticRoot) => {
    if (!existsSync(staticRoot)) return false
    return existsSync(resolve(staticRoot, relative))
  })
}

const readHtmlForRoute = (routePath: string): string | null => {
  const normalized = routePath.replace(/\/+$/, "") || "/"
  const candidates = [
    normalized === "/" ? "/index.html" : `${normalized}.html`,
    normalized === "/" ? "/index.html" : `${normalized}/index.html`
  ]

  for (const staticRoot of staticRoots) {
    if (!existsSync(staticRoot)) continue

    for (const candidate of candidates) {
      const filePath = resolve(staticRoot, `.${candidate}`)
      if (!existsSync(filePath)) continue

      try {
        return readFileSync(filePath, "utf8")
      } catch {
        continue
      }
    }
  }

  return null
}

const docsRouteForEntry = (locale: string, contentPath: string): string => {
  const normalized = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  return localizedPath(locale, `/docs${normalized}`)
}

const loadRssAsset = (locale: string): RssAssetFile | null => {
  const filePath = resolve(serverAssetsDir, `rss-${locale}.json`)
  if (!existsSync(filePath)) return null

  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as RssAssetFile
  } catch {
    return null
  }
}

const syncLocale = (locale: string): { updatedEntries: number; channelUpdated: boolean } => {
  const asset = loadRssAsset(locale)
  if (!asset) return { updatedEntries: 0, channelUpdated: false }

  let updatedEntries = 0

  const entries = asset.entries.map((entry) => {
    const contentPath = String(entry.path || "")
    if (!contentPath || entry.seo?.ogImage || entry.seo?.image) return entry

    const html = readHtmlForRoute(docsRouteForEntry(locale, contentPath))
    if (!html) return entry

    const ogImagePath = extractOgImagePath(html)
    if (!ogImagePath || ogImagePath === entry.ogImagePath) return entry

    updatedEntries += 1
    return { ...entry, ogImagePath }
  })

  const channelOgImagePath = getFeedChannelOgImagePublicPath({
    title: asset.channel.title,
    description: asset.channel.description
  })
  const channelPathValid = ogFileExists(channelOgImagePath)
  const channelUpdated = Boolean(
    channelPathValid && channelOgImagePath !== asset.channel.ogImagePath
  )

  const nextAsset: RssAssetFile = {
    channel: {
      ...asset.channel,
      ...(channelPathValid ? { ogImagePath: channelOgImagePath } : {})
    },
    entries
  }

  const rssPath = resolve(serverAssetsDir, `rss-${locale}.json`)
  writeFileSync(
    rssPath,
    JSON.stringify(
      {
        ...nextAsset,
        builtAt: new Date().toISOString()
      },
      null,
      2
    )
  )

  return { updatedEntries, channelUpdated }
}

const collectOgPrerenderRoutes = (): string[] => {
  const routes = new Set<string>()

  for (const locale of getLocaleCodes()) {
    const asset = loadRssAsset(locale)

    if (!asset) continue
    if (asset.channel.ogImagePath) routes.add(asset.channel.ogImagePath)

    for (const entry of asset.entries) {
      if (entry.ogImagePath) routes.add(entry.ogImagePath)
    }
  }

  return Array.from(routes)
}

const writeOgPrerenderRoutes = (routes: string[]): void => {
  const filePath = resolve(serverAssetsDir, "og-prerender-routes.json")
  writeFileSync(
    filePath,
    JSON.stringify(
      {
        routes,
        builtAt: new Date().toISOString()
      },
      null,
      2
    )
  )
}

const verifyOgFiles = (routes: string[]): number => {
  let missing = 0

  for (const route of routes) {
    if (ogFileExists(route)) continue
    missing += 1
    console.warn(`sync-rss-og-images: missing PNG for ${route}`)
  }

  return missing
}

const main = (): void => {
  let totalEntries = 0
  let localesWithChannel = 0

  for (const locale of getLocaleCodes()) {
    const { updatedEntries, channelUpdated } = syncLocale(locale)
    totalEntries += updatedEntries
    if (channelUpdated) localesWithChannel += 1

    console.info(
      `sync-rss-og-images: ${locale} — ${updatedEntries} entry image(s)${channelUpdated ? ", channel image" : ""}`
    )
  }

  if (!totalEntries && !localesWithChannel) {
    console.info("sync-rss-og-images: no RSS asset changes")
  }

  const ogRoutes = collectOgPrerenderRoutes()
  writeOgPrerenderRoutes(ogRoutes)
  console.info(`sync-rss-og-images: ${ogRoutes.length} OG route(s) for prerender`)

  const missing = verifyOgFiles(ogRoutes)
  if (missing > 0) {
    console.info(
      `sync-rss-og-images: ${missing} OG file(s) missing — the next build pass should prerender them`
    )
  }
}

main()
