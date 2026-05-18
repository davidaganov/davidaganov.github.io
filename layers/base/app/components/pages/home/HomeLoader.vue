<script setup lang="ts">
const PROGRESS_INITIAL_PERCENT = 65
const WAITING_PROGRESS_SECONDS = 2.4
const FADE_OUT_DURATION_MS = 300
const FINISH_DELAY_MS = 120
const LOADER_MAX_WAIT_MS = 8000

const props = defineProps<{
  isFinished: boolean
}>()

const emit = defineEmits<{
  hidden: []
}>()

const progress = ref(0)
const isVisible = ref(true)
const isFadingOut = ref(false)

watch(
  () => props.isFinished,
  (finished) => {
    if (finished) {
      if (maxWaitTimer) clearTimeout(maxWaitTimer)
      setTimeout(() => finishLoader(), FINISH_DELAY_MS)
    }
  },
  { immediate: true }
)

let maxWaitTimer: ReturnType<typeof setTimeout> | null = null

const finishLoader = () => {
  if (!isVisible.value || isFadingOut.value) return
  progress.value = 100
  isFadingOut.value = true
  setTimeout(() => {
    isVisible.value = false
    emit("hidden")
  }, FADE_OUT_DURATION_MS)
}

onMounted(() => {
  requestAnimationFrame(() => {
    progress.value = PROGRESS_INITIAL_PERCENT
  })

  maxWaitTimer = setTimeout(() => {
    if (!props.isFinished) finishLoader()
  }, LOADER_MAX_WAIT_MS)
})

onBeforeUnmount(() => {
  if (maxWaitTimer) clearTimeout(maxWaitTimer)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white text-gray-900 transition-opacity duration-500 dark:bg-[#060a15] dark:text-white"
      :class="{ 'opacity-0': isFadingOut, 'opacity-100': !isFadingOut }"
    >
      <div
        class="mb-4 text-sm font-medium tracking-widest text-gray-800 uppercase dark:text-white/50"
      >
        {{ $t("global.status.loading") }}
      </div>

      <!-- Progress Bar Container -->
      <div class="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
        <!-- Progress Bar Fill -->
        <div
          class="bg-primary-500 dark:bg-primary-400 absolute top-0 left-0 h-full rounded-full"
          :style="{
            width: `${progress}%`,
            transition: isFinished
              ? 'width 0.25s ease-out'
              : `width ${WAITING_PROGRESS_SECONDS}s cubic-bezier(0.1, 0.7, 0.1, 1)`
          }"
        />
      </div>
    </div>
  </Teleport>
</template>
