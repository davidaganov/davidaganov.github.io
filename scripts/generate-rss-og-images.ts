import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { getRssOgImageSpecs } from "../app/utils/rss.server"

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..")
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

const staticSearchRoots = [resolve(root, ".vercel/output/static"), resolve(root, ".output/public")]

const outputDirs = [
  resolve(root, "public"),
  resolve(root, ".output/public"),
  resolve(root, ".vercel/output/static")
]

const isValidPng = (buffer: Buffer): boolean =>
  buffer.length > 1024 && buffer.subarray(0, 8).equals(PNG_SIGNATURE)

const sourcePathCandidates = (publicPath: string): string[] => {
  const relativePath = publicPath.replace(/^\//, "")
  const candidates = [relativePath]

  if (relativePath.includes("/guides/templates/")) {
    candidates.push(relativePath.replace("/guides/templates/", "/guides/starters/"))
  }

  return candidates
}

const findSourcePng = (publicPath: string): string | null => {
  for (const relativePath of sourcePathCandidates(publicPath)) {
    for (const searchRoot of staticSearchRoots) {
      const candidate = join(searchRoot, relativePath)
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        return candidate
      }
    }
  }

  return null
}

const copyToOutputDirs = (publicPath: string, sourcePath: string): void => {
  const relativePath = publicPath.replace(/^\//, "")

  for (const baseDir of outputDirs) {
    const targetPath = join(baseDir, relativePath)
    mkdirSync(dirname(targetPath), { recursive: true })
    copyFileSync(sourcePath, targetPath)
  }
}

const main = (): void => {
  const specs = getRssOgImageSpecs()
  let copied = 0
  let missing = 0

  for (const spec of specs) {
    const sourcePath = findSourcePng(spec.publicPath)

    if (!sourcePath) {
      missing++
      console.warn(`generate-rss-og-images: missing ${spec.publicPath}`)
      continue
    }

    const buffer = readFileSync(sourcePath)
    if (!isValidPng(buffer)) {
      missing++
      console.warn(`generate-rss-og-images: invalid PNG ${sourcePath}`)
      continue
    }

    copyToOutputDirs(spec.publicPath, sourcePath)
    copied++
  }

  console.info(`generate-rss-og-images: copied ${copied}, missing ${missing}`)

  if (missing > 0) {
    process.exitCode = 1
  }
}

main()
