import { createDocsTranslator } from "../utils/docsI18n"
import { serveRssFeed } from "../utils/rss"

export default defineEventHandler(async (event) => {
  const t = createDocsTranslator("ru")

  return serveRssFeed(event, {
    locale: "ru",
    channelTitle: t("layout.rss.feedTitle"),
    channelDescription: t("layout.rss.feedDescription")
  })
})
