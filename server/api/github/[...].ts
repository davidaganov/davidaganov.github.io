export default defineEventHandler(async (event): Promise<unknown> => {
  const config = useRuntimeConfig()
  const path = event.context.params?._
  const query = getQuery(event)

  if (!path) {
    throw createError({
      statusCode: 400,
      message: "Path is required"
    })
  }

  const url = `https://api.github.com/${path}`

  try {
    return await $fetch<unknown>(url, {
      query,
      headers: {
        ...(config.githubToken ? { Authorization: `Bearer ${config.githubToken}` } : {}),
        "User-Agent": "Nuxt-Portfolio"
      }
    })
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status
    if (status === 404 && String(path).endsWith("/releases/latest")) {
      return null
    }
    throw createError({
      statusCode: status || 500,
      message: error instanceof Error ? error.message : "GitHub API Error"
    })
  }
})
