import Database from "better-sqlite3"
import { existsSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { join } from "node:path"
import { joinURL } from "ufo"
import type { ArticleMeta } from "@docs/types"
import { ROUTE_PATH } from "../../layers/base/app/types"
import { getLocaleCodes } from "../config/locales"
import type {
  BuildRssFeedFileOptions,
  ContentRssEntry,
  ContentRssPrerenderRow,
  DocsRssOgImageInput,
  RssPostItem
} from "../types"
import {
  buildRssItemContentHtml,
  buildRssXml,
  getRssContentPathMeta,
  getRssSiteLinks,
  isRssEligibleContentPath,
  toRfc822Date
} from "./rss"
import {
  absoluteUrl,
  DEFAULT_LOCALE,
  localePathPrefix,
  localizedPath,
  normalizeSiteUrl
} from "./seo"

const sqlitePath = `${process.cwd()}/.data/content/contents.sqlite`
const i18nDir = `${process.cwd()}/i18n/locales`

interface OgImageUrlResult {
  url: string
  hash?: string
}

type BuildOgImageUrlFn = (
  options: Record<string, unknown>,
  extension?: string,
  isStatic?: boolean,
  defaults?: Record<string, unknown>,
  secret?: string
) => OgImageUrlResult

let buildOgImageUrl: BuildOgImageUrlFn | null = null

const getBuildOgImageUrl = (): BuildOgImageUrlFn => {
  if (!buildOgImageUrl) {
    const require = createRequire(join(process.cwd(), "package.json"))
    buildOgImageUrl = (
      require(
        join(process.cwd(), "node_modules/nuxt-og-image/dist/runtime/shared/urlEncoding.js")
      ) as { buildOgImageUrl: BuildOgImageUrlFn }
    ).buildOgImageUrl
  }

  return buildOgImageUrl
}

const parseJsonColumn = <T>(value: unknown): T | null => {
  if (value == null || value === "") return null
  if (typeof value === "object") return value as T
  if (typeof value !== "string") return null

  try {
    const parsed = JSON.parse(value) as T
    return parsed && typeof parsed === "object" ? parsed : null
  } catch {
    return null
  }
}

const mapSqliteRssEntry = (row: Record<string, unknown>): ContentRssEntry => ({
  title: row.title as string | null | undefined,
  description: row.description as string | null | undefined,
  path: row.path as string | null | undefined,
  meta: parseJsonColumn<ArticleMeta>(row.meta),
  seo: parseJsonColumn<ContentRssEntry["seo"]>(row.seo)
})

const nonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined
  return value.trim().length ? value : undefined
}

const resolveKey = (messages: Record<string, unknown>, key: string): string => {
  const value = key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[part]
    }
    return undefined
  }, messages)

  return typeof value === "string" ? value : key
}

const loadTranslator = (locale: string): ((key: string) => string) => {
  const messages = JSON.parse(readFileSync(`${i18nDir}/${locale}.json`, "utf8")) as Record<
    string,
    unknown
  >
  return (key: string) => resolveKey(messages, key)
}

const toPublicArticlePath = (contentPath: string): string => {
  const normalized = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  return `${ROUTE_PATH.DOCS}${normalized}`
}

export const getStaticOgImagePath = (
  pagePath: string,
  options: Record<string, unknown>
): string => {
  const result = getBuildOgImageUrl()({ ...options, _path: pagePath }, "png", true, {}, undefined)
  return joinURL("/", result.url)
}

export const getDocsRssOgImageUrl = (siteUrl: string, input: DocsRssOgImageInput): string => {
  const path = getStaticOgImagePath(input.pagePath, {
    component: "DocsPage",
    extension: "png",
    width: 1200,
    height: 630,
    title: input.title,
    description: input.description,
    section: input.section,
    collection: input.collection
  })

  return absoluteUrl(siteUrl, path)
}

export const getHomeRssOgImageUrl = (
  siteUrl: string,
  pagePath: string,
  title: string,
  description: string
): string => {
  const path = getStaticOgImagePath(pagePath, {
    component: "HomePage",
    extension: "png",
    width: 1200,
    height: 630,
    title,
    description
  })

  return absoluteUrl(siteUrl, path)
}

export const contentEntriesToRssItems = (
  entries: ContentRssEntry[],
  locale: string,
  siteUrl: string,
  t: (key: string) => string
): RssPostItem[] => {
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
      const localizedPublicPath = localizedPath(
        locale,
        toPublicArticlePath(contentPath),
        DEFAULT_LOCALE
      )
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

      const item: RssPostItem = {
        title,
        description,
        link,
        pubDate: toRfc822Date(String(entry.meta?.publishedAt)),
        guid: link,
        imageUrl,
        category,
        readingTime: nonEmptyString(entry.meta?.readingTime),
        tags: entry.meta?.tags?.filter((tag) => Boolean(tag?.trim()))
      }

      item.contentHtml = buildRssItemContentHtml(item)
      return item
    })
}

const loadRssItemsFromSqlite = (locale: string, siteUrl: string): RssPostItem[] => {
  if (!existsSync(sqlitePath)) return []

  const db = new Database(sqlitePath, { readonly: true })
  const table = `_content_content_${locale}`
  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
    .get(table)

  if (!tableExists) {
    db.close()
    return []
  }

  const entries = db
    .prepare(`SELECT title, description, path, meta, seo FROM ${table}`)
    .all()
    .map((row) => mapSqliteRssEntry(row as Record<string, unknown>))
  db.close()

  return contentEntriesToRssItems(entries, locale, siteUrl, loadTranslator(locale))
}

export const buildRssFeedXml = (options: BuildRssFeedFileOptions): string => {
  const siteUrl = normalizeSiteUrl(options.siteUrl)
  const { feedUrl, articlesIndexUrl } = getRssSiteLinks(siteUrl, options.locale, DEFAULT_LOCALE)
  const items = loadRssItemsFromSqlite(options.locale, siteUrl)
  const channelImageUrl = getHomeRssOgImageUrl(
    siteUrl,
    localizedPath(options.locale, ROUTE_PATH.HOME, DEFAULT_LOCALE),
    options.channelTitle,
    options.channelDescription
  )

  return buildRssXml(
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
}

const ogPathsForLocale = (locale: string): string[] => {
  if (!existsSync(sqlitePath)) return []

  const db = new Database(sqlitePath, { readonly: true })
  const table = `_content_content_${locale}`
  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
    .get(table)

  if (!tableExists) {
    db.close()
    return []
  }

  const rows = db
    .prepare(`SELECT path, title, description FROM ${table}`)
    .all() as ContentRssPrerenderRow[]
  db.close()

  const t = loadTranslator(locale)
  const paths = new Set<string>()

  for (const row of rows) {
    const contentPath = String(row.path || "")
    if (!isRssEligibleContentPath(contentPath)) continue

    const pathMeta = getRssContentPathMeta(contentPath)
    const publicPath = localizedPath(locale, toPublicArticlePath(contentPath), DEFAULT_LOCALE)
    const sectionLabel = pathMeta ? t(pathMeta.sectionLabelKey) : t("docs.seo.defaultSection")
    const collectionLabel = pathMeta ? t(pathMeta.collectionLabelKey) : ""

    paths.add(
      getStaticOgImagePath(publicPath, {
        component: "DocsPage",
        extension: "png",
        width: 1200,
        height: 630,
        title: String(row.title || ""),
        description: String(row.description || ""),
        section: sectionLabel,
        collection: collectionLabel
      })
    )
  }

  const prefix = localePathPrefix(locale)
  paths.add(
    getStaticOgImagePath(prefix || "/", {
      component: "HomePage",
      extension: "png",
      width: 1200,
      height: 630,
      title: t("layout.rss.feedTitle"),
      description: t("layout.rss.feedDescription")
    })
  )

  return [...paths]
}

export const getRssOgPrerenderRoutes = (): string[] => {
  if (!existsSync(sqlitePath)) return []

  return Array.from(new Set(getLocaleCodes().flatMap((locale) => ogPathsForLocale(locale))))
}
