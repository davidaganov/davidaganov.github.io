import type { Ref } from "vue"
import { useResizeObserver } from "@vueuse/core"

const CSS_VAR = "--ui-header-height"

export const useUiHeaderHeight = (headerRef: Ref<HTMLElement | null>) => {
  const syncHeight = () => {
    const el = headerRef.value
    if (!el || import.meta.server) return

    const height = el.offsetHeight
    document.documentElement.style.setProperty(CSS_VAR, `${height}px`)
  }

  useResizeObserver(headerRef, syncHeight)

  onMounted(async () => {
    await nextTick()
    requestAnimationFrame(() => {
      syncHeight()
      requestAnimationFrame(syncHeight)
    })

    watch(
      () => useRoute().fullPath,
      async () => {
        await nextTick()
        requestAnimationFrame(syncHeight)
      }
    )
  })

  onBeforeUnmount(() => {
    document.documentElement.style.setProperty(CSS_VAR, "56px")
  })
}
