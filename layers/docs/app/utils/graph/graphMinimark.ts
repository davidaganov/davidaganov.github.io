type MinimarkChild = string | MinimarkNode
type MinimarkNode = string[] | MinimarkDoc

interface MinimarkDoc {
  type: "minimark"
  value: MinimarkChild[]
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null

const walk = (node: unknown, out: Set<string>): void => {
  if (!node) return
  if (typeof node === "string") return

  if (Array.isArray(node)) {
    const tag = node[0]
    const props = node[1]
    if (tag === "a" && isRecord(props) && typeof props.href === "string" && props.href.length > 0) {
      out.add(props.href)
    }
    for (let i = 2; i < node.length; i++) walk(node[i], out)
    return
  }

  if (isRecord(node) && node.type === "minimark" && Array.isArray(node.value)) {
    for (const ch of node.value) walk(ch, out)
  }
}

export const extractHrefsFromContentBody = (body: unknown): string[] => {
  const out = new Set<string>()

  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body) as unknown
      walk(parsed, out)
    } catch {
      return []
    }
    return [...out]
  }

  walk(body, out)
  return [...out]
}
