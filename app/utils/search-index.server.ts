import Database from "better-sqlite3"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { SITE_SEARCH_PAGES } from "@app/config/site-search-pages"
import { createTranslator } from "@app/utils/i18n-messages"
import { extractResumeSearchText } from "@app/utils/resume-search-text"
import { resolveSearchResultMeta } from "@docs/utils/mapSearchResults"
import type { SearchablePage, SearchIndexEntry } from "@docs/types"
import rawResume from "@base/data/resume.json"

const sqlitePath = join(process.cwd(), ".data/content/contents.sqlite")

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

const mapSqliteSearchPage = (row: Record<string, unknown>): SearchablePage => ({
  title: row.title as string | null | undefined,
  description: row.description as string | null | undefined,
  path: String(row.path || ""),
  body: parseJsonColumn(row.body) ?? row.body,
  meta: parseJsonColumn<{ icon?: string }>(row.meta) ?? undefined
})

export const loadContentSearchPagesFromSqlite = (locale: string): SearchablePage[] => {
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

  const pages = db
    .prepare(`SELECT title, description, path, body, meta FROM ${table}`)
    .all()
    .map((row) => mapSqliteSearchPage(row as Record<string, unknown>))
  db.close()

  return pages
}

export const buildSiteSearchPages = (locale: string): SearchablePage[] => {
  const t = createTranslator(locale)

  return SITE_SEARCH_PAGES.map((page) => {
    const title = t(page.titleKey)
    const description = t(page.descriptionKey)

    const body =
      page.path === "/resume"
        ? extractResumeSearchText(locale, rawResume)
        : [title, description].filter(Boolean).join(" ")

    return {
      path: page.path,
      title,
      description,
      body,
      meta: { icon: page.icon }
    }
  })
}

const buildSearchIndexPages = (locale: string): SearchablePage[] => {
  const contentPages = loadContentSearchPagesFromSqlite(locale)
  const sitePages = buildSiteSearchPages(locale)
  const sitePaths = new Set(sitePages.map((page) => page.path))

  return [...sitePages, ...contentPages.filter((page) => !sitePaths.has(page.path))]
}

export const buildSearchIndexEntries = (locale: string): SearchIndexEntry[] => {
  const t = createTranslator(locale)
  const entries: SearchIndexEntry[] = []

  for (const page of buildSearchIndexPages(locale)) {
    const result = resolveSearchResultMeta(page, t)
    if (!result) continue
    entries.push({ ...page, result })
  }

  return entries
}
