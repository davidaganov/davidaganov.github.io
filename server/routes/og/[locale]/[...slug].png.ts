import { Resvg } from "@resvg/resvg-js"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

interface OgPalette {
  bgStart: string
  bgMid: string
  bgEnd: string
  accentStart: string
  accentEnd: string
  glow: string
}

const CONTENT_ROOT = join(process.cwd(), "content")

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")

const normalizeText = (value: string): string => value.replace(/\s+/g, " ").trim()

const splitToLines = (value: string, maxChars = 34, maxLines = 3): string[] => {
  const words = normalizeText(value).split(" ")
  const lines: string[] = []
  let line = ""
  let hasMore = false

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word

    if (candidate.length <= maxChars) {
      line = candidate
      continue
    }

    if (line) {
      lines.push(line)
      if (lines.length >= maxLines) {
        hasMore = true
        break
      }
      line = word
      continue
    }

    lines.push(word.slice(0, maxChars))
    line = word.slice(maxChars)
    if (lines.length >= maxLines) {
      hasMore = true
      break
    }
  }

  if (line && lines.length < maxLines) {
    lines.push(line)
  } else if (line) {
    hasMore = true
  }

  if (hasMore && lines.length > 0) {
    const last = lines[lines.length - 1] || ""
    lines[lines.length - 1] =
      last.length > maxChars - 1 ? `${last.slice(0, maxChars - 1)}…` : `${last}…`
  }

  return lines
}

const safeText = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined
  const normalized = normalizeText(value)
  return normalized.length ? normalized : undefined
}

const decodeQueryText = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined

  try {
    return safeText(decodeURIComponent(value))
  } catch {
    return safeText(value)
  }
}

const truncate = (value: string, max = 140): string => {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1).trimEnd()}…`
}

const parseFrontmatter = (source: string): { title?: string; description?: string } => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const body = match[1]
  const lines = body?.split(/\r?\n/)

  const pick = (key: "title" | "description") => {
    const line = lines?.find((item) => item.toLowerCase().startsWith(`${key}:`))
    if (!line) return undefined

    const raw = line.slice(key.length + 1).trim()
    const unquoted = raw.replace(/^['"]/, "").replace(/['"]$/, "")
    return normalizeText(unquoted)
  }

  return {
    title: pick("title"),
    description: pick("description")
  }
}

const prettifySlug = (value: string): string => {
  const normalized = value.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
  if (!normalized) return "Documentation"
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const getPaletteBySection = (_sectionId: string): OgPalette => {
  return {
    bgStart: "#0a0414",
    bgMid: "#0f0820",
    bgEnd: "#130a28",
    accentStart: "#8b5cf6",
    accentEnd: "#a78bfa",
    glow: "#7c3aed"
  }
}

const readDocMeta = async (
  locale: string,
  segments: string[]
): Promise<{ title?: string; description?: string }> => {
  const fileCandidates = [
    join(CONTENT_ROOT, locale, ...segments) + ".md",
    join(CONTENT_ROOT, locale, ...segments, "index.md")
  ]

  for (const filePath of fileCandidates) {
    try {
      const source = await readFile(filePath, "utf-8")
      return parseFrontmatter(source)
    } catch (error) {
      const err = error as NodeJS.ErrnoException
      if (err?.code !== "ENOENT") {
        console.error(`Failed to read file ${filePath}:`, error)
      }
    }
  }

  return {}
}

export default defineEventHandler(async (event) => {
  const localeParam = String(getRouterParam(event, "locale") || "ru")
  const locale = localeParam === "en" ? "en" : "ru"
  const rawSlug = getRouterParam(event, "slug")
  const query = getQuery(event)

  const slugSegments = Array.isArray(rawSlug)
    ? rawSlug.map(String).filter(Boolean)
    : String(rawSlug || "")
        .split("/")
        .map((item) => item.trim())
        .filter(Boolean)

  const meta = await readDocMeta(locale, slugSegments)
  const sectionId = String(slugSegments[0] || "about").toLowerCase()
  const palette = getPaletteBySection(sectionId)

  const fallbackSectionLabel = prettifySlug(slugSegments[0] || "docs")
  const fallbackCollectionLabel = prettifySlug(slugSegments.at(-2) || "articles")
  const fallbackArticleLabel = prettifySlug(slugSegments.at(-1) || "documentation")

  const sectionLabel = decodeQueryText(query.section) || fallbackSectionLabel
  const collectionLabel = decodeQueryText(query.collection) || fallbackCollectionLabel
  const articleLabel = decodeQueryText(query.article) || fallbackArticleLabel

  const title = decodeQueryText(query.title) || meta.title || articleLabel
  const description =
    decodeQueryText(query.description) ||
    meta.description ||
    (locale === "ru"
      ? "Практические материалы, заметки и инструменты из моего портфолио."
      : "Practical notes, guides, and tools from my portfolio.")

  const normalizedDescription = truncate(description, 160)

  // Title: centered, max 3 lines
  const titleLines = splitToLines(title, 26, 3)
  const lineHeight = 74
  // Vertical center of usable area (below breadcrumb ~y=120, above logo ~y=560)
  // Total text block height
  const titleBlockH = titleLines.length * lineHeight
  const descLines = splitToLines(normalizedDescription, 52, 2)
  const descLineHeight = 42
  const descBlockH = descLines.length * descLineHeight
  const totalBlockH = titleBlockH + (descLines.length > 0 ? 24 + descBlockH : 0)
  const blockStartY = Math.round((630 - totalBlockH) / 2) + 15
  const titleStartY = blockStartY + lineHeight - 10

  const titleText = titleLines
    .map(
      (line, index) =>
        `<text x="600" y="${titleStartY + lineHeight * index}" text-anchor="middle" fill="#f1f5f9" font-size="68" font-weight="700" font-family="Inter, Segoe UI, Arial, sans-serif">${escapeXml(line)}</text>`
    )
    .join("")

  const descStartY = titleStartY + (titleLines.length - 1) * lineHeight + 58

  const descriptionText = descLines
    .map(
      (line, index) =>
        `<text x="600" y="${descStartY + descLineHeight * index}" text-anchor="middle" fill="#94a3b8" font-size="34" font-weight="400" font-family="Inter, Segoe UI, Arial, sans-serif">${escapeXml(line)}</text>`
    )
    .join("")

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Solid background -->
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${palette.bgStart}" />
      <stop offset="100%" stop-color="${palette.bgEnd}" />
    </linearGradient>

    <!-- Grid cell pattern -->
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(139,92,246,0.18)" stroke-width="1" />
    </pattern>

    <!-- Side vignette: dark edges left+right -->
    <linearGradient id="vigH" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="${palette.bgStart}" stop-opacity="1" />
      <stop offset="22%" stop-color="${palette.bgStart}" stop-opacity="0" />
      <stop offset="78%" stop-color="${palette.bgStart}" stop-opacity="0" />
      <stop offset="100%" stop-color="${palette.bgStart}" stop-opacity="1" />
    </linearGradient>

    <!-- Top+bottom vignette -->
    <linearGradient id="vigV" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="${palette.bgStart}" stop-opacity="0.85" />
      <stop offset="25%" stop-color="${palette.bgStart}" stop-opacity="0" />
      <stop offset="75%" stop-color="${palette.bgStart}" stop-opacity="0" />
      <stop offset="100%" stop-color="${palette.bgStart}" stop-opacity="0.9" />
    </linearGradient>

    <!-- Top radial glow (violet) -->
    <radialGradient id="topGlow" cx="0.5" cy="0" r="0.7" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.36" />
      <stop offset="100%" stop-color="${palette.glow}" stop-opacity="0" />
    </radialGradient>

    <!-- Top accent line gradient -->
    <linearGradient id="lineH" x1="0" x2="1200" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${palette.accentStart}" stop-opacity="0" />
      <stop offset="0.35" stop-color="${palette.accentStart}" stop-opacity="1" />
      <stop offset="0.65" stop-color="${palette.accentEnd}" stop-opacity="1" />
      <stop offset="1" stop-color="${palette.accentEnd}" stop-opacity="0" />
    </linearGradient>

    <!-- Top glow vertical fade -->
    <linearGradient id="lineVFade" x1="600" x2="600" y1="0" y2="220" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${palette.accentStart}" stop-opacity="0.176" />
      <stop offset="1" stop-color="${palette.accentStart}" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Background solid fill -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Grid pattern overlay -->
  <rect width="1200" height="630" fill="url(#grid)" />

  <!-- Side vignette (left + right dark fade) -->
  <rect width="1200" height="630" fill="url(#vigH)" />

  <!-- Top + bottom vignette -->
  <rect width="1200" height="630" fill="url(#vigV)" />

  <!-- Top glow vertical fade -->
  <rect width="1200" height="220" fill="url(#lineVFade)" />

  <!-- Top accent line flush to top -->
  <rect x="0" y="0" width="1200" height="4" fill="url(#lineH)" />

  <!-- Top radial halo -->
  <rect width="1200" height="630" fill="url(#topGlow)" />

  <!-- UiLogo short: top-center rounded square with letter A -->
  <rect x="577" y="140" width="46" height="46" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
  <text x="600" y="171" text-anchor="middle" fill="${palette.accentEnd}" font-size="22" font-weight="700" font-family="Inter, Segoe UI, Arial, sans-serif">A</text>

  <!-- Title -->
  ${titleText}

  <!-- Description -->
  ${descriptionText}

  <!-- Pagination breadcrumb bottom center: section (dim) / collection (bright) -->
  <text x="600" y="572" text-anchor="middle" font-size="24" font-family="Inter, Segoe UI, Arial, sans-serif">
    <tspan fill="rgba(148,163,184,0.5)" font-weight="500">${escapeXml(sectionLabel)}</tspan>
    <tspan fill="rgba(148,163,184,0.35)" font-weight="400">  /  </tspan>
    <tspan fill="#e2e8f0" font-weight="600">${escapeXml(collectionLabel)}</tspan>
  </text>
</svg>`.trim()

  const pngData = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200
    }
  })
    .render()
    .asPng()

  setHeader(event, "content-type", "image/png")
  setHeader(event, "cache-control", "public, max-age=604800, s-maxage=604800")

  return pngData
})
