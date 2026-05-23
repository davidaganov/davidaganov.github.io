import Database from "better-sqlite3"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { ContentRssEntry, RssAssetChannel, RssAssetFile } from "../app/types/rss.interface"
import { createTranslator } from "../app/utils/i18n-messages"
import { isRssEligibleContentPath } from "../app/utils/rss"
import { resolveRssEntryCategories } from "../app/utils/rss-labels"
import { loadRssContentEntriesFromSqlite } from "../app/utils/rss.server"
import { CONTENT_LOCALES } from "../layers/docs/app/constants/content.constant"
import { GRAPH_EXCLUDED_CATEGORIES } from "../layers/docs/app/constants/graph.constant"
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
  contentPathToPublicPath
} from "../layers/docs/app/utils/path/publicPath"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const root = resolve(__dirname, "..")
const sqlitePath = resolve(root, ".data/content/contents.sqlite")
const publicDir = resolve(root, "public")
const serverAssetsDir = resolve(root, "server/assets")
const markdownContentDir = resolve(root, "content")
const archiveContentDir = resolve(root, "layers/docs/app/content")
const localesDir = resolve(root, "i18n/locales")
const contentInputRoots = [markdownContentDir, archiveContentDir, localesDir]

type GraphRow = { path: string; title: string | null; body: string | null }

const undirectedKey = (a: string, b: string): string => (a < b ? `${a}::${b}` : `${b}::${a}`)

const hashPayload = (payload: unknown): string => {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex")
}

const latestMtimeMs = (paths: string[]): number => {
  let latest = 0

  const visit = (targetPath: string): void => {
    if (!existsSync(targetPath)) return

    let stat
    try {
      stat = statSync(targetPath)
    } catch {
      return
    }

    latest = Math.max(latest, stat.mtimeMs)
    if (!stat.isDirectory()) return

    for (const entry of readdirSync(targetPath, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue
      visit(join(targetPath, entry.name))
    }
  }

  for (const path of paths) visit(path)
  return latest
}

const oldestMtimeMs = (paths: string[]): number | null => {
  const existing = paths.filter((path) => existsSync(path))
  if (!existing.length) return null

  return Math.min(
    ...existing.map((path) => {
      try {
        return statSync(path).mtimeMs
      } catch {
        return 0
      }
    })
  )
}

const readStableHash = (path: string, toStable: (parsed: unknown) => unknown): string | null => {
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown
    return hashPayload(toStable(parsed))
  } catch {
    return null
  }
}

const writeJsonIfChanged = (
  path: string,
  stablePayload: unknown,
  filePayload: unknown
): boolean => {
  const nextHash = hashPayload(stablePayload)
  const previousHash = readStableHash(path, () => stablePayload)

  if (previousHash === nextHash) return false

  writeFileSync(path, `${JSON.stringify(filePayload)}\n`, "utf8")
  return true
}

const writeMirroredJsonIfChanged = (
  publicPath: string,
  serverPath: string,
  stablePayload: unknown,
  filePayload: unknown
): boolean => {
  const serialized = `${JSON.stringify(filePayload)}\n`
  const nextHash = hashPayload(stablePayload)
  const publicHash = readStableHash(publicPath, () => stablePayload)
  const serverHash = readStableHash(serverPath, () => stablePayload)

  if (publicHash === nextHash && serverHash === nextHash) return false

  writeFileSync(publicPath, serialized, "utf8")
  writeFileSync(serverPath, serialized, "utf8")
  return true
}

const buildHueIndexMap = (keys: Iterable<string>): Map<string, number> => {
  const sorted = [...new Set(keys)].sort()
  return new Map(sorted.map((key, index) => [key, index]))
}

const isExcludedGraphPath = (collectionKey: string, contentPath: string): boolean =>
  GRAPH_EXCLUDED_CATEGORIES.some((exc) => {
    return collectionKey === exc || contentPath === `/${exc}` || contentPath.startsWith(`/${exc}/`)
  })

const buildGraphForLocale = (locale: string): Omit<DocsGraphFile, "builtAt"> => {
  const db = new Database(sqlitePath, { readonly: true })
  const table = `_content_content_${locale}`

  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
    .get(table)

  if (!tableExists) {
    db.close()
    console.warn(`build-docs-assets: table ${table} missing, writing empty graph`)
    return {
      locale,
      nodes: [],
      links: []
    }
  }

  const rows = db
    .prepare(`SELECT path, title, body FROM ${table}`)
    .all()
    .map((row: unknown) => row as GraphRow)
  db.close()

  const descriptors = getDocsCollectionDescriptors()
  const excluded = GRAPH_EXCLUDED_CATEGORIES as readonly string[]
  const filteredDescriptors = descriptors.filter(
    (descriptor) =>
      !excluded.includes(descriptor.collectionKey) &&
      !excluded.some((exc) => descriptor.contentPathPrefix.startsWith(`/${exc}`))
  )

  const collectionKeys = new Set<string>(filteredDescriptors.map((d) => d.collectionKey))
  const nodes: DocsGraphNode[] = []
  const nodeIds = new Set<string>()
  const idFromContentPath = new Map<string, string>()

  for (const row of rows) {
    if (typeof row.path !== "string") continue

    const { collectionKey, kind } = describeContentPathForGraph(row.path, descriptors)
    if (isExcludedGraphPath(collectionKey, row.path)) continue

    collectionKeys.add(collectionKey)
    const id = contentPathToPublicPath(row.path)
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

  for (const descriptor of filteredDescriptors) {
    if (nodeIds.has(descriptor.indexPublicPath)) continue
    collectionKeys.add(descriptor.collectionKey)
    nodeIds.add(descriptor.indexPublicPath)
    nodes.push({
      id: descriptor.indexPublicPath,
      title: "",
      titleKey: descriptor.titleKey,
      collectionKey: descriptor.collectionKey,
      kind: "index",
      hueIndex: 0
    })
  }

  const hueByKey = buildHueIndexMap(collectionKeys)
  for (const node of nodes) {
    node.hueIndex = hueByKey.get(node.collectionKey) ?? 0
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

    for (const href of extractHrefsFromContentBody(parsedBody)) {
      const target = canonicalDocsPathFromHref(href, sourceId)
      if (!target || !nodeIds.has(target) || target === sourceId) continue
      const key = undirectedKey(sourceId, target)
      if (linkKeys.has(key)) continue
      linkKeys.add(key)
      links.push({ source: sourceId, target })
    }
  }

  const indexPathByCollectionKey = new Map(
    descriptors.map((descriptor) => [descriptor.collectionKey, descriptor.indexPublicPath])
  )

  for (const node of nodes) {
    if (node.kind !== "member") continue
    const indexPath = indexPathByCollectionKey.get(node.collectionKey)
    if (!indexPath || indexPath === node.id || !nodeIds.has(indexPath)) continue
    const key = undirectedKey(node.id, indexPath)
    if (linkKeys.has(key)) continue
    linkKeys.add(key)
    links.push({ source: node.id, target: indexPath })
  }

  return {
    locale,
    nodes,
    links
  }
}

const hasFilesInTree = (dir: string): boolean => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const fullPath = join(dir, entry.name)
    if (entry.isFile()) return true
    if (entry.isDirectory() && hasFilesInTree(fullPath)) return true
  }
  return false
}

const collectArchiveKeysForSection = (
  section: string,
  keys: Set<string>,
  contentDir: string
): void => {
  const sectionDir = join(contentDir, section)
  if (!existsSync(sectionDir)) return

  const walk = (dir: string, relative: string): void => {
    if (!hasFilesInTree(dir)) return
    keys.add(relative.replace(/^\/+/, ""))

    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue
      const nextRelative = relative ? `${relative}/${entry.name}` : entry.name
      walk(join(dir, entry.name), nextRelative)
    }
  }

  for (const entry of readdirSync(sectionDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue
    walk(join(sectionDir, entry.name), `${section}/${entry.name}`)
  }
}

const buildArchiveIndex = (): string[] => {
  const keys = new Set<string>()
  if (!existsSync(archiveContentDir)) return []

  for (const entry of readdirSync(archiveContentDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue
    collectArchiveKeysForSection(entry.name, keys, archiveContentDir)
  }

  return [...keys].sort()
}

const buildRssAssetForLocale = (locale: string, entries: ContentRssEntry[]): RssAssetFile => {
  const t = createTranslator(locale)
  const channel: RssAssetChannel = {
    title: t("layout.rss.feedTitle"),
    description: t("layout.rss.feedDescription"),
    creator: t("global.name")
  }

  const enrichedEntries = entries.map((entry) => {
    const path = String(entry.path || "")
    if (!isRssEligibleContentPath(path) || !entry.meta?.publishedAt) return entry

    return {
      ...entry,
      rssCategories: resolveRssEntryCategories(entry, t)
    }
  })

  return { channel, entries: enrichedEntries }
}

const getTrackedOutputPaths = (): string[] => [
  resolve(publicDir, "archive-index.json"),
  ...CONTENT_LOCALES.flatMap((locale) => [
    resolve(publicDir, `graph-${locale}.json`),
    resolve(serverAssetsDir, `graph-${locale}.json`),
    resolve(publicDir, `rss-${locale}.json`),
    resolve(serverAssetsDir, `rss-${locale}.json`)
  ])
]

const main = (): void => {
  try {
    readFileSync(resolve(root, "package.json"), "utf8")
  } catch {
    console.error("build-docs-assets: could not find project root")
    process.exit(1)
  }

  mkdirSync(publicDir, { recursive: true })
  mkdirSync(serverAssetsDir, { recursive: true })

  const outputPaths = getTrackedOutputPaths()
  const inputSources = [...contentInputRoots, sqlitePath]
  const inputMtime = latestMtimeMs(inputSources)
  const outputMtime = oldestMtimeMs(outputPaths)

  if (outputMtime !== null && inputMtime <= outputMtime) {
    console.info("build-docs-assets: up to date (content inputs unchanged)")
    return
  }

  let wroteAny = false

  const archiveKeys = buildArchiveIndex()
  const archiveStable = { keys: archiveKeys }
  const archivePath = resolve(publicDir, "archive-index.json")
  const archiveChanged = writeJsonIfChanged(archivePath, archiveStable, {
    keys: archiveKeys,
    builtAt: new Date().toISOString()
  })

  if (archiveChanged) {
    wroteAny = true
    console.info(`build-docs-assets: wrote ${archivePath} (${archiveKeys.length} archive roots)`)
  }

  if (!existsSync(sqlitePath)) {
    console.warn(
      "build-docs-assets: skip graph (no content database). Run `nuxt prepare` or `nuxt dev` first."
    )
    if (!wroteAny) console.info("build-docs-assets: no file changes")
    return
  }

  try {
    statSync(sqlitePath)
  } catch {
    console.warn("build-docs-assets: skip graph (cannot read sqlite file)")
    if (!wroteAny) console.info("build-docs-assets: no file changes")
    return
  }

  for (const locale of CONTENT_LOCALES) {
    const graphData = buildGraphForLocale(locale)
    const graphStable = {
      locale: graphData.locale,
      nodes: graphData.nodes,
      links: graphData.links
    }
    const graphFile = {
      ...graphData,
      builtAt: new Date().toISOString()
    }

    const publicPath = resolve(publicDir, `graph-${locale}.json`)
    const serverPath = resolve(serverAssetsDir, `graph-${locale}.json`)
    const graphChanged = writeMirroredJsonIfChanged(publicPath, serverPath, graphStable, graphFile)

    if (graphChanged) {
      wroteAny = true
      console.info(
        `build-docs-assets: wrote ${publicPath} and ${serverPath} (${graphData.nodes.length} nodes, ${graphData.links.length} links)`
      )
    }

    const rssEntries = loadRssContentEntriesFromSqlite(locale)
    const rssAsset = buildRssAssetForLocale(locale, rssEntries)
    const rssStable = { channel: rssAsset.channel, entries: rssAsset.entries }
    const rssFile = {
      ...rssStable,
      builtAt: new Date().toISOString()
    }
    const rssPublicPath = resolve(publicDir, `rss-${locale}.json`)
    const rssServerPath = resolve(serverAssetsDir, `rss-${locale}.json`)
    const rssChanged = writeMirroredJsonIfChanged(rssPublicPath, rssServerPath, rssStable, rssFile)

    if (rssChanged) {
      wroteAny = true
      console.info(
        `build-docs-assets: wrote ${rssPublicPath} and ${rssServerPath} (${rssEntries.length} RSS entries)`
      )
    }
  }

  if (!wroteAny) console.info("build-docs-assets: no file changes")
}

main()
