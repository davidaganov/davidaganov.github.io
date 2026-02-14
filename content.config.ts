import { defineCollection, defineContentConfig } from "@nuxt/content"

export default defineContentConfig({
  collections: {
    content_ru: defineCollection({
      type: "page",
      source: {
        include: "ru/**",
        prefix: ""
      }
    }),
    content_en: defineCollection({
      type: "page",
      source: {
        include: "en/**",
        prefix: ""
      }
    })
  }
})
