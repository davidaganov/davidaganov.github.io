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

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word

    if (candidate.length <= maxChars) {
      line = candidate
      continue
    }

    if (line) {
      lines.push(line)
      if (lines.length >= maxLines) break
      line = word
      continue
    }

    lines.push(word.slice(0, maxChars))
    line = word.slice(maxChars)
    if (lines.length >= maxLines) break
  }

  if (line && lines.length < maxLines) lines.push(line)
  if (lines.length > maxLines) return lines.slice(0, maxLines)

  return lines
}

const safeText = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined
  const normalized = normalizeText(value)
  return normalized.length ? normalized : undefined
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

const getPaletteBySection = (sectionId: string): OgPalette => {
  if (sectionId === "tools") {
    return {
      bgStart: "#0b1328",
      bgMid: "#132b4a",
      bgEnd: "#153e75",
      accentStart: "#22d3ee",
      accentEnd: "#60a5fa",
      glow: "#67e8f9"
    }
  }

  if (sectionId === "guides") {
    return {
      bgStart: "#1a1336",
      bgMid: "#25285a",
      bgEnd: "#2b4a8a",
      accentStart: "#a78bfa",
      accentEnd: "#60a5fa",
      glow: "#c4b5fd"
    }
  }

  return {
    bgStart: "#071428",
    bgMid: "#0c1f3f",
    bgEnd: "#102f5a",
    accentStart: "#2dd4bf",
    accentEnd: "#60a5fa",
    glow: "#6be6ff"
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
      console.error(`Failed to read file ${filePath}:`, error)
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

  const sectionLabel = prettifySlug(slugSegments[0] || "docs")
  const fallbackTitle = prettifySlug(slugSegments.at(-1) || "documentation")

  const title = safeText(query.title) || meta.title || fallbackTitle
  const description =
    safeText(query.description) ||
    meta.description ||
    (locale === "ru"
      ? "Практические материалы, заметки и инструменты из моего портфолио."
      : "Practical notes, guides, and tools from my portfolio.")

  const normalizedDescription = truncate(description, 110)

  const titleLines = splitToLines(title, 28, 3)
  const lineHeight = 74
  const titleStartY = 298

  const titleText = titleLines
    .map(
      (line, index) =>
        `<text x="92" y="${titleStartY + lineHeight * index}" fill="#f8fafc" font-size="64" font-weight="700" font-family="Inter, Segoe UI, Arial, sans-serif">${escapeXml(line)}</text>`
    )
    .join("")

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.bgStart}" />
      <stop offset="55%" stop-color="${palette.bgMid}" />
      <stop offset="100%" stop-color="${palette.bgEnd}" />
    </linearGradient>
    <radialGradient id="glow" cx="0.15" cy="0.12" r="0.8">
      <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.38" />
      <stop offset="100%" stop-color="${palette.glow}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${palette.accentStart}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="${palette.accentEnd}" stop-opacity="0.95" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)" rx="24" />
  <rect width="1200" height="630" fill="url(#glow)" rx="24" />

  <rect x="64" y="66" width="1072" height="498" rx="24" fill="rgba(3, 10, 20, 0.46)" stroke="rgba(148, 163, 184, 0.32)" />
  <rect x="64" y="66" width="1072" height="6" fill="url(#line)" rx="3" />

  <text x="92" y="130" fill="#67e8f9" font-size="27" font-weight="600" font-family="Inter, Segoe UI, Arial, sans-serif">Aganov.dev • ${escapeXml(sectionLabel)}</text>
  ${titleText}
  <text x="92" y="530" fill="#cbd5e1" font-size="36" font-weight="500" font-family="Inter, Segoe UI, Arial, sans-serif">${escapeXml(normalizedDescription)}</text>

  <circle cx="1110" cy="100" r="16" fill="#34d399" fill-opacity="0.9" />
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
