const CHUNK_DAYS = 540

const formatUtcDate = (date: Date): string => date.toISOString().slice(0, 10)

const addUtcDays = (date: Date, days: number): Date => {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

export const getNpmDownloadChunks = (
  start: Date,
  end: Date
): Array<{ start: string; end: string }> => {
  const chunks: Array<{ start: string; end: string }> = []
  let cursor = new Date(start)
  const endMs = end.getTime()

  while (cursor.getTime() <= endMs) {
    const chunkEnd = addUtcDays(cursor, CHUNK_DAYS - 1)
    const effectiveEnd = chunkEnd.getTime() > endMs ? end : chunkEnd

    chunks.push({
      start: formatUtcDate(cursor),
      end: formatUtcDate(effectiveEnd)
    })

    cursor = addUtcDays(effectiveEnd, 1)
  }

  return chunks.length ? chunks : [{ start: formatUtcDate(end), end: formatUtcDate(end) }]
}

export const getNpmDownloadsStartDate = (createdAt: string | undefined, end: Date): Date => {
  if (createdAt) {
    const created = new Date(createdAt)
    if (!Number.isNaN(created.getTime())) return created
  }

  return addUtcDays(end, -365)
}
