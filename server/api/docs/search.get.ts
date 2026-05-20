import { queryCollection } from "@nuxt/content/server"
import type { H3Event } from "h3"
import { mapSearchResults } from "@docs/utils/mapSearchResults"
import { isContentLocale } from "@docs/constants"
import type { ContentLocale } from "@docs/types"
import { createDocsTranslator } from "../../utils/docsI18n"

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const q = String(query.q || "").trim()
  const locale = String(query.locale || "ru")

  if (!q) return []
  if (!isContentLocale(locale)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid locale" })
  }

  const collection = `content_${locale}` as const
  const pages = await queryCollection(event, collection)
    .select("title", "description", "path", "body", "meta")
    .all()

  const t = createDocsTranslator(locale as ContentLocale)
  return mapSearchResults(pages, q, t)
})
