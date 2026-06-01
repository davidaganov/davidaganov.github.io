import { shouldRedirectTrailingSlash, stripTrailingSlashFromPath } from "@app/utils/seo"

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const { pathname } = url

  if (!shouldRedirectTrailingSlash(pathname)) return

  const target = `${stripTrailingSlashFromPath(pathname)}${url.search}`

  return sendRedirect(event, target, 301)
})
