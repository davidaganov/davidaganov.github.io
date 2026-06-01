import { DEFAULT_LOCALE, normalizeDefaultLocalePath } from "@app/utils/seo"
import { ROUTE_PATH } from "@base/types"

const DEFAULT_LOCALE_PREFIX_RE = new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`)

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  if (!DEFAULT_LOCALE_PREFIX_RE.test(url.pathname)) return

  const canonicalPath = normalizeDefaultLocalePath(url.pathname) || ROUTE_PATH.HOME
  const target = `${canonicalPath}${url.search}`

  return sendRedirect(event, target, 301)
})
