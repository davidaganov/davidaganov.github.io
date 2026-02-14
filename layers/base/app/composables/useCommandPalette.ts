import { ref } from "vue"

const isOpen = ref(false)

export function useCommandPalette() {
  const setOpen = (value: boolean) => {
    isOpen.value = value
  }

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    setOpen,
    open,
    close,
    toggle
  }
}
