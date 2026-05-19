import type { SitemapUrlInput } from "@nuxtjs/sitemap"
import { existsSync, readdirSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { absoluteUrl, localizedPath, normalizeSiteUrl, normalizeUrlPath } from "../utils/seo"
import { getLocaleCodes } from "./locales"

const contentRoot = fileURLToPath(new URL("../../content", import.meta.url))

interface SitemapEntry {
  loc: string
  locale: string
  routeKey: string
  lastmod?: string
}

const normalizePath = (path: string): string => path.replace(/\\/g, "/")

const localeContentDir = (locale: string): string => `${contentRoot}/${locale}`

const collectMarkdownFiles = (dir: string): string[] => {
  if (!existsSync(dir)) return []

  const files: string[] = []

  for (const entry of readdirSync(dir)) {
    const fullPath = `${dir}/${entry}`
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath))
      continue
    }

    if (entry.endsWith(".md")) {
      files.push(fullPath)
    }
  }

  return files
}

const markdownContentPath = (locale: string, absoluteFilePath: string): string => {
  const contentDir = localeContentDir(locale)

  return normalizePath(absoluteFilePath)
    .slice(normalizePath(contentDir).length)
    .replace(/^\/+/, "")
    .replace(/\.md$/, "")
    .replace(/\/index$/i, "")
}

const docsRouteFromContentPath = (contentPath: string): string => {
  return normalizeUrlPath(`/docs/${contentPath}`)
}

const latestLastmod = (paths: string[]): string | undefined => {
  if (!paths.length) return undefined

  return new Date(Math.max(...paths.map((path) => statSync(path).mtimeMs))).toISOString()
}

const addEntry = (
  entries: Map<string, SitemapEntry>,
  alternatesByRouteKey: Map<string, Map<string, string>>,
  entry: SitemapEntry
) => {
  entries.set(`${entry.locale}:${entry.loc}`, entry)

  const alternates = alternatesByRouteKey.get(entry.routeKey) ?? new Map<string, string>()
  alternates.set(entry.locale, entry.loc)
  alternatesByRouteKey.set(entry.routeKey, alternates)
}

export const getSitemapUrls = (siteUrlValue?: string): SitemapUrlInput[] => {
  const siteUrl = normalizeSiteUrl(siteUrlValue)
  const entries = new Map<string, SitemapEntry>()
  const alternatesByRouteKey = new Map<string, Map<string, string>>()

  for (const locale of getLocaleCodes()) {
    addEntry(entries, alternatesByRouteKey, {
      loc: localizedPath(locale, "/"),
      locale,
      routeKey: "/"
    })

    const contentDir = localeContentDir(locale)
    const markdownFiles = collectMarkdownFiles(contentDir)

    for (const filePath of markdownFiles) {
      const contentPath = markdownContentPath(locale, filePath)
      const routeKey = docsRouteFromContentPath(contentPath)

      addEntry(entries, alternatesByRouteKey, {
        loc: localizedPath(locale, routeKey),
        locale,
        routeKey,
        lastmod: statSync(filePath).mtime.toISOString()
      })
    }

    if (!existsSync(contentDir)) continue

    for (const section of readdirSync(contentDir)) {
      const sectionDir = `${contentDir}/${section}`
      if (!statSync(sectionDir).isDirectory()) continue

      for (const collection of readdirSync(sectionDir)) {
        const collectionDir = `${sectionDir}/${collection}`
        if (!statSync(collectionDir).isDirectory()) continue

        const collectionFiles = collectMarkdownFiles(collectionDir)
        if (!collectionFiles.length) continue

        const routeKey = normalizeUrlPath(`/docs/${section}/${collection}`)

        addEntry(entries, alternatesByRouteKey, {
          loc: localizedPath(locale, routeKey),
          locale,
          routeKey,
          lastmod: latestLastmod(collectionFiles)
        })
      }
    }
  }

  return [...entries.values()]
    .sort((a, b) => a.loc.localeCompare(b.loc))
    .map((entry) => {
      const alternatives = alternatesByRouteKey.get(entry.routeKey) ?? new Map<string, string>()
      const defaultLocalePath = alternatives.get("ru")

      return {
        loc: entry.loc,
        ...(entry.lastmod ? { lastmod: entry.lastmod } : {}),
        alternatives: [
          ...[...alternatives]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([hreflang, path]) => ({
              hreflang,
              href: absoluteUrl(siteUrl, path)
            })),
          ...(defaultLocalePath
            ? [
                {
                  hreflang: "x-default",
                  href: absoluteUrl(siteUrl, defaultLocalePath)
                }
              ]
            : [])
        ]
      } satisfies SitemapUrlInput
    })
}
