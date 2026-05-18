import { buildUrlFromMapping, findContentMapping } from "@docs/utils/path/pathMapping"
import { LOCALE_PREFIX_RE } from "@base/constants"
import { ROUTE_PATH } from "@base/types"

export const normalizePublicDocsPath = (path: string): string => {
  const noHash = path.split("#")[0] ?? path
  const noQuery = noHash.split("?")[0] ?? noHash
  let p = noQuery.replace(LOCALE_PREFIX_RE, "") || "/"
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1)
  return p
}

export const publicPathToContentPath = (publicPath: string): string => {
  const normalized = normalizePublicDocsPath(publicPath)
  if (!normalized.startsWith(ROUTE_PATH.DOCS)) {
    return normalized.startsWith("/") ? normalized : `/${normalized}`
  }

  const stripped = normalized.slice(ROUTE_PATH.DOCS.length) || "/"
  const contentPath = stripped.startsWith("/") ? stripped : `/${stripped}`
  return findContentMapping(contentPath)?.path ?? contentPath
}

export const contentPathToPublicPath = (contentPath: string): string => {
  const normalized = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  const mapping = findContentMapping(normalized)
  if (!mapping) return `${ROUTE_PATH.DOCS}${normalized}`
  return buildUrlFromMapping(mapping)
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
      pathname = u.pathname.replace(LOCALE_PREFIX_RE, "") || u.pathname
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

  if (!pathname.startsWith(ROUTE_PATH.DOCS)) return null

  let p = pathname.split("?")[0] ?? pathname
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1)
  return p || null
}
