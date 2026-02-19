import type { Collections } from "@nuxt/content"
import { TYPE_PAGE } from "@docs/types/enums"

type RawPage = {
  title?: string
  description?: string
  path: string
  body?: unknown
  meta?: { icon?: string }
}

export interface SearchResult {
  title: string
  path: string
  category: TYPE_PAGE
  breadcrumb: string[]
  snippet?: string
  icon: string
}

const joinParts = (parts: string[]): string => {
  return parts.filter(Boolean).join(" ").replace(/ {2,}/g, " ")
}

const extractText = (node: unknown, limit = 2000): string => {
  if (!node) return ""
  if (typeof node === "string") return node
  if (typeof node === "object" && !Array.isArray(node)) {
    const n = node as Record<string, unknown>
    if (Array.isArray(n.value)) {
      const parts: string[] = []
      for (const child of n.value) {
        parts.push(extractText(child, limit))
        if (joinParts(parts).length >= limit) break
      }
      return joinParts(parts)
    }
    if (n.type === "text" && typeof n.value === "string") return n.value
    if (Array.isArray(n.children)) {
      const parts: string[] = []
      for (const child of n.children) {
        parts.push(extractText(child, limit))
        if (joinParts(parts).length >= limit) break
      }
      return joinParts(parts)
    }
    return ""
  }

  if (Array.isArray(node)) {
    const parts: string[] = []
    for (let i = 2; i < node.length; i++) {
      parts.push(extractText(node[i], limit))
      if (joinParts(parts).length >= limit) break
    }
    return joinParts(parts)
  }

  return ""
}

const getSnippet = (body: unknown, query: string, maxLen = 120): string | undefined => {
  const text = extractText(body)
  if (!text) return undefined

  const lower = text.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return undefined

  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + query.length + 80)
  const snippet =
    (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "")

  return snippet.length > maxLen + 6 ? snippet.slice(0, maxLen) + "..." : snippet
}

const matchesQuery = (page: RawPage, query: string): boolean => {
  const q = query.toLowerCase()
  const inTitle = (page.title || "").toLowerCase().includes(q)
  const inDesc = (page.description || "").toLowerCase().includes(q)
  const inBody = extractText(page.body).toLowerCase().includes(q)
  return inTitle || inDesc || inBody
}

const buildBreadcrumb = (path: string, category: TYPE_PAGE, title: string): string[] => {
  if (category === TYPE_PAGE.ARTICLE) return ["Articles", title]
  if (category === TYPE_PAGE.PROJECT) return ["Projects", title]

  const segments = path.replace(/^\//, "").split("/")
  return segments.length > 1 ? [segments.slice(0, -1).join(" > "), title] : [title]
}

const getIcon = (page: RawPage, category: TYPE_PAGE): string => {
  const metaIcon = (page.meta as { icon?: string } | undefined)?.icon
  if (metaIcon) return metaIcon
  if (category === TYPE_PAGE.ARTICLE) return "i-lucide-newspaper"
  if (category === TYPE_PAGE.PROJECT) return "i-lucide-folder-git-2"
  return "i-lucide-file-text"
}

export const useDocsSearch = (query: Ref<string>) => {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const { locale } = useI18n()

  const debouncedQuery = ref(query.value)

  const collection = computed(() => `content_${locale.value}` as keyof Collections)

  const grouped = computed(() => {
    const list = results.value || []
    const groups: Record<TYPE_PAGE, SearchResult[]> = {
      [TYPE_PAGE.DOCS]: [],
      [TYPE_PAGE.ARTICLE]: [],
      [TYPE_PAGE.PROJECT]: []
    }
    for (const item of list) {
      groups[item.category].push(item)
    }
    return groups
  })

  const flatResults = computed(() => {
    return [
      ...(grouped.value[TYPE_PAGE.DOCS] || []),
      ...(grouped.value[TYPE_PAGE.ARTICLE] || []),
      ...(grouped.value[TYPE_PAGE.PROJECT] || [])
    ]
  })

  const isLoading = computed(() => status.value === "pending")

  const { data: results, status } = useAsyncData<SearchResult[]>(
    () => `docs-search:${collection.value}:${debouncedQuery.value}`,
    async () => {
      const q = debouncedQuery.value.trim()
      if (!q) return []

      const all = await queryCollection(collection.value)
        .select("title", "description", "path", "body", "meta")
        .all()

      const matched = (all as RawPage[]).filter((page) => matchesQuery(page, q))

      return matched.map((page): SearchResult => {
        const path = String(page.path || "")
        let category: TYPE_PAGE = TYPE_PAGE.DOCS
        if (path.includes("/articles/")) category = TYPE_PAGE.ARTICLE
        else if (path.includes("/projects/")) category = TYPE_PAGE.PROJECT

        const title = String(page.title || "")
        const fullPath = `/docs${path}`

        return {
          title,
          path: fullPath,
          category,
          breadcrumb: buildBreadcrumb(path, category, title),
          snippet: getSnippet(page.body, q),
          icon: getIcon(page, category)
        }
      })
    },
    {
      watch: [debouncedQuery, locale],
      default: () => []
    }
  )

  watch(query, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = val
    }, 200)
  })

  return {
    results,
    grouped,
    flatResults,
    isLoading
  }
}
