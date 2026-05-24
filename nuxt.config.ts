import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import {
  getNuxtDefaultLocale,
  getNuxtI18nLocales,
  getPrerenderRouteRules,
  getPrerenderRoutes,
  getSitemapUrls
} from "./app/config"
import { normalizeSiteUrl } from "./app/utils/seo"

const rootDir = fileURLToPath(new URL(".", import.meta.url))
const siteUrl = normalizeSiteUrl(process.env.NUXT_PUBLIC_SITE_URL)
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@nuxt/content",
    "@pinia/nuxt",
    "@vueuse/motion/nuxt",
    "@nuxtjs/seo",
    "@nuxt/fonts"
  ],

  site: {
    url: siteUrl,
    name: "Aganov.dev"
  },

  sitemap: {
    urls: () => getSitemapUrls(siteUrl),
    excludeAppSources: true,
    autoLastmod: false,
    xsl: false,
    credits: false,
    zeroRuntime: true
  },

  robots: {
    sitemap: ["/sitemap_index.xml"],
    mergeWithRobotsTxtPath: false,
    credits: false
  },

  linkChecker: {
    runOnBuild: true,
    failOnError: false,
    fetchRemoteUrls: false,
    excludeLinks: ["/api/**", "/__og-image__/**"]
  },

  schemaOrg: {
    defaults: false
  },

  fonts: {
    families: [{ name: "Inter", weights: [400, 500, 700], global: true }]
  },

  ogImage: {
    zeroRuntime: true,
    debug: false,
    buildCache: true,
    security: {
      strict: true,
      restrictRuntimeImagesToOrigin: true,
      maxQueryParamSize: 2048
    }
  },

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
    baseUrl: siteUrl,
    locales: getNuxtI18nLocales(),
    defaultLocale: getNuxtDefaultLocale(),
    langDir: "locales",
    strategy: "prefix_and_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      fallbackLocale: getNuxtDefaultLocale()
    }
  },

  devtools: {
    enabled: false
  },

  runtimeConfig: {
    githubToken: process.env.NUXT_GITHUB_TOKEN || "",
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://aganov.dev",
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY || ""
    }
  },

  hooks: {
    ready(nuxt) {
      if (!nuxt.options.dev) return

      execSync("npx tsx scripts/build-docs-assets.ts", {
        cwd: rootDir,
        stdio: "inherit",
        env: process.env
      })
    },
    "nitro:build:before"() {
      execSync("npx tsx scripts/build-docs-assets.ts", {
        cwd: rootDir,
        stdio: "inherit",
        env: process.env
      })
    }
  },

  css: ["@/assets/css/main.css"],

  app: {
    pageTransition: { name: "page" },
    layoutTransition: { name: "layout" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicons/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicons/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicons/apple-touch-icon.png" },
        { rel: "manifest", href: "/favicons/site.webmanifest" }
      ],
      meta: [{ name: "theme-color", content: "#3d294f" }]
    }
  },

  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: ""
  },

  components: {
    dirs: [
      {
        path: fileURLToPath(new URL("./layers/docs/app/content/tools", import.meta.url)),
        extensions: ["vue"],
        pathPrefix: false
      }
    ]
  },

  imports: {
    scan: false,
    dirs: []
  },

  pinia: {
    storesDirs: ["./stores/**", "./layers/*/stores/**"]
  },

  routeRules: getPrerenderRouteRules(),

  nitro: {
    preset: "vercel",
    serverAssets: [
      {
        baseName: "server",
        dir: "./server/assets"
      }
    ],
    externals: {
      traceInclude: ["./i18n/locales/*.json", "./server/assets/*.json"]
    },
    prerender: {
      crawlLinks: false,
      routes: getPrerenderRoutes()
    }
  },

  ssr: true,

  future: {
    compatibilityVersion: 4
  },

  experimental: {
    payloadExtraction: true
  },

  sourcemap: {
    client: true
  },

  icon: {
    provider: "iconify",
    clientBundle: {
      scan: true
    },
    serverBundle: "local"
  },

  compatibilityDate: "2025-01-15"
})
