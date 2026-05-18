import Database from "better-sqlite3"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type {
  DocsGraphFile,
  DocsGraphLink,
  DocsGraphNode
} from "../layers/docs/app/types/graph.interface"
import {
  describeContentPathForGraph,
  getDocsCollectionDescriptors
} from "../layers/docs/app/utils/graph/graphCollections"
import { extractHrefsFromContentBody } from "../layers/docs/app/utils/graph/graphMinimark"
import {
  canonicalDocsPathFromHref,
  contentPathToPublicDocsPath
} from "../layers/docs/app/utils/path/pathResolve"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const sqlitePath = resolve(root, ".data/content/contents.sqlite")
const publicDir = resolve(root, "public")

/**
 * Categories (collections) and content path prefixes to exclude from the documentation force graph.
 * Supports both collection keys (e.g., 'changelog/releases') and top-level folder names (e.g., 'changelog').
 */
const EXCLUDED_CATEGORIES = ["changelog/releases", "changelog"]

type Row = { path: string; title: string | null; body: string | null }

const undirectedKey = (a: string, b: string): string => (a < b ? `${a}::${b}` : `${b}::${a}`)

const buildHueIndexMap = (keys: Iterable<string>): Map<string, number> => {
  const sorted = [...new Set(keys)].sort()
  return new Map(sorted.map((k, i) => [k, i]))
}

const runForLocale = (locale: string): DocsGraphFile => {
  const db = new Database(sqlitePath, { readonly: true })
  const table = `_content_content_${locale}`

  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
    .get(table)

  if (!tableExists) {
    db.close()
    console.warn(`build-docs-graph: table ${table} does not exist yet. Returning empty graph.`)
    return {
      locale,
      builtAt: new Date().toISOString(),
      nodes: [],
      links: []
    }
  }

  const rows = db
    .prepare(`SELECT path, title, body FROM ${table}`)
    .all()
    .map((r) => r as Row)
  db.close()

  const descriptors = getDocsCollectionDescriptors()
  const filteredDescriptors = descriptors.filter((d) => {
    return (
      !EXCLUDED_CATEGORIES.includes(d.collectionKey) &&
      !EXCLUDED_CATEGORIES.some((exc) => d.contentPathPrefix.startsWith(`/${exc}`))
    )
  })

  const collectionKeysAccumulator = new Set<string>(filteredDescriptors.map((d) => d.collectionKey))

  const nodes: DocsGraphNode[] = []
  const nodeIds = new Set<string>()
  const idFromContentPath = new Map<string, string>()

  for (const row of rows) {
    if (typeof row.path !== "string") continue

    // Resolve collection info using full descriptors list to ensure correct kind mapping
    const { collectionKey, kind } = describeContentPathForGraph(row.path, descriptors)

    // Check if the current row path or its collection key matches any excluded categories
    const isExcluded = EXCLUDED_CATEGORIES.some((exc) => {
      return collectionKey === exc || row.path === `/${exc}` || row.path.startsWith(`/${exc}/`)
    })
    if (isExcluded) continue

    collectionKeysAccumulator.add(collectionKey)
    const id = contentPathToPublicDocsPath(row.path)
    idFromContentPath.set(row.path, id)
    nodeIds.add(id)
    nodes.push({
      id,
      title: String(row.title || ""),
      collectionKey,
      kind,
      hueIndex: 0
    })
  }

  for (const d of filteredDescriptors) {
    if (nodeIds.has(d.indexPublicPath)) continue
    collectionKeysAccumulator.add(d.collectionKey)
    nodeIds.add(d.indexPublicPath)
    nodes.push({
      id: d.indexPublicPath,
      title: "",
      titleKey: d.titleKey,
      collectionKey: d.collectionKey,
      kind: "index",
      hueIndex: 0
    })
  }

  const hueByKey = buildHueIndexMap(collectionKeysAccumulator)
  for (const n of nodes) {
    n.hueIndex = hueByKey.get(n.collectionKey) ?? 0
  }

  const linkKeys = new Set<string>()
  const links: DocsGraphLink[] = []

  for (const row of rows) {
    if (typeof row.path !== "string" || row.body == null) continue
    let parsedBody: unknown = row.body
    try {
      parsedBody = JSON.parse(row.body) as unknown
    } catch {
      parsedBody = row.body
    }
    const sourceId = idFromContentPath.get(row.path)
    if (!sourceId || !nodeIds.has(sourceId)) continue

    const hrefs = extractHrefsFromContentBody(parsedBody)
    for (const href of hrefs) {
      const target = canonicalDocsPathFromHref(href, sourceId)
      if (!target || !nodeIds.has(target) || target === sourceId) continue
      const uk = undirectedKey(sourceId, target)
      if (linkKeys.has(uk)) continue
      linkKeys.add(uk)
      links.push({ source: sourceId, target })
    }
  }

  const indexPathByCollectionKey = new Map<string, string>()
  for (const d of descriptors) {
    indexPathByCollectionKey.set(d.collectionKey, d.indexPublicPath)
  }

  for (const n of nodes) {
    if (n.kind !== "member") continue
    const indexPath = indexPathByCollectionKey.get(n.collectionKey)
    if (!indexPath || indexPath === n.id) continue
    if (!nodeIds.has(indexPath)) continue
    const uk = undirectedKey(n.id, indexPath)
    if (linkKeys.has(uk)) continue
    linkKeys.add(uk)
    links.push({ source: n.id, target: indexPath })
  }

  return {
    locale,
    builtAt: new Date().toISOString(),
    nodes,
    links
  }
}

const main = (): void => {
  try {
    readFileSync(resolve(root, "package.json"), "utf8")
  } catch {
    console.error("build-docs-graph: could not find project root")
    process.exit(1)
  }

  try {
    readFileSync(sqlitePath)
  } catch {
    console.warn(
      "build-docs-graph: skip (no content database). Run `nuxt prepare` or `nuxt dev` first."
    )
    process.exit(0)
  }

  mkdirSync(publicDir, { recursive: true })

  for (const locale of ["ru", "en"]) {
    const data = runForLocale(locale)
    const outPath = resolve(publicDir, `graph-${locale}.json`)
    writeFileSync(outPath, JSON.stringify(data), "utf8")
    console.info(
      `build-docs-graph: wrote ${outPath} (${data.nodes.length} nodes, ${data.links.length} links)`
    )
  }
}

main()
