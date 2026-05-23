import type { Collections } from "@nuxt/content"
import { queryCollection } from "@nuxt/content/server"
import type { H3Event } from "h3"
import { getLocaleCodes } from "@app/config/locales"
import { mapSearchResults } from "@docs/utils/mapSearchResults"
import { createServerTranslator } from "../../utils/locale-messages"

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const q = String(query.q || "").trim()
  const locale = String(query.locale || "ru")

  if (!q) return []
  if (!getLocaleCodes().includes(locale)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid locale" })
  }

  const collection = `content_${locale}` as keyof Collections
  const pages = await queryCollection(event, collection)
    .select("title", "description", "path", "body", "meta")
    .all()

  const t = createServerTranslator(locale)
  return mapSearchResults(pages, q, t)
})
