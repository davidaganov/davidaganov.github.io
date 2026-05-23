import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { getLocaleCodes } from "../app/config/locales"
import { getRssOgImageSpecs } from "../app/utils/rss.server"

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..")
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const OG_STATIC_PREFIX = "__og-image__/static/"

const fallbackSources = [
  resolve(root, "public/favicons/android-chrome-512x512.png"),
  resolve(root, "public/favicon.src.png")
]

const isValidPng = (buffer: Buffer): boolean => {
  return buffer.length > 1024 && buffer.subarray(0, 8).equals(PNG_SIGNATURE)
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
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate
    }
  }

  return null
}

const findFallbackSource = (): string | null => {
  for (const candidate of fallbackSources) {
    if (!existsSync(candidate) || !statSync(candidate).isFile()) continue

    const buffer = readFileSync(candidate)
    if (isValidPng(buffer)) return candidate
  }

  return null
}

const main = (): void => {
  const staticDir = getStaticOutputDir(root)
  const specs = getRssOgImageSpecs()
  const fallbackSource = findFallbackSource()
  let present = 0
  let copied = 0
  let fallbackCopied = 0
  let missing = 0

  console.info(`ensure-rss-og-images: ${staticDir}`)

  for (const spec of specs) {
    const targetPath = join(staticDir, spec.publicPath.replace(/^\//, ""))

    if (existsSync(targetPath) && isValidPng(readFileSync(targetPath))) {
      present++
      continue
    }

    let sourcePath = findSourcePng(staticDir, spec.publicPath)
    let usedFallback = false

    if (!sourcePath && fallbackSource) {
      sourcePath = fallbackSource
      usedFallback = true
    }

    if (!sourcePath) {
      missing++
      console.warn(`ensure-rss-og-images: missing ${spec.publicPath}`)
      continue
    }

    const buffer = readFileSync(sourcePath)
    if (!isValidPng(buffer)) {
      missing++
      console.warn(`ensure-rss-og-images: invalid ${sourcePath}`)
      continue
    }

    mkdirSync(dirname(targetPath), { recursive: true })
    copyFileSync(sourcePath, targetPath)

    if (usedFallback) {
      fallbackCopied++
      console.warn(`ensure-rss-og-images: fallback ${spec.publicPath}`)
    } else {
      copied++
    }
  }

  console.info(
    `ensure-rss-og-images: present ${present}, copied ${copied}, fallback ${fallbackCopied}, missing ${missing}`
  )

  if (missing > 0) {
    process.exitCode = 1
  }
}

main()
