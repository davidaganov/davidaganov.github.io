import type { Collections } from "@nuxt/content"
import { DOCS_SECTIONS } from "@docs/config/sections"
import { TYPE_PAGE } from "@docs/types/enums"
import type { SidebarCollectionItem } from "@docs/types/sidebar"

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

interface ContentMapping {
  path: string
  sectionId: string
  collectionSource?: string
  collectionLabel?: string
  isCollectionItem: boolean
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

const findContentMapping = (contentPath: string): ContentMapping | null => {
  const path = contentPath.startsWith("/") ? contentPath : `/${contentPath}`
  const segments = path.split("/").filter(Boolean)

  for (const section of DOCS_SECTIONS) {
    for (const item of section.sidebarItems) {
      if (item.type === "collection") {
        const coll = item as SidebarCollectionItem
        const source = coll.source

        if (segments[0] === source) {
          return {
            path,
            sectionId: section.id,
            collectionSource: source,
            collectionLabel: coll.label,
            isCollectionItem: true
          }
        }

        if (segments[0] === section.id && segments[1] === source) {
          return {
            path,
            sectionId: section.id,
            collectionSource: source,
            collectionLabel: coll.label,
            isCollectionItem: true
          }
        }
      }
    }

    if (segments[0] === section.id) {
      return {
        path,
        sectionId: section.id,
        isCollectionItem: false
      }
    }
  }

  return null
}

const buildUrlFromMapping = (mapping: ContentMapping): string => {
  if (mapping.isCollectionItem && mapping.collectionSource) {
    return `/docs/${mapping.sectionId}/${mapping.collectionSource}${mapping.path.replace(/^\/(?:${mapping.sectionId}\/)?${mapping.collectionSource}/, "")}`
  }
  return `/docs${mapping.path}`
}

const getCategoryFromMapping = (mapping: ContentMapping): TYPE_PAGE => {
  if (!mapping.isCollectionItem) return TYPE_PAGE.DOCS
  if (mapping.collectionSource === "articles") return TYPE_PAGE.ARTICLE
  if (mapping.collectionSource === "projects") return TYPE_PAGE.PROJECT
  return TYPE_PAGE.DOCS
}

const buildBreadcrumbFromMapping = (
  mapping: ContentMapping,
  title: string,
  t: (key: string) => string
): string[] => {
  const section = DOCS_SECTIONS.find((s) => s.id === mapping.sectionId)
  const sectionLabel = section ? t(section.labelKey) : mapping.sectionId

  if (mapping.isCollectionItem && mapping.collectionSource) {
    const collectionLabel = mapping.collectionLabel
      ? t(mapping.collectionLabel)
      : mapping.collectionSource
    return [sectionLabel, collectionLabel, title]
  }

  const sectionPrefixRe = new RegExp(`^/(?:${mapping.sectionId})?/`)
  const segments = mapping.path.replace(sectionPrefixRe, "").split("/").filter(Boolean)
  if (segments.length > 1) {
    return [sectionLabel, ...segments.slice(0, -1), title]
  }

  return [sectionLabel, title]
}

const getIconFromMapping = (page: RawPage, mapping: ContentMapping): string => {
  const metaIcon = (page.meta as { icon?: string } | undefined)?.icon
  if (metaIcon) return metaIcon

  const category = getCategoryFromMapping(mapping)
  if (category === TYPE_PAGE.ARTICLE) return "i-lucide-newspaper"
  if (category === TYPE_PAGE.PROJECT) return "i-lucide-folder-git-2"
  return "i-lucide-file-text"
}

export const useDocsSearch = (query: Ref<string>) => {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const { locale, t } = useI18n()

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

      const matched = (all as RawPage[])
        .map((page) => ({ page, mapping: findContentMapping(page.path) }))
        .filter(({ page, mapping }) => mapping && matchesQuery(page, q))

      return matched.map(({ page, mapping }): SearchResult => {
        const title = String(page.title || "")
        const fullPath = buildUrlFromMapping(mapping!)
        const category = getCategoryFromMapping(mapping!)

        return {
          title,
          path: fullPath,
          category,
          breadcrumb: buildBreadcrumbFromMapping(mapping!, title, t),
          snippet: getSnippet(page.body, q),
          icon: getIconFromMapping(page, mapping!)
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
