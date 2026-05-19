import { defineCollection, defineContentConfig } from "@nuxt/content"
import { getLocaleCodes } from "./app/config"

const collections = Object.fromEntries(
  getLocaleCodes().map((locale) => [
    `content_${locale}`,
    defineCollection({
      type: "page",
      source: {
        include: `${locale}/**`,
        prefix: ""
      }
    })
  ])
)

export default defineContentConfig({
  collections
})
