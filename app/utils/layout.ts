import { DEFAULT_LOCALE, normalizeUrlPath } from "@app/utils/seo"
import { isSiteLocaleCode } from "@app/constants/siteLocaleCodes"
import { ROUTE_PATH } from "@base/types"

export type AppPageLayoutName = "home" | "standalone" | "default" | "clean"

export const stripLocalePathPrefix = (path: string): string => {
  const normalized = normalizeUrlPath(path.split("?")[0] ?? path)
  const segments = normalized.split("/").filter(Boolean)
  const first = segments[0]

  if (first && isSiteLocaleCode(first) && first !== DEFAULT_LOCALE) {
    return `/${segments.slice(1).join("/")}`
  }

  return normalized
}

export const resolveLayoutNameForPath = (path: string): AppPageLayoutName => {
  const stripped = stripLocalePathPrefix(path)

  if (stripped === ROUTE_PATH.HOME) return "home"
  if (stripped === ROUTE_PATH.RESUME || stripped === ROUTE_PATH.FEED) return "standalone"
  if (stripped === ROUTE_PATH.DOCS || stripped.startsWith(`${ROUTE_PATH.DOCS}/`)) {
    return "default"
  }

  return "clean"
}
