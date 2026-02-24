import { readdir } from "node:fs/promises"
import { join, posix } from "node:path"

const CONTENT_DIR = join(process.cwd(), "content")

const collectMarkdownFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        return collectMarkdownFiles(fullPath)
      }

      if (!entry.isFile() || !entry.name.endsWith(".md")) {
        return []
      }

      return [fullPath]
    })
  )

  return files.flat()
}

const normalizeSiteUrl = (value: unknown): string => {
  const str = String(value || "").trim()
  if (!str) return "https://aganov.dev"
  return str.endsWith("/") ? str.slice(0, -1) : str
}

const mdFileToDocsPath = (locale: string, absoluteFilePath: string): string => {
  const localeRoot = join(CONTENT_DIR, locale)
  const relativePath = absoluteFilePath.slice(localeRoot.length).replaceAll("\\", "/")

  const normalized = relativePath
    .replace(/^\/+/, "")
    .replace(/\.md$/, "")
    .replace(/\/index$/i, "")

  return `/${locale}/docs/${normalized}`
}

const toUrlEntry = (loc: string, lastmod: string): string => {
  return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(runtimeConfig.public.siteUrl)
  const lastmod = new Date().toISOString()

  const localeDirs = await readdir(CONTENT_DIR, { withFileTypes: true })
  const locales = localeDirs.filter((entry) => entry.isDirectory()).map((entry) => entry.name)

  const urls = new Set<string>()

  urls.add(`${siteUrl}/`)

  for (const locale of locales) {
    urls.add(`${siteUrl}/${locale}`)

    const localeContentDir = join(CONTENT_DIR, locale)
    const markdownFiles = await collectMarkdownFiles(localeContentDir)

    for (const filePath of markdownFiles) {
      const docsPath = mdFileToDocsPath(locale, filePath)
      urls.add(`${siteUrl}${posix.normalize(docsPath)}`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...urls
  ]
    .sort((a, b) => a.localeCompare(b))
    .map((url) => `  ${toUrlEntry(url, lastmod)}`)
    .join("\n")}\n</urlset>`

  setHeader(event, "content-type", "application/xml; charset=utf-8")

  return xml
})
