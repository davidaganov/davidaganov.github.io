import { readFile } from "node:fs/promises"
import { join } from "node:path"

const ALLOWED = new Set(["ru", "en"])

export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, "locale")
  if (!locale || !ALLOWED.has(locale)) {
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  }

  const filePath = join(process.cwd(), "public", `graph-${locale}.json`)

  try {
    const raw = await readFile(filePath, "utf8")
    setResponseHeader(event, "content-type", "application/json; charset=utf-8")
    return JSON.parse(raw) as unknown
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Graph file not built" })
  }
})
