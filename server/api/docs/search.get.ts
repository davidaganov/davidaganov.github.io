import type { H3Event } from "h3"
import { getLocaleCodes } from "@app/config/locales"
import { mapSearchResults } from "@docs/utils/mapSearchResults"
import type { SearchIndexFile } from "@docs/types"
import { createServerTranslator } from "../../utils/locale-messages"

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const q = String(query.q || "").trim()
  const locale = String(query.locale || "ru")

  if (!q) return []
  if (!getLocaleCodes().includes(locale)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid locale" })
  }

  const data = await useStorage("assets:server").getItem(`search-${locale}.json`)

  if (!data) {
    throw createError({
      statusCode: 503,
      statusMessage: "Search index is not built yet. Run npm run build:docs-assets."
    })
  }

  setResponseHeader(event, "Cache-Control", "public, max-age=300, s-maxage=300")

  const index = data as SearchIndexFile
  const t = createServerTranslator(locale)
  return mapSearchResults(index.pages, q, t)
})
