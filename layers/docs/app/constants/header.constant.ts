import { isGraphDocsPath } from "@docs/utils/sections"
import { ROUTE_PATH } from "@base/types"

interface DocsHeaderExtraAction {
  id: string
  icon: string
  labelKey: string
  path: string
  mobileInline?: boolean
  isActive: (path: string) => boolean
}

export const DOCS_HEADER_EXTRA_ACTIONS: DocsHeaderExtraAction[] = [
  {
    id: "graph",
    icon: "i-lucide-git-fork",
    labelKey: "docs.graph.headerTab",
    path: ROUTE_PATH.DOCS_GRAPH,
    mobileInline: true,
    isActive: isGraphDocsPath
  }
]
