import { DEFAULT_LOCALE } from "@app/utils/seo"
import { serveRssFeed } from "../utils/rss"

export default defineEventHandler((event) => serveRssFeed(event, { locale: DEFAULT_LOCALE }))
