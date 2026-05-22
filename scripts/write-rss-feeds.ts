import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { getLocaleCodes } from "../app/config/locales"
import { buildRssFeedXml, getRssFeedPublicPath } from "../app/utils/rss"
import { DEFAULT_LOCALE, localizedPath, normalizeSiteUrl } from "../app/utils/seo"

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..")
const i18nDir = resolve(root, "i18n/locales")

const resolveKey = (messages: Record<string, unknown>, key: string): string => {
  const value = key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[part]
    }
    return undefined
  }, messages)

  return typeof value === "string" ? value : key
}

const loadTranslator = (locale: string): ((key: string) => string) => {
  const raw = readFileSync(`${i18nDir}/${locale}.json`, "utf8")
  const messages = JSON.parse(raw) as Record<string, unknown>
  return (key: string) => resolveKey(messages, key)
}

const outputTargets = (): string[] => {
  const targets = [resolve(root, "public")]
  const vercelOutput = resolve(root, ".output/public")
  const nitroOutput = resolve(root, ".vercel/output/static")

  if (existsSync(vercelOutput)) targets.push(vercelOutput)
  if (existsSync(nitroOutput)) targets.push(nitroOutput)

  return targets
}

const main = (): void => {
  const siteUrl = normalizeSiteUrl(process.env.NUXT_PUBLIC_SITE_URL)

  for (const locale of getLocaleCodes()) {
    const t = loadTranslator(locale)
    const xml = buildRssFeedXml({
      locale,
      siteUrl,
      channelTitle: t("layout.rss.feedTitle"),
      channelDescription: t("layout.rss.feedDescription")
    })

    const feedPath = getRssFeedPublicPath(locale, DEFAULT_LOCALE)
    const fileName = feedPath.startsWith("/") ? feedPath.slice(1) : feedPath

    for (const dir of outputTargets()) {
      mkdirSync(dir, { recursive: true })
      const outPath = resolve(dir, fileName)
      writeFileSync(outPath, xml, "utf8")
      console.info(`write-rss-feeds: wrote ${outPath}`)
    }
  }
}

main()
