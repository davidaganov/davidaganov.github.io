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
