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
})
