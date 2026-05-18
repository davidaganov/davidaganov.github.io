import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { findContentMapping } from "@docs/utils/path/pathMapping"
import { normalizePublicDocsPath } from "@docs/utils/path/publicPath"
import { ROUTE_PATH } from "@base/types"

export const publicPathToContentPath = (publicPath: string): string => {
  const normalized = normalizePublicDocsPath(publicPath)
  if (!normalized.startsWith(ROUTE_PATH.DOCS)) {
    return normalized.startsWith("/") ? normalized : `/${normalized}`
  }

  const stripped = normalized.slice(ROUTE_PATH.DOCS.length) || "/"
  const contentPath = stripped.startsWith("/") ? stripped : `/${stripped}`
  return findContentMapping(contentPath)?.path ?? contentPath
}

export const useContentPage = (publicPath: Ref<string> | string) => {
  const pathRef = toRef(publicPath)
  const { collection } = useContentCollection()

  return useAsyncData(
    () => `content-page:${collection.value}:${pathRef.value}`,
    async () => {
      const contentPath = publicPathToContentPath(pathRef.value)
      if (!contentPath) return null
      return await queryCollection(collection.value).path(contentPath).first()
    },
    {
      watch: [pathRef, collection]
    }
  )
}
