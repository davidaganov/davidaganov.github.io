import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { isContentLocale } from "@docs/constants"
import type { DocsGraphFile } from "@docs/types"

export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, "locale")
  if (!locale || !isContentLocale(locale)) {
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  }

  // 1. Try reading from Nitro server assets (works in production)
  try {
    const data = await useStorage("assets:server").getItem(`graph-${locale}.json`)
    if (data) {
      setResponseHeader(event, "content-type", "application/json; charset=utf-8")
      return data as DocsGraphFile
    }
  } catch (error) {
    console.error("Error reading from server assets:", error)
  }

  // 2. Fallback to filesystem (works in local dev/alternative setups)
  const filePath = join(process.cwd(), "public", `graph-${locale}.json`)

  try {
    const raw = await readFile(filePath, "utf8")
    setResponseHeader(event, "content-type", "application/json; charset=utf-8")
    return JSON.parse(raw) as DocsGraphFile
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Graph file not built" })
  }
})
