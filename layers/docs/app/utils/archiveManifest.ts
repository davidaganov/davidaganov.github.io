let cachedKeys: string[] | null = null

export const toArchiveKeySet = (keys: string[] | null | undefined): Set<string> =>
  new Set(keys ?? [])

export const loadArchiveIndex = async (): Promise<string[]> => {
  if (cachedKeys) return cachedKeys
  try {
    const response = await fetch("/api/docs/archive-index", {
      headers: { Accept: "application/json" }
    })

    if (!response.ok) throw new Error("archive index not found")
    const data = (await response.json()) as { keys: string[] }
    cachedKeys = data.keys
  } catch {
    cachedKeys = []
  }
  return cachedKeys
}
