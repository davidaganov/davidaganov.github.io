<script setup lang="ts">
import { useTransition } from "@vueuse/core"
import Simplebar from "simplebar-vue"
import "simplebar-vue/dist/simplebar.min.css"

const props = withDefaults(
  defineProps<{
    offsetX?: number
    offsetY?: number
    width?: string
    height?: string
  }>(),
  {
    offsetX: 15,
    offsetY: 0,
    width: "100%",
    height: "100%"
  }
)

const scrollBlockRef = ref<any>()
const isVerticalScrollbarVisible = ref(true)
const observer = ref<MutationObserver | null>(null)
const scrollTop = ref(0)
const scrollHeight = ref(0)
const clientHeight = ref(0)

const paddingRight = computed(() => {
  if (!props.offsetX || !isVerticalScrollbarVisible.value) return "0px"
  return `${props.offsetX}px`
})

const paddingBottom = computed(() => (props.offsetY ? `${props.offsetY}px` : "0px"))
const isAtTop = computed(() => scrollTop.value <= 0)
const isAtBottom = computed(() => scrollTop.value + clientHeight.value >= scrollHeight.value - 1)
const topOpacity = computed(() => (isAtTop.value ? 1 : 0))
const bottomOpacity = computed(() => (isAtBottom.value ? 1 : 0))

const topOpacityAnimated = useTransition(topOpacity, {
  duration: 200,
  transition: [0.4, 0, 0.2, 1]
})

const bottomOpacityAnimated = useTransition(bottomOpacity, {
  duration: 150,
  transition: [0.4, 0, 0.2, 1]
})

const maskImage = computed(() => {
  const size = "40px"
  return `linear-gradient(to bottom, rgba(0, 0, 0, ${topOpacityAnimated.value}) 0%, black ${size}, black calc(100% - ${size}), rgba(0, 0, 0, ${bottomOpacityAnimated.value}) 100%)`
})

const updateScrollState = (e: Event) => {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
  scrollHeight.value = target.scrollHeight
  clientHeight.value = target.clientHeight
}

const checkScrollbarVisibility = () => {
  try {
    const element = scrollBlockRef.value?.$el || scrollBlockRef.value
    if (!element || typeof element.querySelector !== "function") return

    const wrapper = element.querySelector(".simplebar-content-wrapper")
    if (wrapper) {
      scrollTop.value = wrapper.scrollTop
      scrollHeight.value = wrapper.scrollHeight
      clientHeight.value = wrapper.clientHeight
    }

    const verticalTrack = element.querySelector(
      ".simplebar-track.simplebar-vertical"
    ) as HTMLElement

    if (verticalTrack) {
      isVerticalScrollbarVisible.value = verticalTrack.style.visibility !== "hidden"
    }
  } catch (error) {
    console.warn("Error checking scrollbar visibility:", error)
  }
}

onMounted(async () => {
  await nextTick()

  const element = scrollBlockRef.value?.$el || scrollBlockRef.value
  if (!element || typeof element.querySelector !== "function") return

  checkScrollbarVisibility()

  const wrapper = element.querySelector(".simplebar-content-wrapper")
  if (wrapper) {
    wrapper.addEventListener("scroll", updateScrollState)
  }

  observer.value = new MutationObserver(checkScrollbarVisibility)

  if (element && observer.value) {
    observer.value.observe(element, {
      attributes: true,
      attributeFilter: ["style"],
      subtree: true,
      childList: true
    })
  }
})

onUnmounted(() => {
  const element = scrollBlockRef.value?.$el || scrollBlockRef.value
  if (element && typeof element.querySelector === "function") {
    const wrapper = element.querySelector(".simplebar-content-wrapper")
    if (wrapper) {
      wrapper.removeEventListener("scroll", updateScrollState)
    }
  }

  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }
})
</script>

<template>
  <Simplebar
    :style="{
      width,
      height,
      maskImage,
      webkitMaskImage: maskImage
    }"
    ref="scrollBlockRef"
  >
    <slot />
  </Simplebar>
</template>

<style scoped>
:deep(.simplebar-content) {
  padding-right: v-bind(paddingRight) !important;
  padding-bottom: v-bind(paddingBottom) !important;
}

:deep(.simplebar-track .simplebar-scrollbar::before) {
  background-color: #8e74c4;
  border-radius: 10px;
  opacity: 0.3;
  left: 2px;
  right: 2px;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease;
}

:deep(.simplebar-track:hover .simplebar-scrollbar::before),
:deep(.simplebar-scrollbar.simplebar-visible::before) {
  opacity: 0.6;
}

:deep(.simplebar-vertical .simplebar-scrollbar::before) {
  top: 4px;
  bottom: 4px;
}

:deep(.simplebar-horizontal .simplebar-scrollbar::before) {
  left: 4px;
  right: 4px;
}

:deep(.simplebar-vertical),
:deep(.simplebar-horizontal) {
  background-color: transparent !important;
}

:deep(.simplebar-vertical) {
  width: 8px;
  right: 2px;
}

:deep(.simplebar-horizontal) {
  height: 8px;
  bottom: 2px;
}

:deep(.simplebar-content-wrapper) {
  outline: none;
}

/* Dark mode support */
:root.dark :deep(.simplebar-track .simplebar-scrollbar::before) {
  background-color: #a78bfa;
}
</style>
