import { ROUTE_PATH } from "@base/types/enums"

export const getQueryPrefix = (pathPrefix: string): string => {
  if (pathPrefix.startsWith(ROUTE_PATH.DOCS)) {
    const rest = pathPrefix.slice(ROUTE_PATH.DOCS.length).replace(/^\//, "")
    return rest || ROUTE_PATH.HOME
  }

  return pathPrefix
}

export const getRelativePath = (fullPath: string, queryPrefix: string): string => {
  if (queryPrefix === ROUTE_PATH.HOME) {
    const idx = fullPath.indexOf(queryPrefix)
    if (idx === -1) return ""
    return fullPath.slice(idx + queryPrefix.length)
  }

  const path = fullPath.replace(/^\/+/, "")
  const prefix = queryPrefix.replace(/^\/+/, "")
  if (!path.startsWith(prefix)) return ""
  return path.slice(prefix.length)
}
