import { getLocaleCodes } from "@app/config/locales"
import { DEFAULT_LOCALE } from "@app/utils/seo"
import { getFeedPageData } from "../../utils/rss"

export default defineEventHandler(async (event) => {
  const locale = String(getRouterParam(event, "locale") || DEFAULT_LOCALE)

  if (!getLocaleCodes().includes(locale)) {
    throw createError({ statusCode: 404, statusMessage: "Locale not found" })
  }

  setResponseHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600")

  return getFeedPageData(locale)
})
