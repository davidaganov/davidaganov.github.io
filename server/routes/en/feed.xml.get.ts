import { createDocsTranslator } from "../../utils/docsI18n"
import { serveRssFeed } from "../../utils/rssPosts"

export default defineEventHandler(async (event) => {
  const t = createDocsTranslator("en")

  return serveRssFeed(event, {
    locale: "en",
    channelTitle: t("layout.rss.feedTitle"),
    channelDescription: t("layout.rss.feedDescription")
  })
})
