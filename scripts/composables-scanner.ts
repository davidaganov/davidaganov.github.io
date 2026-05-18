import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const getDirectoriesRecursive = (base: string): string[] => {
  if (!existsSync(base)) return []
  const result: string[] = [base]
  try {
    const files = readdirSync(base)
    for (const file of files) {
      const fullPath = join(base, file)
      if (statSync(fullPath).isDirectory()) {
        result.push(...getDirectoriesRecursive(fullPath))
      }
    }
  } catch (error) {
    console.error(error)
  }
  return result
}

export const findComposablesDirs = (dir: string): string[] => {
  const result: string[] = []
  const IGNORED = new Set([
    "node_modules",
    ".git",
    ".nuxt",
    ".output",
    ".data",
    "dist",
    "public",
    "assets",
    "server"
  ])

  const scan = (current: string) => {
    try {
      const files = readdirSync(current)
      for (const file of files) {
        if (IGNORED.has(file)) continue
        const fullPath = join(current, file)
        const stat = statSync(fullPath)
        if (stat.isDirectory()) {
          if (file === "composables") {
            result.push(...getDirectoriesRecursive(fullPath))
          } else {
            scan(fullPath)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  scan(dir)
  return result
}
