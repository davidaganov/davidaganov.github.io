import { isGraphDocsPath } from "@docs/utils/sections"
import { ROUTE_PATH } from "@base/types"

interface DocsHeaderExtraAction {
  id: string
  icon: string
  labelKey: string
  path: string
  isActive: (path: string) => boolean
}

export const DOCS_HEADER_EXTRA_ACTIONS: DocsHeaderExtraAction[] = [
  {
    id: "graph",
    icon: "i-lucide-git-fork",
    labelKey: "docs.graph.headerAria",
    path: ROUTE_PATH.DOCS_GRAPH,
    isActive: isGraphDocsPath
  }
]
