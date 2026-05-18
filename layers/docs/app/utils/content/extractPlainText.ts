const joinParts = (parts: string[]): string => {
  return parts.filter(Boolean).join(" ").replace(/ {2,}/g, " ")
}

export const extractPlainText = (node: unknown, limit = 2000): string => {
  if (!node) return ""
  if (typeof node === "string") return node

  if (typeof node === "object" && !Array.isArray(node)) {
    const n = node as Record<string, unknown>

    if (Array.isArray(n.value)) {
      const parts: string[] = []
      for (const child of n.value) {
        parts.push(extractPlainText(child, limit))
        if (joinParts(parts).length >= limit) break
      }
      return joinParts(parts)
    }

    if (n.type === "text" && typeof n.value === "string") return n.value
    if (Array.isArray(n.children)) {
      const parts: string[] = []
      for (const child of n.children) {
        parts.push(extractPlainText(child, limit))
        if (joinParts(parts).length >= limit) break
      }
      return joinParts(parts)
    }

    return ""
  }

  if (Array.isArray(node)) {
    const parts: string[] = []
    for (let i = 2; i < node.length; i++) {
      parts.push(extractPlainText(node[i], limit))
      if (joinParts(parts).length >= limit) break
    }
    return joinParts(parts)
  }

  return ""
}

export const snippetAroundQuery = (
  body: unknown,
  query: string,
  maxLen = 120
): string | undefined => {
  const text = extractPlainText(body)
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
