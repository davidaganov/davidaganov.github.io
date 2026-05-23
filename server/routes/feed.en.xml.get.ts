import { serveRssFeed } from "../utils/rss"

export default defineEventHandler((event) => serveRssFeed(event, { locale: "en" }))
