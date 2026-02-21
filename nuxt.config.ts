import { fileURLToPath } from "node:url"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/i18n", "@nuxt/content", "@pinia/nuxt", "@vueuse/motion/nuxt"],

  extends: ["./layers/ui", "./layers/api", "./layers/docs", "./layers/base"],

  alias: {
    "@app": fileURLToPath(new URL("./app", import.meta.url)),
    "@ui": fileURLToPath(new URL("./layers/ui/app", import.meta.url)),
    "@base": fileURLToPath(new URL("./layers/base/app", import.meta.url)),
    "@docs": fileURLToPath(new URL("./layers/docs/app", import.meta.url)),
    "@api": fileURLToPath(new URL("./layers/api/app", import.meta.url))
  },

  content: {
    _localDatabase: {
      type: "sqlite",
      filename: ".data/content/contents.sqlite"
    }
  },

  mdc: {
    highlight: {
      theme: {
        default: "github-dark"
      },
      langs: ["vue", "ts", "tsx", "js", "json", "bash"]
    }
  },

  i18n: {
    locales: [
      { code: "ru", iso: "ru-RU", file: "ru.json" },
      { code: "en", iso: "en-US", file: "en.json" }
    ],
    defaultLocale: "ru",
    langDir: "locales",
    strategy: "prefix_and_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root"
    }
  },

  devtools: {
    enabled: false
  },

  devServer: {
    host: "0.0.0.0"
  },

  css: ["@/assets/css/main.css"],

  app: {
    pageTransition: { name: "page" },
    layoutTransition: { name: "layout" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],
      meta: [
        { name: "msapplication-TileColor", content: "#b87eef" },
        { name: "msapplication-config", content: "/browserconfig.xml" },
        { name: "theme-color", content: "#3d294f" }
      ]
    }
  },

  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: ""
  },

  pinia: {
    storesDirs: ["./stores/**", "./layers/*/stores/**"]
  },

  routeRules: {
    "/**": { prerender: true }
  },

  nitro: {
    preset: "github-pages",
    prerender: {
      routes: ["/"],
      crawlLinks: true,
      failOnError: false
    }
  },

  ssr: true,

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: "2025-01-15"
})
