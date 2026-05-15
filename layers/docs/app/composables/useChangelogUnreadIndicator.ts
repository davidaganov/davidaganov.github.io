import type { Collections } from "@nuxt/content"
import { isChangelogDocsPath } from "@docs/utils/sections"

const SESSION_BUMP_KEY = "portfolio:visit_session_bumped"
const VISIT_SESSION_COUNT_KEY = "portfolio:visit_session_count"
const CHANGELOG_ACK_TS_KEY = "portfolio:changelog_ack_latest_ts"

const releaseTimestamp = (path: string, publishedAt: unknown): number => {
  if (publishedAt != null && publishedAt !== "") {
    const t = Date.parse(String(publishedAt))
    if (!Number.isNaN(t)) return t
  }

  const m = path.match(/(\d{4}-\d{2}-\d{2})/)
  if (m) {
    const t = Date.parse(`${m[1]}T12:00:00.000Z`)
    if (!Number.isNaN(t)) return t
  }

  return 0
}

export const useChangelogUnreadIndicator = () => {
  const route = useRoute()
  const { locale } = useI18n()

  const showUnreadDot = ref(false)

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  const { data: latestReleaseTs } = useAsyncData(
    () => `changelog-latest-release:${locale.value}`,
    async () => {
      const pages = await queryCollection(collection.value)
        .where("path", "LIKE", "%/changelog/releases/%")
        .select("path", "meta")
        .all()

      let max = 0
      for (const p of pages) {
        const meta = p.meta as { publishedAt?: string } | undefined
        max = Math.max(max, releaseTimestamp(String(p.path || ""), meta?.publishedAt))
      }
      return max
    },
    { watch: [locale] }
  )

  const bumpSessionVisitIfNeeded = () => {
    if (import.meta.server) return
    try {
      if (sessionStorage.getItem(SESSION_BUMP_KEY)) return
      sessionStorage.setItem(SESSION_BUMP_KEY, "1")
      const prev = Number(localStorage.getItem(VISIT_SESSION_COUNT_KEY) || "0")
      localStorage.setItem(VISIT_SESSION_COUNT_KEY, String(prev + 1))
    } catch (error) {
      console.error("Failed to bump session visit", error)
    }
  }

  const readAckTs = (): number => {
    if (import.meta.server) return 0
    try {
      return Number(localStorage.getItem(CHANGELOG_ACK_TS_KEY) || "0")
    } catch (error) {
      console.error("Failed to read changelog ack timestamp", error)
      return 0
    }
  }

  const acknowledgeChangelog = (ts: number) => {
    if (import.meta.server) return
    try {
      localStorage.setItem(CHANGELOG_ACK_TS_KEY, String(ts))
    } catch (error) {
      console.error("Failed to acknowledge changelog", error)
    }
    showUnreadDot.value = false
  }

  const recomputeUnread = () => {
    if (import.meta.server) return
    const visits = Number(localStorage.getItem(VISIT_SESSION_COUNT_KEY) || "1")
    const latest = latestReleaseTs.value || 0
    const ack = readAckTs()
    showUnreadDot.value = visits >= 2 && latest > 0 && latest > ack
  }

  const syncRouteAndUnread = () => {
    if (import.meta.server) return
    const latest = latestReleaseTs.value || 0
    if (isChangelogDocsPath(route.path) && latest > 0) {
      acknowledgeChangelog(latest)
      return
    }

    recomputeUnread()
  }

  watch([latestReleaseTs, () => route.path], () => {
    syncRouteAndUnread()
  })

  onMounted(() => {
    bumpSessionVisitIfNeeded()
    syncRouteAndUnread()
  })

  return {
    showUnreadDot: readonly(showUnreadDot)
  }
}
