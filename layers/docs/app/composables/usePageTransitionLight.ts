import { ref, watch } from "vue"
import { useRoute } from "vue-router"

export const usePageTransitionLight = () => {
  const route = useRoute()
  const light = ref(0.3)

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(
    () => route.fullPath,
    () => {
      if (timeoutId) clearTimeout(timeoutId)

      light.value = 1

      timeoutId = setTimeout(() => {
        light.value = 0.6
      }, 150)

      timeoutId = setTimeout(() => {
        light.value = 0.3
      }, 600)
    }
  )

  return { light }
}
