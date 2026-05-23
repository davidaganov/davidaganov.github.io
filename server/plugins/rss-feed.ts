import { getLocaleCodes } from "@app/config/locales"
import { getRssFeedPublicPath } from "@app/utils/rss"
import { DEFAULT_LOCALE } from "@app/utils/seo"
import { serveRssFeed } from "../utils/rss"

export default defineNitroPlugin((nitro) => {
  for (const locale of getLocaleCodes()) {
    const path = getRssFeedPublicPath(locale, DEFAULT_LOCALE)

    nitro.router.get(
      path,
      defineEventHandler((event) => serveRssFeed(event, { locale }))
    )
  }
})
