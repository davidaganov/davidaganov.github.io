interface UnheadTag {
  tag?: string
  props?: Record<string, unknown>
  tagPriority?: string | number
  [key: string]: unknown
}

interface UnheadInstance {
  hooks?: {
    hook: (name: string, fn: (ctx: { tags: UnheadTag[] }) => void) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const originalWarnHandler = nuxtApp.vueApp.config.warnHandler

  nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    const suppressedWarnings = [
      'Slot "default" invoked outside of the render function',
      "<Suspense> is an experimental feature"
    ]

    if (suppressedWarnings.some((w) => msg.includes(w))) {
      return
    }

    if (originalWarnHandler) {
      originalWarnHandler(msg, instance, trace)
    } else {
      console.warn(`[Vue warn]: ${msg}\n${trace}`)
    }
  }

  const originalConsoleWarn = console.warn
  console.warn = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : ""
    if (msg.startsWith("[unhead]") || msg.startsWith("[Icon] failed to load icon")) {
      return
    }
    originalConsoleWarn(...args)
  }

  const head = (nuxtApp.vueApp.config.globalProperties.$unhead ||
    (nuxtApp as unknown as { $unhead?: UnheadInstance }).$unhead) as UnheadInstance | undefined

  if (head?.hooks) {
    head.hooks.hook("tags:resolve", (ctx) => {
      for (const tag of ctx.tags) {
        if (typeof tag.tagPriority === "number") {
          tag.tagPriority = "high"
        }
        if (tag.props?.name === "twitter:image:src") {
          delete tag.props.name
          delete tag.props.content
        }
      }
    })
  }
})
