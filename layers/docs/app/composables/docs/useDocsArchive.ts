import { loadArchiveIndex, toArchiveKeySet } from "@docs/utils/archiveManifest"
import type { DocsArchiveEntry } from "@docs/types"

const contentModules = import.meta.glob("../content/**/*", {
  query: "?raw",
  import: "default"
}) as Record<string, () => Promise<string>>

const resolveArchiveKeyFromRoute = (
  keys: Set<string>,
  section: string,
  slugSegments: string[]
): string => {
  if (!keys?.has || !section || !slugSegments.length) return ""

  const candidates: string[] = []
  for (let depth = slugSegments.length; depth >= 1; depth -= 1) {
    candidates.push(`${section}/${slugSegments.slice(0, depth).join("/")}`)
  }

  const lastSegment = slugSegments.at(-1)
  if (lastSegment) candidates.push(`${section}/${lastSegment}`)

  const seen = new Set<string>()
  for (const candidate of candidates) {
    if (seen.has(candidate)) continue
    seen.add(candidate)
    if (keys.has(candidate)) return candidate
  }

  return ""
}

const normalizeSegment = (segment: unknown): string => String(segment || "").trim()

const toSlugSegments = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(normalizeSegment).filter(Boolean)
  const normalized = normalizeSegment(value)
  return normalized ? [normalized] : []
}

const toArchiveName = (archiveKey: string) => {
  const base = archiveKey
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()

  return `${base || "archive"}.zip`
}

const collectEntries = async (
  modules: Record<string, () => Promise<string>>,
  vfsPrefix: string
): Promise<DocsArchiveEntry[]> => {
  const entries = Object.entries(modules)
    .filter(([path]) => path.startsWith(vfsPrefix))
    .map(async ([path, loader]) => ({
      path: path.slice(vfsPrefix.length),
      content: await loader()
    }))

  return Promise.all(entries).then((list) =>
    list.filter((entry) => Boolean(entry.path)).sort((a, b) => a.path.localeCompare(b.path))
  )
}

export const useDocsArchive = () => {
  const route = useRoute()

  const section = computed(() => normalizeSegment(route.params.section))
  const slugSegments = computed(() => toSlugSegments(route.params.slug))

  const { data: archiveKeyList } = useAsyncData("docs-archive-index", () => loadArchiveIndex(), {
    default: () => [] as string[],
    getCachedData: (key, nuxtApp) => {
      const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
      return Array.isArray(cached) ? cached : undefined
    }
  })

  const archiveKeys = computed(() => toArchiveKeySet(archiveKeyList.value))

  const archiveKey = computed(() => {
    return resolveArchiveKeyFromRoute(archiveKeys.value, section.value, slugSegments.value)
  })

  const vfsPrefix = computed(() => (archiveKey.value ? `../content/${archiveKey.value}/` : ""))

  const { data: archiveEntries, pending } = useAsyncData(
    () => `docs-archive:${archiveKey.value}`,
    async (): Promise<DocsArchiveEntry[]> => {
      const prefix = vfsPrefix.value
      if (!prefix) return []
      return collectEntries(contentModules, prefix)
    },
    { watch: [archiveKey] }
  )

  const archiveName = computed(() => toArchiveName(archiveKey.value))

  const hasArchive = computed(() => {
    return Boolean(archiveKey.value && (archiveEntries.value?.length ?? 0) > 0)
  })

  return {
    archiveEntries: computed(() => archiveEntries.value ?? []),
    archiveName,
    hasArchive,
    loading: pending
  }
}
