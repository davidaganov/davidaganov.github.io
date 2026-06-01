export const DEFAULT_LOCALE = process.env.NUXT_DEFAULT_LOCALE || "ru"

const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || "https://aganov.dev"
const TRAILING_SLASH_SKIP_PREFIXES = ["/api", "/_og/", "/__og-image__/"] as const
const PATH_WITH_FILE_EXTENSION_RE = /\.\w{1,16}$/

export const normalizeSiteUrl = (value: unknown = SITE_URL): string => {
  const str = String(value || "").trim()
  if (!str) return "https://aganov.dev"
  return str.endsWith("/") ? str.slice(0, -1) : str
}

export const stripTrailingSlashFromPath = (path: string): string => {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1)
  return path
}

export const shouldRedirectTrailingSlash = (pathname: string): boolean => {
  if (pathname === "/" || !pathname.endsWith("/")) return false
  if (TRAILING_SLASH_SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false
  }

  const withoutSlash = pathname.slice(0, -1)
  return !PATH_WITH_FILE_EXTENSION_RE.test(withoutSlash)
}

export const normalizeUrlPath = (path: string): string => {
  const normalized = (path || "/").replace(/\/{2,}/g, "/")
  const withLeadingSlash = normalized.startsWith("/") ? normalized : `/${normalized}`
  return stripTrailingSlashFromPath(withLeadingSlash)
}

export const localePathPrefix = (locale: string, defaultLocale = DEFAULT_LOCALE): string => {
  return locale === defaultLocale ? "" : `/${locale}`
}

export const normalizeDefaultLocalePath = (
  path: string,
  defaultLocale = DEFAULT_LOCALE
): string => {
  const normalized = normalizeUrlPath(path)
  return normalized.replace(new RegExp(`^/${defaultLocale}(?=/|$)`), "") || "/"
}

export const localizedPath = (
  locale: string,
  path: string,
  defaultLocale = DEFAULT_LOCALE
): string => {
  const prefix = localePathPrefix(locale, defaultLocale)
  const normalizedPath = normalizeUrlPath(path)

  if (!prefix) return normalizedPath
  if (normalizedPath === "/") return prefix
  return `${prefix}${normalizedPath}`
}

const localeNeutralPath = (
  path: string,
  localeCodes: readonly string[],
  defaultLocale = DEFAULT_LOCALE
): string => {
  const normalized = normalizeUrlPath(path)

  for (const code of localeCodes) {
    if (code === defaultLocale) continue

    const prefix = `/${code}`
    if (normalized === prefix) return "/"
    if (normalized.startsWith(`${prefix}/`)) {
      return normalizeUrlPath(normalized.slice(prefix.length) || "/")
    }
  }

  return normalizeDefaultLocalePath(normalized, defaultLocale)
}

export const localizedCanonicalPath = (
  locale: string,
  path: string,
  localeCodes: readonly string[],
  defaultLocale = DEFAULT_LOCALE
): string =>
  localizedPath(locale, localeNeutralPath(path, localeCodes, defaultLocale), defaultLocale)

export const absoluteUrl = (siteUrl: string, path: string): string => {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl)
  const normalizedPath = normalizeUrlPath(path)
  return normalizedPath === "/" ? `${normalizedSiteUrl}/` : `${normalizedSiteUrl}${normalizedPath}`
}
