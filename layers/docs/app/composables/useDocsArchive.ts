export interface DocsArchiveEntry {
  path: string
  content: string
}

type ArchiveKind = "tools" | "guides" | null

const toolArchiveSources = import.meta.glob("../content/tools/**/*", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>

const guideArchiveSources = import.meta.glob("../content/guides/**/*", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>

const normalizeSegment = (segment: unknown): string => String(segment || "").trim()

const toSlugSegments = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(normalizeSegment).filter(Boolean)
  const normalized = normalizeSegment(value)
  return normalized ? [normalized] : []
}

const toArchiveName = (section: string, slugSegments: string[]) => {
  const base = [section, ...slugSegments]
    .join("-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()

  return `${base || "archive"}.zip`
}

const collectEntries = (source: Record<string, string>, prefix: string): DocsArchiveEntry[] => {
  return Object.entries(source)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, content]) => ({
      path: path.slice(prefix.length),
      content
    }))
    .filter((entry) => Boolean(entry.path))
    .sort((a, b) => a.path.localeCompare(b.path))
}

const resolveGuidePrefix = (slugSegments: string[]): string => {
  if (!slugSegments.length) return ""

  const candidates = [
    `../content/guides/${slugSegments.join("/")}/`,
    `../content/guides/${slugSegments.slice(-1)[0] || ""}/`
  ]

  for (const candidate of candidates) {
    if (
      !candidate.endsWith("//") &&
      Object.keys(guideArchiveSources).some((path) => path.startsWith(candidate))
    ) {
      return candidate
    }
  }

  return ""
}

export const useDocsArchive = () => {
  const route = useRoute()

  const section = computed(() => normalizeSegment(route.params.section))
  const slugSegments = computed(() => toSlugSegments(route.params.slug))

  const archiveKind = computed<ArchiveKind>(() => {
    if (section.value === "tools" && slugSegments.value.length > 1) return "tools"
    if (section.value === "guides" && slugSegments.value.length > 0) return "guides"
    return null
  })

  const sourcePrefix = computed(() => {
    if (archiveKind.value === "tools") {
      return `../content/tools/${slugSegments.value.join("/")}/`
    }

    if (archiveKind.value === "guides") {
      return resolveGuidePrefix(slugSegments.value)
    }

    return ""
  })

  const archiveEntries = computed<DocsArchiveEntry[]>(() => {
    const prefix = sourcePrefix.value
    if (!prefix || !archiveKind.value) return []

    const source = archiveKind.value === "tools" ? toolArchiveSources : guideArchiveSources
    return collectEntries(source, prefix)
  })

  const archiveName = computed(() => toArchiveName(section.value, slugSegments.value))
  const hasArchive = computed(() => archiveEntries.value.length > 0)

  return {
    archiveEntries,
    archiveName,
    hasArchive
  }
}
