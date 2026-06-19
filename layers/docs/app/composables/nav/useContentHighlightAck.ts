import type { SupabaseClient } from "@supabase/supabase-js"
import { useVisitorId } from "@docs/composables/nav/useVisitorId"
import { HIGHLIGHT_ACK_MAP_KEY, HIGHLIGHT_ACKS_STORAGE_KEY } from "@docs/constants"

const readLocalAcks = (): Record<string, number> => {
  if (!import.meta.client) return {}
  try {
    const raw = localStorage.getItem(HIGHLIGHT_ACKS_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, number>
  } catch {
    return {}
  }
}

const writeLocalAck = (slug: string, versionTs: number) => {
  if (!import.meta.client) return
  try {
    const acks = readLocalAcks()
    acks[slug] = Math.max(acks[slug] ?? 0, versionTs)
    localStorage.setItem(HIGHLIGHT_ACKS_STORAGE_KEY, JSON.stringify(acks))
  } catch (error) {
    console.error("Failed to write local highlight ack", error)
  }
}

const mergeAckMaps = (...maps: Record<string, number>[]): Record<string, number> => {
  const merged: Record<string, number> = {}
  for (const map of maps) {
    for (const [slug, ts] of Object.entries(map)) {
      merged[slug] = Math.max(merged[slug] ?? 0, ts)
    }
  }
  return merged
}

export const useContentHighlightAck = () => {
  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase as SupabaseClient | undefined
  const { visitorId } = useVisitorId()
  const ackMap = useState<Record<string, number>>(HIGHLIGHT_ACK_MAP_KEY, () => ({}))

  const loadAcks = async () => {
    if (!import.meta.client) return

    const localAcks = readLocalAcks()
    let remoteAcks: Record<string, number> = {}

    const id = visitorId.value
    if (id && supabase) {
      try {
        const { data, error } = await supabase.rpc("get_content_acks", {
          p_visitor_id: id
        })

        if (!error && Array.isArray(data)) {
          remoteAcks = Object.fromEntries(
            data.map((row: { slug: string; content_version_ts: number }) => [
              row.slug,
              Number(row.content_version_ts)
            ])
          )
        }
      } catch (error) {
        console.error("Failed to load highlight acks from Supabase", error)
      }
    }

    ackMap.value = mergeAckMaps(localAcks, remoteAcks)
  }

  const ackPage = async (slug: string, versionTs: number) => {
    if (!import.meta.client || !slug || versionTs <= 0) return

    const current = ackMap.value[slug] ?? 0
    if (current >= versionTs) return

    ackMap.value = { ...ackMap.value, [slug]: versionTs }
    writeLocalAck(slug, versionTs)

    const id = visitorId.value
    if (!id || !supabase) return

    try {
      await supabase.rpc("ack_content_seen", {
        p_visitor_id: id,
        p_slug: slug,
        p_content_version_ts: versionTs
      })
    } catch (error) {
      console.error("Failed to ack highlight in Supabase", error)
    }
  }

  return {
    ackMap,
    loadAcks,
    ackPage
  }
}
