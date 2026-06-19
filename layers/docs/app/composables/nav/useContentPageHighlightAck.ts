import { useContentHighlights } from "@docs/composables/nav/useContentHighlights"
import { getContentVersionTs } from "@docs/utils/content/version"
import type { ContentVersionMeta } from "@docs/utils/content/version"
import { normalizePublicDocsPath } from "@docs/utils/path/publicPath"

export const useContentPageHighlightAck = (meta: Ref<ContentVersionMeta | undefined>) => {
  const route = useRoute()
  const { ackPage } = useContentHighlights()

  if (!import.meta.client) return

  onMounted(() => {
    const slug = normalizePublicDocsPath(route.path)
    const versionTs = getContentVersionTs(meta.value)
    if (!slug || versionTs <= 0) return
    void ackPage(slug, versionTs)
  })
}
