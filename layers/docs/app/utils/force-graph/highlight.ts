import { baseNodeHsl, dimmedNodeHsl, lerp, toHsla } from "@docs/utils/force-graph/theme"
import type { DocsGraphLink, DocsGraphNode, GraphHighlightState } from "@docs/types"

const HOVER_BLEND_MS = 260

export const createHighlightState = (): GraphHighlightState => ({
  focusId: null,
  neighbors: new Set(),
  blend: 0
})

export const buildAdjacency = (links: DocsGraphLink[]): Map<string, Set<string>> => {
  const adjacency = new Map<string, Set<string>>()
  const add = (a: string, b: string): void => {
    if (!adjacency.has(a)) adjacency.set(a, new Set())
    if (!adjacency.has(b)) adjacency.set(b, new Set())
    adjacency.get(a)!.add(b)
    adjacency.get(b)!.add(a)
  }

  for (const link of links) {
    add(String(link.source), String(link.target))
  }

  return adjacency
}

export const linkEndpointId = (value: DocsGraphNode | string): string => {
  return typeof value === "object" && value !== null && "id" in value
    ? String(value.id)
    : String(value)
}

export const createHighlightController = (
  state: GraphHighlightState,
  getActiveNode: () => DocsGraphNode | undefined
) => {
  let rafId = 0
  let onDone: (() => void) | null = null

  const animateBlend = (target: number, done?: () => void): void => {
    onDone = done ?? null
    const from = state.blend
    const started = performance.now()

    const step = (now: number): void => {
      const t = Math.min(1, (now - started) / HOVER_BLEND_MS)
      const eased = 1 - (1 - t) ** 3
      state.blend = from + (target - from) * eased
      if (t < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        state.blend = target
        const callback = onDone
        onDone = null
        callback?.()
      }
    }

    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(step)
  }

  const setHover = (node: DocsGraphNode | null, adjacency: Map<string, Set<string>>): void => {
    cancelAnimationFrame(rafId)
    onDone = null

    if (node) {
      state.focusId = node.id
      state.neighbors.clear()

      for (const id of adjacency.get(node.id) ?? []) {
        state.neighbors.add(id)
      }

      animateBlend(1)
      return
    }

    animateBlend(0, () => {
      state.focusId = null
      state.neighbors.clear()
    })
  }

  const dispose = (): void => {
    cancelAnimationFrame(rafId)
    rafId = 0
    onDone = null
    state.blend = 0
    state.focusId = null
    state.neighbors.clear()
  }

  const nodeVal = (node: DocsGraphNode): number => {
    const base = node.kind === "index" ? 2.6 : 1
    const u = state.blend
    if (!state.focusId || u < 0.001) return base
    if (node.id === state.focusId) return base * lerp(1, 1.9, u)
    if (state.neighbors.has(node.id)) return base * lerp(1, 1.45, u)
    return base * lerp(1, 0.75, u)
  }

  const nodeColor = (node: DocsGraphNode): string => {
    const base = baseNodeHsl(node)
    const u = state.blend
    if (!state.focusId || u < 0.001) return toHsla(base)

    if (node.id === state.focusId) {
      return toHsla({ ...base, a: lerp(base.a, 0.98, u) })
    }
    if (state.neighbors.has(node.id)) {
      return toHsla({ ...base, a: lerp(base.a, 0.92, u) })
    }

    const dim = dimmedNodeHsl(node)
    return toHsla({
      h: base.h,
      s: lerp(base.s, dim.s, u),
      l: lerp(base.l, dim.l, u),
      a: lerp(base.a, dim.a, u)
    })
  }

  const linkColor = (sourceId: string, targetId: string): string => {
    const u = state.blend
    if (!state.focusId || u < 0.001) return "rgba(140, 140, 160, 0.35)"

    const hit =
      (sourceId === state.focusId && state.neighbors.has(targetId)) ||
      (targetId === state.focusId && state.neighbors.has(sourceId))

    if (hit) {
      const activeNode = getActiveNode()
      if (activeNode) {
        const base = baseNodeHsl(activeNode)
        return `hsla(${base.h}, 72%, 58%, ${lerp(0.35, 0.85, u)})`
      }
      return `rgba(180, 180, 200, ${lerp(0.35, 0.85, u)})`
    }

    return `rgba(90, 90, 110, ${lerp(0.35, 0.06, u)})`
  }

  const linkWidth = (sourceId: string, targetId: string): number => {
    const u = state.blend
    if (!state.focusId || u < 0.001) return 0.6

    const hit =
      (sourceId === state.focusId && state.neighbors.has(targetId)) ||
      (targetId === state.focusId && state.neighbors.has(sourceId))

    return hit ? lerp(0.6, 1.35, u) : lerp(0.6, 0.35, u)
  }

  const labelAlpha = (nodeId: string): number => {
    const u = state.blend
    if (!state.focusId || u < 0.001) return 0.92
    if (nodeId === state.focusId) return lerp(0.92, 0.98, u)
    if (state.neighbors.has(nodeId)) return lerp(0.92, 0.95, u)
    return lerp(0.92, 0.38, u)
  }

  return {
    setHover,
    dispose,
    nodeVal,
    nodeColor,
    linkColor,
    linkWidth,
    labelAlpha
  }
}
