import { readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const CONTENT_DIR = fileURLToPath(new URL("./content", import.meta.url))

const collectMarkdownPaths = (directory: string): string[] => {
  const entries = readdirSync(directory, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const fullPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      return collectMarkdownPaths(fullPath)
    }

    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      return []
    }

    return [fullPath]
  })
}

const buildOgPrerenderRoutes = (): string[] => {
  const localeDirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  const routes = new Set<string>()

  for (const locale of localeDirs) {
    const localeDir = join(CONTENT_DIR, locale)
    const markdownPaths = collectMarkdownPaths(localeDir)

    for (const filePath of markdownPaths) {
      const relative = filePath
        .slice(localeDir.length)
        .replaceAll("\\", "/")
        .replace(/^\/+/, "")
        .replace(/\.md$/, "")
        .replace(/\/index$/i, "")

      if (!relative) continue

      const segments = relative.split("/").filter(Boolean)
      if (segments.length < 2) continue

      for (let i = 2; i <= segments.length; i++) {
        const partialPath = segments.slice(0, i).join("/")
        routes.add(`/og/${locale}/${partialPath}.png`)
      }
    }
  }

  return [...routes].sort((a, b) => a.localeCompare(b))
}

const ogPrerenderRoutes = buildOgPrerenderRoutes()

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

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://aganov.dev"
    }
  },

  hooks: {
    "components:dirs": (dirs) => {
      const toolsPath = fileURLToPath(new URL("./layers/docs/app/content/tools", import.meta.url))

      dirs.push({
        path: toolsPath,
        extensions: ["vue"],
        pathPrefix: false
      })
    }
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
      routes: ["/", "/sitemap.xml", ...ogPrerenderRoutes],
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
