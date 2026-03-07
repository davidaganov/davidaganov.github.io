<script setup lang="ts">
import { ref, watch, onMounted } from "vue"

const PROGRESS_INITIAL_PERCENT = 90
const FADE_OUT_DURATION_MS = 300
const FINISH_DELAY_MS = 300

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
      progress.value = 100

      setTimeout(() => {
        isFadingOut.value = true

        setTimeout(() => {
          isVisible.value = false
          emit("hidden")
        }, FADE_OUT_DURATION_MS)
      }, FINISH_DELAY_MS)
    }
  }
)

onMounted(() => {
  requestAnimationFrame(() => {
    progress.value = PROGRESS_INITIAL_PERCENT
  })
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#060a15] text-white transition-opacity duration-500"
      :class="{ 'opacity-0': isFadingOut, 'opacity-100': !isFadingOut }"
    >
      <div class="mb-4 text-sm font-medium tracking-widest text-white/50 uppercase">
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
              ? 'width 0.3s ease-out'
              : 'width 10s cubic-bezier(0.1, 0.7, 0.1, 1)'
          }"
        />
      </div>
    </div>
  </Teleport>
</template>
