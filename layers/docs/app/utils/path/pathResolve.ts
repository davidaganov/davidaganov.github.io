import { buildUrlFromMapping, findContentMapping } from "@docs/utils/path/pathMapping"
import { LOCALE_PREFIX_RE } from "@base/constants"

export const normalizePublicDocsPath = (path: string): string => {
  const noHash = path.split("#")[0] ?? path
  const noQuery = noHash.split("?")[0] ?? noHash
  let p = noQuery.replace(LOCALE_PREFIX_RE, "") || "/"
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1)
  return p
}

export const contentPathToPublicDocsPath = (contentPath: string): string => {
  const normalized = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  const mapping = findContentMapping(normalized)
  if (!mapping) return `/docs${normalized}`
  return buildUrlFromMapping(mapping)
}

export const findContentPageByPublicPath = <T extends { path: string }>(
  pages: T[],
  publicDocsPath: string
): T | undefined => {
  const normalized = normalizePublicDocsPath(publicDocsPath)
  const withoutDocs = normalized.replace(/^\/docs/, "") || "/"
  const withoutSection = normalized.replace(/^\/docs\/[^/]+/, "")
  const candidates = [withoutDocs, withoutSection].filter(Boolean)

  return pages.find((p) =>
    candidates.some((candidate) => {
      return p.path === candidate || p.path === `/${candidate}` || p.path.endsWith(candidate)
    })
  )
}

export const canonicalDocsPathFromHref = (
  href: string,
  basePublicDocsPath: string
): string | null => {
  const trimmed = href.trim()
  if (
    !trimmed ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return null
  }

  let pathname: string

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const u = new URL(trimmed)
      pathname = u.pathname
      pathname = pathname.replace(LOCALE_PREFIX_RE, "") || pathname
    } catch {
      return null
    }
  } else if (trimmed.startsWith("/")) {
    const [pathPart] = trimmed.split("#")
    pathname = (pathPart ?? "").split("?")[0] ?? ""
    pathname = pathname.replace(LOCALE_PREFIX_RE, "")
  } else {
    try {
      const base = normalizePublicDocsPath(basePublicDocsPath)
      const u = new URL(trimmed, `https://placeholder.invalid${base}`)
      pathname = u.pathname.replace(LOCALE_PREFIX_RE, "")
    } catch {
      return null
    }
  }

  if (!pathname.startsWith("/docs")) return null

  let p = pathname.split("?")[0] ?? pathname
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1)
  return p || null
}
