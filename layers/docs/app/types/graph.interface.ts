export interface DocsGraphNode {
  id: string
  title: string
  titleKey?: string
  collectionKey: string
  kind: "index" | "member"
  hueIndex: number
}

export interface DocsGraphLink {
  source: string
  target: string
}

export interface DocsGraphFile {
  locale: string
  builtAt: string
  nodes: DocsGraphNode[]
  links: DocsGraphLink[]
}

export interface GraphHighlightState {
  focusId: string | null
  neighbors: Set<string>
  blend: number
}

export interface ForceGraphRuntime {
  d3Force: (name: string) => unknown
  d3ReheatSimulation: () => void
}

export interface ForceGraphSettings {
  attraction: number
  repulsion: number
  linkPull: number
  nodeGap: number
}

export interface ForceGraphControlSettings {
  attraction: Ref<number>
  repulsion: Ref<number>
  linkPull: Ref<number>
  nodeGap: Ref<number>
}
