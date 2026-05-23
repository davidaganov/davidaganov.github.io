export default defineEventHandler(async (event) => {
  const data = await useStorage("assets:server").getItem("archive-index.json")

  if (!data) {
    throw createError({
      statusCode: 503,
      statusMessage: "Archive index is not built yet. Run npm run build:docs-assets."
    })
  }

  setResponseHeader(event, "content-type", "application/json; charset=utf-8")
  return data
})
