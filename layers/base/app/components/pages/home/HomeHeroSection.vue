<script setup lang="ts">
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"

const FaultyTerminal = defineAsyncComponent(() => import("@ui/components/bits/FaultyTerminal.vue"))
const Squares = defineAsyncComponent(() => import("@ui/components/bits/Squares.vue"))
const TextType = defineAsyncComponent(() => import("@ui/components/bits/TextType.vue"))

let unmountTimer: ReturnType<typeof setTimeout> | null = null

const { toggle } = useCommandPalette()

const animationEnabled = useCookie<boolean>("animation_enabled", {
  default: () => true,
  sameSite: "lax",
  path: "/"
})

const noiseAmp = ref(0.45)
const backgroundReady = ref(false)
const backgroundMounted = ref(false)
const backgroundVisible = ref(false)

const { localizedPath: aboutEntryPath } = useDocsSectionEntryPath("about")

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

  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      backgroundReady.value = true
    })
  } else {
    setTimeout(() => {
      backgroundReady.value = true
    }, 50)
  }
})
</script>

<template>
  <div class="relative flex h-screen min-h-[500px] w-full flex-col items-center justify-center p-8">
    <div class="absolute top-6 right-6 z-20 flex items-center gap-3">
      <div class="flex items-center gap-2">
        <USwitch
          v-model="animationEnabled"
          size="sm"
          :aria-label="$t('home.disableAnimation')"
          :title="$t('home.disableAnimation')"
          :ui="{
            base: 'bg-white/10 border border-white/20',
            thumb: 'bg-white'
          }"
        />
        <UIcon
          class="size-4 text-white/70"
          :name="animationEnabled ? 'i-lucide-zap' : 'i-lucide-zap-off'"
        />
      </div>
      <UiLanguageSwitcher :blur="true" />
    </div>

    <div class="absolute inset-0 hidden overflow-hidden md:block">
      <div class="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      <div
        class="bg-[radial-gradient(ellipse_at_top, rgba(184,126,239,0.15), transparent_50%)] absolute inset-0"
      />
      <div
        class="bg-[radial-gradient(ellipse_at_bottom_right, rgba(139,92,246,0.1), transparent_50%)] absolute inset-0"
      />
    </div>

    <ClientOnly>
      <div
        v-if="backgroundMounted"
        class="absolute inset-0 hidden overflow-hidden transition-opacity duration-500 ease-in-out md:block"
        :class="backgroundVisible ? 'opacity-100' : 'opacity-0'"
      >
        <FaultyTerminal
          tint="#b87eef"
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
          :brightness="1"
        />
      </div>
    </ClientOnly>

    <div class="absolute inset-0 overflow-hidden md:hidden">
      <div class="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,126,239,0.15),transparent_50%)]"
      />
    </div>

    <ClientOnly>
      <div
        v-if="backgroundMounted"
        class="absolute inset-0 overflow-hidden transition-opacity duration-500 ease-in-out md:hidden"
        :class="backgroundVisible ? 'opacity-100' : 'opacity-0'"
      >
        <Squares
          direction="diagonal"
          border-color="rgba(184, 126, 239, 0.3)"
          hover-fill-color="rgba(184, 126, 239, 0.2)"
          :speed="0.5"
          :square-size="50"
        />
      </div>
    </ClientOnly>

    <div class="bg-background-deep/50 pointer-events-none absolute inset-0 backdrop-blur-[1px]" />

    <div class="relative z-10 flex max-w-3xl flex-col items-center text-center">
      <span
        class="text-primary-300 mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-md"
      >
        {{ $t("home.badge") }}
      </span>

      <TextType
        as="h1"
        class="mb-6 bg-linear-to-r from-white to-white/60 bg-clip-text pb-2 text-4xl font-bold tracking-tight text-transparent sm:text-7xl lg:text-8xl"
        cursor-class-name="text-white"
        :text="$t('common.name')"
        :typing-speed="100"
        :show-cursor="true"
        :loop="false"
        :hide-cursor-after-complete="true"
        :disabled="!animationEnabled"
      />

      <p class="max-w-3xl text-lg text-balance text-gray-400 sm:text-xl">
        {{ $t("home.description") }}
      </p>

      <div class="mt-10 flex gap-4">
        <NuxtLink
          class="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/10 px-8 py-3 font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(184,126,239,0.3)]"
          :to="aboutEntryPath"
        >
          <span class="mr-2">{{ $t("home.getStarted") }}</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="size-5 transition-transform group-hover:translate-x-1"
          />
          <div
            class="from-primary-500/20 absolute inset-0 -z-10 bg-linear-to-r to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </NuxtLink>

        <button
          class="group hidden items-center justify-center rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-gray-400 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white md:flex"
          @click="toggle"
        >
          <UIcon
            name="i-lucide-command"
            class="mr-2 h-4 w-4"
          />
          <span class="text-sm">Ctrl+K</span>
        </button>
      </div>
    </div>

    <div class="absolute right-0 bottom-5 left-0 z-20 flex justify-center">
      <button
        class="group focus-visible:ring-primary-400/40 flex flex-col items-center gap-2 text-gray-400/80 transition-colors duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none"
        aria-label="Scroll to links"
        @click="scrollToLinks"
      >
        <span class="text-[10px] font-medium tracking-[0.28em] uppercase opacity-60">
          {{ $t("home.scrollDown") }}
        </span>
        <UIcon
          name="i-lucide-chevron-down"
          class="size-4 opacity-60 transition-all duration-300 group-hover:opacity-90 motion-safe:animate-[bounce_1.6s_ease-in-out_infinite] motion-safe:group-hover:translate-y-0.5"
        />
      </button>
    </div>
  </div>
</template>
