import { ref } from "vue"

const isOpen = ref(false)
const query = ref("")
const selectedIndex = ref(0)

export function useCommandPalette() {
  const setOpen = (value: boolean) => {
    isOpen.value = value
  }

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    query.value = ""
    selectedIndex.value = 0
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
    if (!isOpen.value) {
      query.value = ""
      selectedIndex.value = 0
    }
  }

  const navigateUp = (total: number) => {
    if (total === 0) return
    selectedIndex.value = (selectedIndex.value - 1 + total) % total
  }

  const navigateDown = (total: number) => {
    if (total === 0) return
    selectedIndex.value = (selectedIndex.value + 1) % total
  }

  const resetSelection = () => {
    selectedIndex.value = 0
  }

  return {
    isOpen,
    query,
    selectedIndex,
    setOpen,
    open,
    close,
    toggle,
    navigateUp,
    navigateDown,
    resetSelection
  }
}
