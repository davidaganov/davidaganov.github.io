export const useDocsLayoutTransition = () => {
  const route = useRoute()

  const light = ref(0.3)

  let fadeMidTimer: ReturnType<typeof setTimeout> | null = null
  let fadeOutTimer: ReturnType<typeof setTimeout> | null = null

  const clearTimers = () => {
    if (fadeMidTimer) clearTimeout(fadeMidTimer)
    if (fadeOutTimer) clearTimeout(fadeOutTimer)
    fadeMidTimer = null
    fadeOutTimer = null
  }

  watch(
    () => route.fullPath,
    () => {
      clearTimers()
      light.value = 1

      fadeMidTimer = setTimeout(() => {
        light.value = 0.6
      }, 150)

      fadeOutTimer = setTimeout(() => {
        light.value = 0.3
      }, 600)
    }
  )

  onBeforeUnmount(clearTimers)

  return { light }
}
