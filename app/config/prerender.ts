import { existsSync, readdirSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { getFeedPagePublicPath, getRssFeedPublicPath } from "../utils/rss"
import { localePathPrefix, localizedPath } from "../utils/seo"
import { getLocaleCodes } from "./locales"

const DOCS_INDEX_REDIRECT_TARGET = "/docs/about/getting-started"

const contentRoot = fileURLToPath(new URL("../../content", import.meta.url))

const normalizePath = (path: string): string => path.replace(/\\/g, "/")
const localeContentDir = (locale: string): string => `${contentRoot}/${locale}`

const markdownRoutesForLocale = (locale: string): string[] => {
  const contentDir = localeContentDir(locale)
  if (!existsSync(contentDir)) return []

  const routes: string[] = []
  const prefix = localePathPrefix(locale)

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const fullPath = `${dir}/${entry}`
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        walk(fullPath)
        continue
      }

      if (!entry.endsWith(".md")) continue

      const relative = normalizePath(fullPath)
        .slice(normalizePath(contentDir).length)
        .replace(/^\/+/, "")
        .replace(/\.md$/, "")

      routes.push(`${prefix}/docs/${relative}`)
    }
  }

  walk(contentDir)
  return routes
}

const collectionIndexRoutesForLocale = (locale: string): string[] => {
  const contentDir = localeContentDir(locale)
  if (!existsSync(contentDir)) return []

  const prefix = localePathPrefix(locale)
  const routes = new Set<string>()

  for (const section of readdirSync(contentDir)) {
    const sectionDir = `${contentDir}/${section}`
    if (!statSync(sectionDir).isDirectory()) continue

    routes.add(`${prefix}/docs/${section}`)

    for (const collection of readdirSync(sectionDir)) {
      const collectionDir = `${sectionDir}/${collection}`
      if (!statSync(collectionDir).isDirectory()) continue

      const hasMarkdownChildren = readdirSync(collectionDir).some((entry) => entry.endsWith(".md"))
      if (hasMarkdownChildren) {
        routes.add(`${prefix}/docs/${section}/${collection}`)
      }
    }
  }

  return Array.from(routes)
}

const commonRoutesForLocale = (locale: string): string[] => {
  const prefix = localePathPrefix(locale)
  return [
    `${prefix || "/"}`,
    `${prefix}/resume`,
    getFeedPagePublicPath(locale),
    `${prefix}/docs/graph`
  ]
}

export const getDocsIndexRedirectRules = (): Record<string, { redirect: string }> =>
  Object.fromEntries(
    getLocaleCodes().map((locale) => {
      const prefix = localePathPrefix(locale)
      const docsRoot = prefix ? `${prefix}/docs` : "/docs"

      return [docsRoot, { redirect: localizedPath(locale, DOCS_INDEX_REDIRECT_TARGET) }]
    })
  )

export const getChangelogRedirectRules = (): Record<string, { redirect: string }> =>
  Object.fromEntries(
    getLocaleCodes().flatMap((locale) => {
      const prefix = localePathPrefix(locale)
      const changelogRoot = prefix ? `${prefix}/docs/changelog` : "/docs/changelog"
      const target = localizedPath(locale, DOCS_INDEX_REDIRECT_TARGET)

      return [
        [changelogRoot, { redirect: target }],
        [`${changelogRoot}/**`, { redirect: target }]
      ]
    })
  )

const seoRoutes = ["/sitemap_index.xml", "/robots.txt"]

const feedRoutes = (): string[] => {
  return getLocaleCodes().map((locale) => getRssFeedPublicPath(locale))
}

export const getPrerenderRoutes = (): string[] => {
  const contentRoutes = getLocaleCodes().flatMap((locale) => [
    ...commonRoutesForLocale(locale),
    ...collectionIndexRoutesForLocale(locale),
    ...markdownRoutesForLocale(locale)
  ])

  return Array.from(new Set([...seoRoutes, ...feedRoutes(), ...contentRoutes]))
}

export const getPrerenderRouteRules = (): Record<string, { prerender: true }> =>
  Object.fromEntries(
    getLocaleCodes().flatMap((locale) => {
      const prefix = localePathPrefix(locale)
      return [
        [prefix || "/", { prerender: true }],
        [`${prefix}/resume`, { prerender: true }],
        [getFeedPagePublicPath(locale), { prerender: true }],
        [`${prefix}/docs/**`, { prerender: true }]
      ]
    })
  )
