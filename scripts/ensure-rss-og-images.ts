import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { getLocaleCodes } from "../app/config/locales"
import { getRssOgImageSpecs } from "../app/utils/rss.server"

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..")
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const OG_STATIC_PREFIX = "__og-image__/static/"
const FAVICON_FINGERPRINTS = [
  resolve(root, "public/favicons/android-chrome-512x512.png"),
  resolve(root, "public/favicon.src.png")
]

const isValidPng = (buffer: Buffer): boolean => {
  return buffer.length > 1024 && buffer.subarray(0, 8).equals(PNG_SIGNATURE)
}

const readPngDimensions = (buffer: Buffer): { width: number; height: number } | null => {
  if (!isValidPng(buffer) || buffer.length < 24) return null

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  }
}

const isOgImageDimensions = (buffer: Buffer): boolean => {
  const dimensions = readPngDimensions(buffer)
  if (!dimensions) return false

  return (
    dimensions.width >= 1000 && dimensions.height >= 500 && dimensions.width > dimensions.height
  )
}

const fingerprintCache = new Map<string, Buffer>()

const fileFingerprint = (filePath: string): Buffer | null => {
  const cached = fingerprintCache.get(filePath)
  if (cached) return cached

  if (!existsSync(filePath) || !statSync(filePath).isFile()) return null

  const buffer = readFileSync(filePath)
  if (!isValidPng(buffer)) return null

  fingerprintCache.set(filePath, buffer)
  return buffer
}

const isKnownFaviconClone = (buffer: Buffer): boolean => {
  for (const faviconPath of FAVICON_FINGERPRINTS) {
    const favicon = fileFingerprint(faviconPath)
    if (!favicon) continue
    if (favicon.length === buffer.length && favicon.equals(buffer)) return true
  }

  return false
}

const isAcceptableOgImage = (buffer: Buffer): boolean => {
  return isValidPng(buffer) && isOgImageDimensions(buffer) && !isKnownFaviconClone(buffer)
}

const getVercelStaticDir = (root: string): string => {
  return resolve(root, ".vercel/output/static")
}

const getStaticOutputDir = (root: string): string => {
  const staticDir = getVercelStaticDir(root)

  if (!existsSync(staticDir)) {
    throw new Error(
      "Vercel static output not found at .vercel/output/static. Run `npm run build` first."
    )
  }

  return staticDir
}

const sourcePathCandidates = (publicPath: string): string[] => {
  const relativePath = publicPath.replace(/^\//, "")
  const candidates = new Set<string>([relativePath])

  if (!relativePath.startsWith(OG_STATIC_PREFIX)) {
    return [...candidates]
  }

  const suffix = relativePath.slice(OG_STATIC_PREFIX.length)
  const localeCodes = getLocaleCodes()

  const addVariants = (pathSuffix: string): void => {
    candidates.add(`${OG_STATIC_PREFIX}${pathSuffix}`)

    if (pathSuffix.includes("/guides/templates/")) {
      candidates.add(
        `${OG_STATIC_PREFIX}${pathSuffix.replace("/guides/templates/", "/guides/starters/")}`
      )
    }

    if (pathSuffix.includes("/guides/starters/")) {
      candidates.add(
        `${OG_STATIC_PREFIX}${pathSuffix.replace("/guides/starters/", "/guides/templates/")}`
      )
    }
  }

  addVariants(suffix)

  const localePattern = new RegExp(`^(${localeCodes.join("|")})/(.*)$`)
  const localeMatch = suffix.match(localePattern)

  if (localeMatch?.[2]) {
    addVariants(localeMatch[2])
  } else {
    for (const locale of localeCodes) {
      addVariants(`${locale}/${suffix}`)
    }
  }

  return [...candidates]
}

const findSourcePng = (staticDir: string, publicPath: string): string | null => {
  for (const relativePath of sourcePathCandidates(publicPath)) {
    const candidate = join(staticDir, relativePath)
    if (!existsSync(candidate) || !statSync(candidate).isFile()) continue

    const buffer = readFileSync(candidate)
    if (isAcceptableOgImage(buffer)) return candidate
  }

  return null
}

const main = (): void => {
  const staticDir = getStaticOutputDir(root)
  const specs = getRssOgImageSpecs()
  let present = 0
  let copied = 0
  let replaced = 0
  let missing = 0

  console.info(`ensure-rss-og-images: ${staticDir}`)

  for (const spec of specs) {
    const targetPath = join(staticDir, spec.publicPath.replace(/^\//, ""))

    if (existsSync(targetPath)) {
      const existing = readFileSync(targetPath)
      if (isAcceptableOgImage(existing)) {
        present++
        continue
      }

      replaced++
      console.warn(
        `ensure-rss-og-images: replace invalid ${spec.publicPath} (${readPngDimensions(existing)?.width ?? "?"}x${readPngDimensions(existing)?.height ?? "?"})`
      )
    }

    const sourcePath = findSourcePng(staticDir, spec.publicPath)

    if (!sourcePath) {
      missing++
      console.warn(`ensure-rss-og-images: missing ${spec.publicPath}`)
      continue
    }

    mkdirSync(dirname(targetPath), { recursive: true })
    copyFileSync(sourcePath, targetPath)
    copied++
  }

  console.info(
    `ensure-rss-og-images: present ${present}, copied ${copied}, replaced ${replaced}, missing ${missing}`
  )

  if (missing > 0) {
    process.exitCode = 1
  }
}

main()
