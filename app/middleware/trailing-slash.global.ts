import { shouldRedirectTrailingSlash, stripTrailingSlashFromPath } from "@app/utils/seo"

export default defineNuxtRouteMiddleware((to) => {
  if (!shouldRedirectTrailingSlash(to.path)) return

  return navigateTo(
    {
      path: stripTrailingSlashFromPath(to.path),
      query: to.query,
      hash: to.hash
    },
    { redirectCode: 301 }
  )
})
