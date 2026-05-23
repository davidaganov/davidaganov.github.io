import { serveRssFeed } from "../utils/rss"

export default defineEventHandler(async (event) => serveRssFeed(event, { locale: "ru" }))
