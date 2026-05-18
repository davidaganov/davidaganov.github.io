import type { Ref } from "vue"
import { forceX, forceY } from "d3-force-3d"
import type ForceGraph from "force-graph"
import {
  buildAdjacency,
  createHighlightController,
  createHighlightState,
  linkEndpointId
} from "@docs/utils/force-graph/highlight"
import { applyForceGraphPhysics } from "@docs/utils/force-graph/physics"
import type { DocsGraphFile, DocsGraphNode, ForceGraphControlSettings } from "@docs/types"

export const useDocsForceGraph = (
  containerRef: Ref<HTMLElement | null>,
  data: Ref<DocsGraphFile>,
  settings: ForceGraphControlSettings,
  onNodeClick: (node: DocsGraphNode) => void
) => {
  const { t } = useI18n()

  const graphRef = shallowRef<ForceGraph | null>(null)
  const highlightState = createHighlightState()

  let resizeObserver: ResizeObserver | null = null
  let instanceAlive = true
  let pullXInst: ReturnType<typeof forceX> | null = null
  let pullYInst: ReturnType<typeof forceY> | null = null
  let adjacency = new Map<string, Set<string>>()

  const highlight = createHighlightController(highlightState, () =>
    data.value.nodes.find((node) => node.id === highlightState.focusId)
  )

  const resolveNodeTitle = (node: DocsGraphNode): string => {
    if (node.title?.trim()) return node.title.trim()
    if (node.titleKey) return t(node.titleKey)
    return node.id.replace(/^\/docs\/?/, "") || node.id
  }

  const readSettings = () => ({
    attraction: settings.attraction.value,
    repulsion: settings.repulsion.value,
    linkPull: settings.linkPull.value,
    nodeGap: settings.nodeGap.value
  })

  const teardown = (): void => {
    resizeObserver?.disconnect()
    resizeObserver = null
    highlight.dispose()
    pullXInst = null
    pullYInst = null
    const graph = graphRef.value
    graphRef.value = null
    graph?._destructor?.()
    containerRef.value?.replaceChildren()
  }

  const build = async (): Promise<void> => {
    const el = containerRef.value
    if (!el) return

    teardown()
    adjacency = buildAdjacency(data.value.links)

    pullXInst = forceX(0)
    pullYInst = forceY(0)

    const { default: ForceGraphConstructor } = await import("force-graph")
    if (!instanceAlive || containerRef.value !== el) return

    const graph = new ForceGraphConstructor(el)
      .graphData({
        nodes: data.value.nodes.map((node) => ({ ...node })),
        links: data.value.links.map((link) => ({ ...link }))
      })
      .nodeId("id")
      .nodeVal((node) => highlight.nodeVal(node as DocsGraphNode))
      .nodeRelSize(5)
      .nodeLabel(() => "")
      .nodeCanvasObjectMode(() => "after")
      .nodeCanvasObject((node, ctx, globalScale) => {
        const graphNode = node as DocsGraphNode & { x?: number; y?: number }
        if (graphNode.x === undefined || graphNode.y === undefined) return

        const radius = Math.sqrt(Math.max(0, highlight.nodeVal(graphNode))) * 5
        const raw = resolveNodeTitle(graphNode)
        const label = raw.length > 28 ? `${raw.slice(0, 27)}…` : raw
        const fontPx = Math.max(9, 11 / globalScale)

        ctx.font = `500 ${fontPx}px ui-sans-serif, system-ui, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillStyle = `rgba(248, 250, 252, ${highlight.labelAlpha(graphNode.id)})`
        ctx.fillText(label, graphNode.x, graphNode.y + radius + 3 / globalScale)
      })
      .nodeColor((node) => highlight.nodeColor(node as DocsGraphNode))
      .linkColor((link) => {
        const sourceId = linkEndpointId(link.source as DocsGraphNode | string)
        const targetId = linkEndpointId(link.target as DocsGraphNode | string)
        return highlight.linkColor(sourceId, targetId)
      })
      .linkWidth((link) => {
        const sourceId = linkEndpointId(link.source as DocsGraphNode | string)
        const targetId = linkEndpointId(link.target as DocsGraphNode | string)
        return highlight.linkWidth(sourceId, targetId)
      })
      .d3Force("pullX", pullXInst)
      .d3Force("pullY", pullYInst)
      .onNodeHover((node) => {
        highlight.setHover((node as DocsGraphNode | null) ?? null, adjacency)
      })
      .onNodeClick((node) => {
        onNodeClick(node as DocsGraphNode)
      })
      .backgroundColor("rgba(0, 0, 0, 0)")
      .d3VelocityDecay(0.38)

    if (!instanceAlive) {
      graph._destructor?.()
      el.replaceChildren()
      return
    }

    graphRef.value = graph
    applyForceGraphPhysics(graph, readSettings(), pullXInst, pullYInst)

    const resize = (): void => {
      graph.width(el.clientWidth || 800).height(el.clientHeight || 520)
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
      const graph = graphRef.value
      if (!graph || !pullXInst || !pullYInst) return
      applyForceGraphPhysics(graph, readSettings(), pullXInst, pullYInst)
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
