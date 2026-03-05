<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core"
import BaseLight from "@docs/components/base/BaseLight.vue"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiThemeToggle from "@ui/components/UiThemeToggle.vue"

const colorMode = useColorMode()

const { frontendYears } = useExperience()

const FaultyTerminal = defineAsyncComponent(() => import("@ui/components/bits/FaultyTerminal.vue"))
const TextType = defineAsyncComponent(() => import("@ui/components/bits/TextType.vue"))

let unmountTimer: ReturnType<typeof setTimeout> | null = null

const { toggle } = useCommandPalette()

const animationEnabled = useCookie<boolean>("animation_enabled", {
  default: () => true,
  sameSite: "lax",
  path: "/"
})

const isDesktop = useMediaQuery("(min-width: 768px)")

const noiseAmp = ref(0.45)
const backgroundReady = ref(false)
const backgroundMounted = ref(false)
const backgroundVisible = ref(false)

const { localizedPath: aboutEntryPath } = useDocsSectionEntryPath("about")

const isDark = computed(() => colorMode.value === "dark")

const scrollToLinks = () => {
  const element = document.getElementById("links-section")
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

watch(
  [animationEnabled, backgroundReady],
  ([anim, ready]) => {
    if (unmountTimer) {
      clearTimeout(unmountTimer)
      unmountTimer = null
    }

    if (anim && ready) {
      backgroundMounted.value = true
      nextTick(() => {
        backgroundVisible.value = true
      })
    } else {
      backgroundVisible.value = false
      unmountTimer = setTimeout(() => {
        backgroundMounted.value = false
      }, 500)
    }
  },
  { immediate: true }
)

onMounted(() => {
  noiseAmp.value = 0.3 + Math.random() * 0.3

  const initBackground = () => {
    setTimeout(() => {
      backgroundReady.value = true
    }, 400)
  }

  if ("requestIdleCallback" in window) {
    requestIdleCallback(initBackground, { timeout: 2000 })
  } else {
    initBackground()
  }
})
</script>

<template>
  <div
    class="relative flex h-screen min-h-[500px] w-full flex-col items-center justify-center p-8 transition-colors duration-500"
    :class="isDark ? 'bg-[#060a15]' : 'bg-white'"
  >
    <div class="absolute top-6 right-6 z-20 flex items-center gap-3">
      <div class="flex items-center gap-2">
        <USwitch
          v-model="animationEnabled"
          size="sm"
          :aria-label="$t('pages.home.disableAnimation')"
          :title="$t('pages.home.disableAnimation')"
          :ui="{
            base: 'bg-black/10! dark:bg-white/10! border border-black/10! dark:border-white/20!',
            thumb: 'bg-gray-700 dark:bg-white'
          }"
        />
        <UIcon
          class="size-4 text-gray-500 dark:text-white/70"
          :name="animationEnabled ? 'i-lucide-zap' : 'i-lucide-zap-off'"
        />
      </div>
      <UiThemeToggle
        v-if="isDesktop"
        :blur="true"
      />
      <UiLanguageSwitcher :blur="true" />
    </div>

    <div
      class="absolute inset-0 overflow-hidden transition-opacity duration-500"
      :class="backgroundVisible ? 'md:opacity-0' : 'md:opacity-100'"
    >
      <BaseLight
        class="top-0! z-10"
        :light="0.4"
      />
      <svg
        class="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
            id="home-grid"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke-width="1.5"
              :stroke="isDark ? 'rgba(184, 126, 239, 0.25)' : 'rgba(124, 58, 237, 0.45)'"
            />
          </pattern>

          <radialGradient
            cx="50%"
            cy="50%"
            r="50%"
            id="home-vignette"
          >
            <stop
              offset="40%"
              stop-color="currentColor"
              class="text-white dark:text-[#0b0b0b]"
              stop-opacity="0"
            />
            <stop
              offset="100%"
              stop-color="currentColor"
              class="text-white dark:text-[#0b0b0b]"
              :stop-opacity="isDark ? 0.65 : 0.3"
            />
          </radialGradient>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#home-grid)"
        />

        <rect
          width="100%"
          height="100%"
          fill="url(#home-vignette)"
        />
      </svg>
    </div>

    <ClientOnly>
      <div
        v-if="backgroundMounted && isDesktop"
        class="absolute inset-0 overflow-hidden transition-opacity duration-500 ease-in-out"
        :class="backgroundVisible ? 'opacity-100' : 'opacity-0'"
      >
        <FaultyTerminal
          :tint="isDark ? '#b87eef' : '#a76ff2'"
          :scale="1.5"
          :grid-mul="[2, 1]"
          :digit-size="1.2"
          :time-scale="0.2"
          :pause="false"
          :scanline-intensity="0.8"
          :glitch-amount="0.6"
          :flicker-amount="0.4"
          :noise-amp="noiseAmp"
          :chromatic-aberration="0"
          :dither="0"
          :curvature="0.1"
          :mouse-react="true"
          :mouse-strength="0.3"
          :page-load-animation="true"
          :brightness="isDark ? 1 : 1.1"
        />
      </div>
    </ClientOnly>

    <div
      class="pointer-events-none absolute inset-0 backdrop-blur-[1px] transition-opacity duration-500"
      :class="isDark ? 'bg-black/40' : 'bg-white/10'"
    />

    <div class="relative z-10 flex max-w-3xl flex-col items-center text-center">
      <span
        class="text-primary-800 dark:text-primary-300 mb-6 inline-block rounded-full border border-white/10 bg-white/25 px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-md dark:border-white/10 dark:bg-white/5"
      >
        {{ $t("pages.home.badge") }}
      </span>

      <TextType
        as="h1"
        class="mb-6 pb-2 text-4xl font-bold tracking-tight text-black sm:text-7xl lg:text-8xl dark:bg-linear-to-r dark:from-white dark:to-white/60 dark:bg-clip-text dark:text-transparent"
        cursor-class-name="text-black dark:text-white"
        :text="$t('global.name')"
        :typing-speed="100"
        :show-cursor="true"
        :loop="false"
        :hide-cursor-after-complete="true"
        :disabled="!animationEnabled"
      />

      <p class="max-w-3xl text-lg text-balance text-gray-900 sm:text-xl dark:text-gray-400">
        {{ $t("pages.home.description", { frontendYears }) }}
      </p>

      <div class="mt-10 flex gap-4">
        <NuxtLink
          class="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-black/20 bg-white/25 px-8 py-3 font-medium text-gray-900 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:shadow-[0_0_20px_rgba(184,126,239,0.3)]"
          :to="aboutEntryPath"
        >
          <span class="mr-2">{{ $t("pages.home.getStarted") }}</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="size-5 transition-transform group-hover:translate-x-1"
          />
          <div
            class="from-primary-500/20 absolute inset-0 -z-10 bg-linear-to-r to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </NuxtLink>

        <button
          class="group hidden items-center justify-center rounded-lg border border-black/20 bg-white/25 px-4 py-3 text-gray-600 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10 hover:text-gray-900 md:flex dark:border-white/10 dark:bg-black/20 dark:text-gray-400 dark:hover:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
          @click="toggle"
        >
          <UIcon
            name="i-lucide-command"
            class="mr-2 size-4"
          />
          <span class="text-sm">Ctrl+K</span>
        </button>
      </div>
    </div>

    <div class="absolute right-0 bottom-5 left-0 z-20 flex justify-center">
      <button
        class="group focus-visible:ring-primary-400/40 flex flex-col items-center gap-2 text-gray-900 transition-colors duration-300 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none dark:text-gray-400/80 dark:hover:text-white"
        aria-label="Scroll to links"
        @click="scrollToLinks"
      >
        <span class="text-[10px] font-medium tracking-[0.28em] uppercase opacity-60">
          {{ $t("pages.home.scrollDown") }}
        </span>
        <UIcon
          name="i-lucide-chevron-down"
          class="size-4 opacity-60 transition-all duration-300 group-hover:opacity-90 motion-safe:animate-[bounce_1.6s_ease-in-out_infinite] motion-safe:group-hover:translate-y-0.5"
        />
      </button>
    </div>
  </div>
</template>
