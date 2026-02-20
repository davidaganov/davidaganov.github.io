export type DateFormat = "full" | "short" | "numeric"

export const formatDate = (
  dateString: string | undefined,
  locale: string = "ru-RU",
  format: DateFormat = "full"
): string | null => {
  if (!dateString) return null
  try {
    const date = new Date(dateString)

    if (format === "numeric") {
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })
    }

    if (format === "short") {
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    }

    // full format (default)
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  } catch {
    return null
  }
}
