import { useRuntimeConfig } from "nitropack/runtime"
import { createRequire } from "node:module"
import { join } from "node:path"
import { joinURL } from "ufo"
import { absoluteUrl } from "@app/utils/seo"
import type { DocsRssOgImageInput } from "@app/types"

interface OgImageUrlResult {
  url: string
  hash?: string
}

type BuildOgImageUrlFn = (
  options: Record<string, unknown>,
  extension?: string,
  isStatic?: boolean,
  defaults?: Record<string, unknown>,
  secret?: string
) => OgImageUrlResult

const require = createRequire(import.meta.url)
const { buildOgImageUrl } = require(
  join(process.cwd(), "node_modules/nuxt-og-image/dist/runtime/shared/urlEncoding.js")
) as { buildOgImageUrl: BuildOgImageUrlFn }

const buildOgImagePath = (pagePath: string, options: Record<string, unknown>): string => {
  const runtimeConfig = useRuntimeConfig()
  const moduleCfg = (runtimeConfig["nuxt-og-image"] || {}) as {
    defaults?: Record<string, unknown>
    security?: { secret?: string; strict?: boolean }
  }
  const ogImageSecret = runtimeConfig.ogImage?.secret || moduleCfg.security?.secret
  const security = ogImageSecret
    ? { ...moduleCfg.security, secret: ogImageSecret }
    : moduleCfg.security
  const isStatic = import.meta.prerender && !(security?.secret && security?.strict)
  const mergedOptions = { ...options, _path: pagePath }
  const result = buildOgImageUrl(
    mergedOptions,
    "png",
    isStatic,
    moduleCfg.defaults || {},
    security?.secret
  )
  const baseURL = runtimeConfig.app.baseURL || "/"

  return joinURL("/", baseURL, result.url)
}

export const getDocsRssOgImageUrl = (siteUrl: string, input: DocsRssOgImageInput): string => {
  const path = buildOgImagePath(input.pagePath, {
    component: "DocsPage",
    extension: "png",
    width: 1200,
    height: 630,
    title: input.title,
    description: input.description,
    section: input.section,
    collection: input.collection
  })

  return absoluteUrl(siteUrl, path)
}

export const getHomeRssOgImageUrl = (
  siteUrl: string,
  pagePath: string,
  title: string,
  description: string
): string => {
  const path = buildOgImagePath(pagePath, {
    component: "HomePage",
    extension: "png",
    width: 1200,
    height: 630,
    title,
    description
  })

  return absoluteUrl(siteUrl, path)
}
