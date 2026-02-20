<script setup lang="ts">
const TIME_TO_SHOW_BANNER = 800

const { isDecided, accept, decline } = useCookieConsent()

const isVisible = ref(false)

const handleAccept = () => {
  accept()
  isVisible.value = false
}

const handleDecline = () => {
  decline()
  isVisible.value = false
}

onMounted(() => {
  if (!isDecided.value) {
    setTimeout(() => {
      isVisible.value = true
    }, TIME_TO_SHOW_BANNER)
  }
})
</script>

<template>
  <Transition name="slide-right">
    <div
      v-if="isVisible"
      class="fixed right-0 bottom-0 left-0 z-50 max-w-lg rounded-t-2xl border-t border-white/10 bg-gray-900/95 p-5 shadow-2xl backdrop-blur-xl sm:right-6 sm:bottom-6 sm:left-auto sm:max-w-sm sm:rounded-2xl sm:border"
      role="dialog"
      aria-live="polite"
      :aria-label="$t('cookie.aria')"
    >
      <div class="flex items-start gap-3">
        <div
          class="bg-primary/15 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg"
        >
          <UIcon
            name="i-lucide-cookie"
            class="text-primary size-4"
          />
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-white">
            {{ $t("cookie.title") }}
          </p>
          <p class="text-muted mt-1 text-xs leading-relaxed">
            {{ $t("cookie.description") }}
          </p>
        </div>
      </div>

      <div class="mt-4 flex gap-2">
        <UButton
          class="flex-1 justify-center"
          size="md"
          @click="handleAccept"
        >
          {{ $t("cookie.accept") }}
        </UButton>
        <UButton
          class="flex-1 justify-center"
          color="neutral"
          variant="outline"
          size="md"
          @click="handleDecline"
        >
          {{ $t("cookie.decline") }}
        </UButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
