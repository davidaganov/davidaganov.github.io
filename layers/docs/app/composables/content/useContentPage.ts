import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { publicPathToContentPath } from "@docs/utils/path/publicPath"

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
