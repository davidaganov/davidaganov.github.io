import { serveRssFeed } from "../../utils/rss"

export default defineEventHandler((event) => {
  const locale = getRouterParam(event, "locale") ?? ""
  return serveRssFeed(event, { locale })
})
