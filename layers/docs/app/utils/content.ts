import { ROUTE_PATH } from "@base/types/enums"

export const getQueryPrefix = (pathPrefix: string): string => {
  if (pathPrefix.startsWith(ROUTE_PATH.DOCS)) {
    return pathPrefix.replace(/^\/docs/, "") || ROUTE_PATH.HOME
  }

  return pathPrefix
}

export const getRelativePath = (fullPath: string, queryPrefix: string): string => {
  const idx = fullPath.indexOf(queryPrefix)
  if (idx === -1) return ""
  return fullPath.slice(idx + queryPrefix.length)
}
