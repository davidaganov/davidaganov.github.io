import type { SupabaseClient } from "@supabase/supabase-js"

const VIEW_TTL_MS = 24 * 60 * 60 * 1000

interface ViewCache {
  count: number
  visitedAt: number
}

const getCacheKey = (slug: string) => `pv:${slug}`

const readCache = (slug: string): ViewCache | null => {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(getCacheKey(slug))
    if (!raw) return null
    return JSON.parse(raw) as ViewCache
  } catch {
    return null
  }
}

const writeCache = (slug: string, count: number) => {
  if (!import.meta.client) return
  try {
    const entry: ViewCache = { count, visitedAt: Date.now() }
    localStorage.setItem(getCacheKey(slug), JSON.stringify(entry))
  } catch (error) {
    console.error(error)
  }
}

const isCacheValid = (cache: ViewCache): boolean => {
  return Date.now() - cache.visitedAt < VIEW_TTL_MS
}

export const usePageViews = (slug: Ref<string> | string) => {
  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase as SupabaseClient

  const views = ref<number | null>(null)
  const loading = ref(false)

  const trackAndFetch = async () => {
    const slugValue = typeof slug === "string" ? slug : slug.value
    if (!slugValue || !supabase) return

    const cache = readCache(slugValue)

    if (cache && isCacheValid(cache)) {
      views.value = cache.count
      return
    }

    loading.value = true
    try {
      const { data, error } = await supabase.rpc("increment_page_view", {
        p_slug: slugValue
      })

      if (!error && data !== null) {
        const newCount = data as number
        views.value = newCount
        writeCache(slugValue, newCount)
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  if (import.meta.client) {
    onMounted(() => {
      trackAndFetch()
    })
  }

  return {
    views: readonly(views),
    loading: readonly(loading)
  }
}
