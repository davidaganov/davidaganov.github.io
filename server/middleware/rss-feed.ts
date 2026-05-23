import { DEFAULT_LOCALE } from "@app/utils/seo"
import { serveRssFeed } from "../utils/rss"

const FEED_LOCALE_BY_PATH: Record<string, string> = {
  "/feed.xml": DEFAULT_LOCALE,
  "/en/feed.xml": "en"
}

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname
  const locale = FEED_LOCALE_BY_PATH[pathname]
  if (!locale) return

  return serveRssFeed(event, { locale })
})
