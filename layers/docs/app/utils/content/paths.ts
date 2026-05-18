import { ROUTE_PATH } from "@base/types"

export const toContentPrefix = (publicPathPrefix: string): string => {
  if (publicPathPrefix.startsWith(ROUTE_PATH.DOCS)) {
    const rest = publicPathPrefix.slice(ROUTE_PATH.DOCS.length).replace(/^\//, "")
    return rest ? `/${rest}` : ROUTE_PATH.HOME
  }

  return publicPathPrefix
}

const normalizeRelativeSlice = (slice: string): string => {
  if (!slice) return ""
  return slice.startsWith("/") ? slice : `/${slice}`
}

export const toRelativeContentPath = (fullPath: string, contentPrefix: string): string => {
  if (contentPrefix === ROUTE_PATH.HOME) {
    const idx = fullPath.indexOf(contentPrefix)
    if (idx === -1) return ""
    return normalizeRelativeSlice(fullPath.slice(idx + contentPrefix.length))
  }

  const path = fullPath.replace(/^\/+/, "")
  const prefix = contentPrefix.replace(/^\/+/, "")
  if (!path.startsWith(prefix)) return ""
  return normalizeRelativeSlice(path.slice(prefix.length))
}
