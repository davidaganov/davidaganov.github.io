import { getLocaleCodes } from "@app/config/locales"
import type { DocsGraphFile } from "@docs/types"

export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, "locale")
  if (!locale || !getLocaleCodes().includes(locale)) {
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  }

  const data = await useStorage("assets:server").getItem(`graph-${locale}.json`)

  if (!data) {
    throw createError({
      statusCode: 503,
      statusMessage: "Graph file is not built yet. Run npm run build:docs-assets."
    })
  }

  setResponseHeader(event, "content-type", "application/json; charset=utf-8")
  return data as DocsGraphFile
})
