import { createHighlighter, type Highlighter } from "shiki"

let highlighterPromise: Promise<Highlighter> | null = null

export function getHighlighterInstance() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["material-theme", "material-theme-lighter", "material-theme-palenight"],
      langs: ["vue", "typescript", "js", "json", "bash", "tsx"]
    })
  }

  return highlighterPromise
}
