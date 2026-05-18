import type { Ref } from "vue"
import { forceX, forceY } from "d3-force-3d"
import type { DocsGraphFile, DocsGraphLink, DocsGraphNode } from "@docs/types"

export function useDocsForceGraph(
  containerRef: Ref<HTMLElement | null>,
  data: Ref<DocsGraphFile>,
  settings: {
    attraction: Ref<number>
    repulsion: Ref<number>
    linkPull: Ref<number>
    nodeGap: Ref<number>
  },
  onNodeClick: (node: DocsGraphNode) => void
) {
  const HOVER_BLEND_MS = 260

  const { t } = useI18n()

  const graphRef = shallowRef<InstanceType<(typeof import("force-graph"))["default"]> | null>(null)

  let resizeObserver: ResizeObserver | null = null
  let instanceAlive = true

  let pullXInst: ReturnType<typeof forceX> | null = null
  let pullYInst: ReturnType<typeof forceY> | null = null

  let renderFocusId: string | null = null
  const renderNeighbors = new Set<string>()
  let adjacency: Map<string, Set<string>> = new Map()

  let highlightBlend = 0
  let hoverAnimRaf = 0
  let blendOnDone: (() => void) | null = null

  const linkEndpointId = (x: DocsGraphNode | string): string => {
    return typeof x === "object" && x !== null && "id" in x ? String(x.id) : String(x)
  }

  const rebuildAdjacency = (links: DocsGraphLink[]): void => {
    const next = new Map<string, Set<string>>()
    const add = (a: string, b: string): void => {
      if (!next.has(a)) next.set(a, new Set())
      if (!next.has(b)) next.set(b, new Set())
      next.get(a)!.add(b)
      next.get(b)!.add(a)
    }

    for (const l of links) {
      add(String(l.source), String(l.target))
    }

    adjacency = next
  }

  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

  const baseNodeHsl = (n: DocsGraphNode): { h: number; s: number; l: number; a: number } => ({
    h: (n.hueIndex * 53 + 265) % 360,
    s: 72,
    l: 58,
    a: n.kind === "index" ? 0.95 : 0.42
  })

  const dimmedHsl = (n: DocsGraphNode): { h: number; s: number; l: number; a: number } => ({
    h: (n.hueIndex * 53 + 265) % 360,
    s: 28,
    l: 42,
    a: 0.16
  })

  const toHsla = (o: { h: number; s: number; l: number; a: number }): string => {
    return `hsla(${o.h}, ${o.s}%, ${o.l}%, ${o.a})`
  }

  const resolveNodeTitle = (n: DocsGraphNode): string => {
    if (n.title?.trim()) return n.title.trim()
    if (n.titleKey) return t(n.titleKey)
    return n.id.replace(/^\/docs\/?/, "") || n.id
  }

  const nodeVal = (n: any): number => {
    const base = n.kind === "index" ? 2.6 : 1
    const u = highlightBlend
    if (!renderFocusId || u < 0.001) return base
    if (n.id === renderFocusId) return base * lerp(1, 1.9, u)
    if (renderNeighbors.has(n.id)) return base * lerp(1, 1.45, u)
    return base * lerp(1, 0.75, u)
  }

  const nodeColor = (n: any): string => {
    const base = baseNodeHsl(n)
    const u = highlightBlend

    if (!renderFocusId || u < 0.001) return toHsla(base)
    if (n.id === renderFocusId) {
      return toHsla({
        h: base.h,
        s: base.s,
        l: base.l,
        a: lerp(base.a, 0.98, u)
      })
    }
    if (renderNeighbors.has(n.id)) {
      return toHsla({
        h: base.h,
        s: base.s,
        l: base.l,
        a: lerp(base.a, 0.92, u)
      })
    }

    const dim = dimmedHsl(n)
    return toHsla({
      h: base.h,
      s: lerp(base.s, dim.s, u),
      l: lerp(base.l, dim.l, u),
      a: lerp(base.a, dim.a, u)
    })
  }

  const linkColor = (link: any): string => {
    const a = linkEndpointId(link.source)
    const b = linkEndpointId(link.target)
    const u = highlightBlend

    if (!renderFocusId || u < 0.001) return "rgba(140, 140, 160, 0.35)"
    const hit =
      (a === renderFocusId && renderNeighbors.has(b)) ||
      (b === renderFocusId && renderNeighbors.has(a))

    if (hit) {
      const activeNode = data.value.nodes.find((n) => n.id === renderFocusId)
      if (activeNode) {
        const base = baseNodeHsl(activeNode)
        return `hsla(${base.h}, 72%, 58%, ${lerp(0.35, 0.85, u)})`
      }
      return `rgba(180, 180, 200, ${lerp(0.35, 0.85, u)})`
    }
    return `rgba(90, 90, 110, ${lerp(0.35, 0.06, u)})`
  }

  const linkWidth = (link: any): number => {
    const a = linkEndpointId(link.source)
    const b = linkEndpointId(link.target)
    const u = highlightBlend

    if (!renderFocusId || u < 0.001) return 0.6
    const hit =
      (a === renderFocusId && renderNeighbors.has(b)) ||
      (b === renderFocusId && renderNeighbors.has(a))

    return hit ? lerp(0.6, 1.35, u) : lerp(0.6, 0.35, u)
  }

  const paintLabelBelowNode = (
    node: any,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ): void => {
    if (node.x === undefined || node.y === undefined) return
    const r = Math.sqrt(Math.max(0, nodeVal(node) || 1)) * 5
    const raw = resolveNodeTitle(node)
    const maxLen = 28
    const label = raw.length > maxLen ? `${raw.slice(0, maxLen - 1)}…` : raw
    const fontPx = Math.max(9, 11 / globalScale)

    ctx.font = `500 ${fontPx}px ui-sans-serif, system-ui, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const u = highlightBlend
    let a = 0.92

    if (renderFocusId && u > 0.001) {
      if (node.id === renderFocusId) a = lerp(0.92, 0.98, u)
      else if (renderNeighbors.has(node.id)) a = lerp(0.92, 0.95, u)
      else a = lerp(0.92, 0.38, u)
    }

    ctx.fillStyle = `rgba(248, 250, 252, ${a})`
    ctx.fillText(label, node.x, node.y + r + 3 / globalScale)
  }

  const animateHighlightBlend = (target: number, onDone?: () => void): void => {
    blendOnDone = onDone ?? null
    const from = highlightBlend
    const started = performance.now()

    const step = (now: number): void => {
      const t = Math.min(1, (now - started) / HOVER_BLEND_MS)
      const e = 1 - (1 - t) ** 3
      highlightBlend = from + (target - from) * e
      if (t < 1) hoverAnimRaf = requestAnimationFrame(step)
      else {
        highlightBlend = target
        const done = blendOnDone
        blendOnDone = null
        done?.()
      }
    }

    cancelAnimationFrame(hoverAnimRaf)
    hoverAnimRaf = requestAnimationFrame(step)
  }

  const setHover = (node: any): void => {
    cancelAnimationFrame(hoverAnimRaf)
    blendOnDone = null

    if (node) {
      renderFocusId = node.id
      renderNeighbors.clear()
      if (adjacency.has(node.id)) {
        for (const id of adjacency.get(node.id)!) {
          renderNeighbors.add(id)
        }
      }
      animateHighlightBlend(1)
    } else {
      animateHighlightBlend(0, () => {
        renderFocusId = null
        renderNeighbors.clear()
      })
    }
  }

  const applyPhysics = (): void => {
    const fg = graphRef.value
    if (!fg) return

    const center = fg.d3Force("center") as { strength?: (s: number) => unknown } | undefined
    const centerStrength = 0.01 + (settings.attraction.value / 100) * 0.24
    center?.strength?.(centerStrength)

    const charge = fg.d3Force("charge") as { strength?: (s: number) => unknown } | undefined
    const chargeStrength = -30 - (settings.repulsion.value / 100) * 370
    charge?.strength?.(chargeStrength)

    const pull = 0.005 + (settings.attraction.value / 100) * 0.045
    pullXInst?.strength(pull)
    pullYInst?.strength(pull)

    const lk = fg.d3Force("link") as
      | {
          strength?: (s: number | ((l: unknown) => number)) => unknown
          distance?: (s: number | ((l: unknown) => number)) => unknown
        }
      | undefined
    const ls = 0.05 + (settings.linkPull.value / 100) * 0.55
    const dist = 30 + (settings.nodeGap.value / 100) * 170
    lk?.strength?.(ls)
    lk?.distance?.(dist)

    fg.d3ReheatSimulation()
  }

  const teardown = (): void => {
    resizeObserver?.disconnect()
    resizeObserver = null
    cancelAnimationFrame(hoverAnimRaf)
    hoverAnimRaf = 0
    highlightBlend = 0
    blendOnDone = null
    renderFocusId = null
    renderNeighbors.clear()
    pullXInst = null
    pullYInst = null
    const fg = graphRef.value
    graphRef.value = null
    fg?._destructor?.()
    const host = containerRef.value
    if (host) host.replaceChildren()
  }

  const build = async (): Promise<void> => {
    const el = containerRef.value
    if (!el) return

    teardown()
    rebuildAdjacency(data.value.links)

    pullXInst = forceX(0)
    pullYInst = forceY(0)

    const { default: ForceGraph } = await import("force-graph")
    if (!instanceAlive || containerRef.value !== el) return

    const fg = new ForceGraph(el)
      .graphData({
        nodes: data.value.nodes.map((n) => ({ ...n })),
        links: data.value.links.map((l) => ({ ...l }))
      })
      .nodeId("id")
      .nodeVal(nodeVal)
      .nodeRelSize(5)
      .nodeLabel(() => "")
      .nodeCanvasObjectMode(() => "after")
      .nodeCanvasObject(paintLabelBelowNode)
      .nodeColor(nodeColor)
      .linkColor(linkColor)
      .linkWidth(linkWidth)
      .d3Force("pullX", pullXInst)
      .d3Force("pullY", pullYInst)
      .onNodeHover((node: any) => {
        setHover(node)
      })
      .onNodeClick((n: any) => {
        onNodeClick(n)
      })
      .backgroundColor("rgba(0, 0, 0, 0)")
      .d3VelocityDecay(0.38)

    if (!instanceAlive) {
      fg._destructor?.()
      el.replaceChildren()
      return
    }
    graphRef.value = fg as any
    applyPhysics()

    const resize = (): void => {
      const w = el.clientWidth || 800
      const h = el.clientHeight || 520
      fg.width(w).height(h)
    }

    resize()
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(el)
  }

  watch(
    () => [
      settings.attraction.value,
      settings.repulsion.value,
      settings.linkPull.value,
      settings.nodeGap.value
    ],
    () => {
      applyPhysics()
    }
  )

  watch(
    () => data.value.builtAt,
    () => {
      void nextTick(() => {
        void build()
      })
    }
  )

  onMounted(() => {
    void nextTick(() => {
      void build()
    })
  })

  onBeforeUnmount(() => {
    instanceAlive = false
    teardown()
  })

  return {
    graphRef,
    rebuild: build
  }
}
