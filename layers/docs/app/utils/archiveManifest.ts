let cachedKeys: Set<string> | null = null

export const loadArchiveIndex = async (): Promise<Set<string>> => {
  if (cachedKeys) return cachedKeys
  try {
    const response = await fetch("/archive-index.json", {
      headers: { Accept: "application/json" }
    })

    if (!response.ok) throw new Error("archive index not found")
    const data = (await response.json()) as { keys: string[] }
    cachedKeys = new Set(data.keys)
  } catch {
    cachedKeys = new Set()
  }
  return cachedKeys
}
