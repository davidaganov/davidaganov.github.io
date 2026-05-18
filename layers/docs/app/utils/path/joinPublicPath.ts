import { ROUTE_PATH } from "@base/types"

export const joinPublicDocsPath = (publicPrefix: string, relativePath = ""): string => {
  const prefix = (publicPrefix || ROUTE_PATH.DOCS).replace(/\/+$/, "") || ROUTE_PATH.DOCS
  const relative = String(relativePath || "").replace(/^\/+/, "")
  if (!relative) return prefix
  return `${prefix}/${relative}`
}

export const docsPathFromContentPath = (contentPath: string): string => {
  return joinPublicDocsPath(ROUTE_PATH.DOCS, contentPath)
}
