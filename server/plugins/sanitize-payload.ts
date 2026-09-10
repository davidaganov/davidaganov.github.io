const escapeNuxtDataInHtml = (html: string): string => {
  const marker = 'id="__NUXT_DATA__"'
  let searchPos = 0

  while (searchPos < html.length) {
    const markerIdx = html.indexOf(marker, searchPos)
    if (markerIdx === -1) break

    const tagOpenEnd = html.indexOf(">", markerIdx)
    if (tagOpenEnd === -1) break

    const contentStart = tagOpenEnd + 1
    let i = contentStart
    let inString = false
    let isEscaped = false
    let scriptEndIdx = -1
    let result = html.slice(0, contentStart)

    while (i < html.length) {
      const ch = html[i]

      if (inString) {
        if (isEscaped) {
          isEscaped = false
          result += ch
          i += 1
          continue
        }

        if (ch === "\\") {
          isEscaped = true
          result += ch
          i += 1
          continue
        }

        if (ch === '"') {
          inString = false
          result += ch
          i += 1
          continue
        }

        if (ch === "<" && html.slice(i, i + 9).toLowerCase() === "</script>") {
          result += "<\\/script>"
          i += 9
          continue
        }

        result += ch
        i += 1
      } else {
        if (ch === '"') {
          inString = true
          result += ch
          i += 1
          continue
        }

        if (ch === "<" && html.slice(i, i + 9).toLowerCase() === "</script>") {
          scriptEndIdx = i
          break
        }

        result += ch
        i += 1
      }
    }

    if (scriptEndIdx !== -1) {
      result += html.slice(scriptEndIdx)
      html = result
      searchPos = scriptEndIdx + 9
    } else {
      searchPos = contentStart
    }
  }

  return html
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    if (Array.isArray(htmlContext.bodyAppend)) {
      htmlContext.bodyAppend = htmlContext.bodyAppend.map((chunk) =>
        typeof chunk === "string" && chunk.includes('id="__NUXT_DATA__"')
          ? escapeNuxtDataInHtml(chunk)
          : chunk
      )
    }

    if (Array.isArray(htmlContext.head)) {
      htmlContext.head = htmlContext.head.map((chunk) =>
        typeof chunk === "string" && chunk.includes('id="__NUXT_DATA__"')
          ? escapeNuxtDataInHtml(chunk)
          : chunk
      )
    }
  })
})
