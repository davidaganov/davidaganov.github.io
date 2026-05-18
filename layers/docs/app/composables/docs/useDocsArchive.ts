import { loadArchiveIndex, resolveArchiveKeyFromRoute } from "@docs/utils/archiveManifest"
import type { DocsArchiveEntry } from "@docs/types"

const contentModules = import.meta.glob("../content/**/*", {
  query: "?raw",
  import: "default"
}) as Record<string, () => Promise<string>>

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

  const { data: archiveKeys } = useAsyncData("docs-archive-index", () => loadArchiveIndex(), {
    default: () => new Set<string>()
  })

  const archiveKey = computed(() =>
    resolveArchiveKeyFromRoute(archiveKeys.value, section.value, slugSegments.value)
  )

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
