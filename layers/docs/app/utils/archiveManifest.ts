import { archiveKeyFromPaths } from "@docs/utils/content/paths"

let cachedKeys: Set<string> | null = null

export const loadArchiveIndex = async (): Promise<Set<string>> => {
  if (cachedKeys) return cachedKeys
  try {
    const data = await $fetch<{ keys: string[] }>("/archive-index.json")
    cachedKeys = new Set(data.keys)
  } catch {
    cachedKeys = new Set()
  }
  return cachedKeys
}

export const hasArchiveAtSync = (
  keys: Set<string>,
  publicPathPrefix: string,
  relativePath: string
): boolean => {
  const key = archiveKeyFromPaths(publicPathPrefix, relativePath)
  return Boolean(key && keys.has(key))
}

export const resolveArchiveKeyFromRoute = (
  keys: Set<string>,
  section: string,
  slugSegments: string[]
): string => {
  if (!section || !slugSegments.length) return ""

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
