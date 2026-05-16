export default defineEventHandler(async (event) => {
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
    return await $fetch(url, {
      query,
      headers: {
        ...(config.githubToken ? { Authorization: `Bearer ${config.githubToken}` } : {}),
        "User-Agent": "Nuxt-Portfolio"
      }
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || "GitHub API Error"
    })
  }
})
