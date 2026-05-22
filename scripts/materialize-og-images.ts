import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { getRssOgPrerenderRoutes } from "../app/utils/rss.server"

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..")

const outputDirs = [
  resolve(root, "public"),
  resolve(root, ".output/public"),
  resolve(root, ".vercel/output/static")
]

const copyOgFile = (sourcePath: string, routePath: string): void => {
  for (const baseDir of outputDirs) {
    const targetPath = join(baseDir, routePath.replace(/^\//, ""))
    mkdirSync(dirname(targetPath), { recursive: true })
    copyFileSync(sourcePath, targetPath)
  }
}

const findOgPng = (routePath: string, searchRoots: string[]): string | null => {
  const relativePath = routePath.replace(/^\//, "")

  for (const searchRoot of searchRoots) {
    const candidate = join(searchRoot, relativePath)
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate
    }
  }

  return null
}

const copyFromBuildCache = (routePath: string, cacheDir: string): boolean => {
  const hashMatch = routePath.match(/\/o_([a-z0-9]+)\.png$/i)
  if (!hashMatch) return false

  const cacheFile = join(cacheDir, `hash:${hashMatch[1]}`)
  if (!existsSync(cacheFile)) return false

  const payload = JSON.parse(readFileSync(cacheFile, "utf8")) as {
    image?: string
    value?: string
  }

  const base64 = payload.image || payload.value
  if (!base64 || typeof base64 !== "string") return false

  const buffer = Buffer.from(base64, "base64")

  for (const baseDir of outputDirs) {
    const targetPath = join(baseDir, routePath.replace(/^\//, ""))
    mkdirSync(dirname(targetPath), { recursive: true })
    writeFileSync(targetPath, buffer)
  }

  return true
}

const main = (): void => {
  const routes = getRssOgPrerenderRoutes()
  const searchRoots = [resolve(root, ".vercel/output/static"), resolve(root, ".output/public")]
  const cacheDir = resolve(root, "node_modules/.cache/nuxt-seo/og-image")

  let copied = 0
  let missing = 0

  for (const routePath of routes) {
    const sourcePath = findOgPng(routePath, searchRoots)

    if (sourcePath) {
      copyOgFile(sourcePath, routePath)
      copied++
      continue
    }

    if (existsSync(cacheDir) && copyFromBuildCache(routePath, cacheDir)) {
      copied++
      continue
    }

    missing++
    console.warn(`materialize-og-images: missing ${routePath}`)
  }

  console.info(`materialize-og-images: copied ${copied}, missing ${missing}`)
}

main()
