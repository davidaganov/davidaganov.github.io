export const formatDate = (dateString: string | undefined, locale = "ru-RU") => {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  } catch {
    return null
  }
}
