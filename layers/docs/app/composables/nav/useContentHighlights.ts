import { useContentCollection } from "@docs/composables/content/useContentCollection"
import { useContentHighlightAck } from "@docs/composables/nav/useContentHighlightAck"
import { useVisitorSession } from "@docs/composables/nav/useVisitorSession"
import {
  computeActiveHighlights,
  getPathPrefixHighlightFromMap,
  getSectionHighlightFromMap,
  toHighlightPageEntries
} from "@docs/utils/nav/highlightPages"
import { HIGHLIGHT_PAGES_KEY } from "@docs/constants"
import type { HighlightPageEntry, NavHighlightKind } from "@docs/types"

export const useContentHighlights = () => {
  const { collection } = useContentCollection()
  const { canShowHighlights, lastVisitAt } = useVisitorSession()
  const { ackMap, loadAcks, ackPage } = useContentHighlightAck()

  const highlightPages = useState<HighlightPageEntry[]>(HIGHLIGHT_PAGES_KEY, () => [])

  const { status } = useAsyncData(
    () => `nav-highlights:${collection.value}`,
    async () => {
      if (!import.meta.client) return []

      await loadAcks()

      const pages = await queryCollection(collection.value).select("path", "meta").all()

      const entries = toHighlightPageEntries(pages)
      highlightPages.value = entries
      return entries
    },
    {
      watch: [collection],
      server: false
    }
  )

  const activeHighlights = computed<Record<string, NavHighlightKind>>(() => {
    if (!canShowHighlights.value || status.value !== "success") return {}

    const baseline = lastVisitAt.value
    if (!baseline) return {}

    return computeActiveHighlights(highlightPages.value, baseline, ackMap.value)
  })

  const getPageHighlight = (slug: string): NavHighlightKind | null => {
    if (!slug) return null
    return activeHighlights.value[slug] ?? null
  }

  const getSectionHighlight = (sectionId: string): NavHighlightKind | null => {
    return getSectionHighlightFromMap(activeHighlights.value, sectionId)
  }

  const getCollectionHighlight = (pathPrefix: string): NavHighlightKind | null => {
    return getPathPrefixHighlightFromMap(activeHighlights.value, pathPrefix)
  }

  return {
    activeHighlights,
    getPageHighlight,
    getSectionHighlight,
    getCollectionHighlight,
    ackPage
  }
}
