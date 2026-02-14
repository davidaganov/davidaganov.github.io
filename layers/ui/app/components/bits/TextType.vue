<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, useTemplateRef } from "vue"

const props = withDefaults(
  defineProps<{
    as?: string
    typingSpeed?: number
    initialDelay?: number
    pauseDuration?: number
    deletingSpeed?: number
    loop?: boolean
    className?: string
    showCursor?: boolean
    hideCursorWhileTyping?: boolean
    hideCursorAfterComplete?: boolean
    cursorCharacter?: string
    cursorBlinkDuration?: number
    cursorClassName?: string
    text: string | string[]
    textColors?: string[]
    variableSpeed?: { min: number; max: number }
    startOnVisible?: boolean
    reverseMode?: boolean
    onSentenceComplete?: (sentence: string, index: number) => void
  }>(),
  {
    as: "div",
    typingSpeed: 50,
    initialDelay: 0,
    pauseDuration: 2000,
    deletingSpeed: 30,
    loop: true,
    className: "",
    showCursor: true,
    hideCursorWhileTyping: false,
    hideCursorAfterComplete: false,
    cursorCharacter: "_",
    cursorBlinkDuration: 0.5,
    cursorClassName: "",
    variableSpeed: undefined,
    startOnVisible: false,
    reverseMode: false,
    onSentenceComplete: undefined,
    textColors: () => []
  }
)

const displayedText = ref("")
const currentCharIndex = ref(0)
const isDeleting = ref(false)
const currentTextIndex = ref(0)
const isVisible = ref(!props.startOnVisible)
const isTypingComplete = ref(false)
const containerRef = useTemplateRef("containerRef")

const textArray = computed(() => (Array.isArray(props.text) ? props.text : [props.text]))

const getRandomSpeed = () => {
  if (!props.variableSpeed) return props.typingSpeed
  const { min, max } = props.variableSpeed
  return Math.random() * (max - min) + min
}

const getCurrentTextColor = () => {
  if (!props.textColors.length) return "#ffffff"
  return props.textColors[currentTextIndex.value % props.textColors.length]
}

let timeout: ReturnType<typeof setTimeout> | null = null

const clearTimeoutIfNeeded = () => {
  if (timeout) clearTimeout(timeout)
}

const executeTypingAnimation = () => {
  const currentText = textArray.value[currentTextIndex.value]
  if (!currentText) return

  const processedText = props.reverseMode ? currentText.split("").reverse().join("") : currentText

  if (isDeleting.value) {
    if (displayedText.value === "") {
      isDeleting.value = false
      if (currentTextIndex.value === textArray.value.length - 1 && !props.loop) return

      const completedText = textArray.value[currentTextIndex.value]
      if (completedText) {
        props.onSentenceComplete?.(completedText, currentTextIndex.value)
      }

      currentTextIndex.value = (currentTextIndex.value + 1) % textArray.value.length
      currentCharIndex.value = 0
      timeout = setTimeout(() => {}, props.pauseDuration)
    } else {
      timeout = setTimeout(() => {
        displayedText.value = displayedText.value.slice(0, -1)
      }, props.deletingSpeed)
    }
  } else {
    if (currentCharIndex.value < processedText.length) {
      timeout = setTimeout(
        () => {
          displayedText.value += processedText[currentCharIndex.value]
          currentCharIndex.value += 1
        },
        props.variableSpeed ? getRandomSpeed() : props.typingSpeed
      )
    } else if (textArray.value.length > 1) {
      timeout = setTimeout(() => {
        isDeleting.value = true
      }, props.pauseDuration)
    } else {
      isTypingComplete.value = true
    }
  }
}

watch(
  [displayedText, currentCharIndex, isDeleting, isVisible],
  () => {
    if (!isVisible.value) return
    clearTimeoutIfNeeded()

    if (currentCharIndex.value === 0 && !isDeleting.value && displayedText.value === "") {
      timeout = setTimeout(() => {
        executeTypingAnimation()
      }, props.initialDelay)
    } else {
      executeTypingAnimation()
    }
  },
  { immediate: true }
)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (props.startOnVisible && containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) isVisible.value = true
        })
      },
      { threshold: 0.1 }
    )
    if (containerRef.value instanceof Element) {
      observer.observe(containerRef.value)
    }
  }
})

onBeforeUnmount(() => {
  clearTimeoutIfNeeded()
  observer?.disconnect()
})
</script>

<template>
  <component
    v-bind="$attrs"
    :is="as"
    :class="`inline-block whitespace-pre-wrap tracking-tight ${className}`"
    ref="containerRef"
  >
    <span
      class="inline"
      :style="{ color: getCurrentTextColor() }"
    >
      {{ displayedText }}
    </span>
    <span
      v-if="showCursor && !(hideCursorAfterComplete && isTypingComplete)"
      :class="`ml-1 inline-block opacity-100 animate-blink ${
        hideCursorWhileTyping &&
        (currentCharIndex < (textArray[currentTextIndex]?.length || 0) || isDeleting)
          ? 'hidden'
          : ''
      } ${cursorClassName}`"
      ref="cursorRef"
    >
      {{ cursorCharacter }}
    </span>
  </component>
</template>

<style scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.animate-blink {
  animation: blink 0.5s infinite;
}
</style>
