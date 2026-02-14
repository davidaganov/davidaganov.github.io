<script setup lang="ts">
import { AVAILABLE_LOCALES } from "@base/constants"
import { ROUTE_PATH, LOCALE } from "@base/types/enums"
import FaultyTerminal from "@ui/components/bits/FaultyTerminal.vue"
import TextType from "@ui/components/bits/TextType.vue"

const localePath = useLocalePath()

const { toggle } = useCommandPalette()
const { locale, setLocale } = useI18n()

const noiseAmp = computed(() => 0.3 + Math.random() * 0.3)

const currentLocale = computed({
  get: () => locale.value as LOCALE,
  set: (value: LOCALE) => setLocale(value)
})

const scrollToLinks = () => {
  const element = document.getElementById("links-section")
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}
</script>

<template>
  <div class="relative flex min-h-[500px] h-dvh w-full flex-col items-center justify-center p-8">
    <!-- Language Switcher -->
    <div class="absolute right-6 top-6 z-20">
      <USelect
        v-model="currentLocale"
        size="sm"
        class="w-20"
        :items="AVAILABLE_LOCALES"
        :ui="{
          base: 'bg-white/10 backdrop-blur-md border-white/20 text-white',
          menu: 'bg-black/90 border-white/20',
          option: 'text-white hover:bg-white/10'
        }"
      />
    </div>

    <!-- Background Effect -->
    <div class="absolute inset-0 overflow-hidden">
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

    <!-- Overlay for better text legibility -->
    <div class="absolute inset-0 pointer-events-none bg-background-deep/50 backdrop-blur-[1px]" />

    <!-- Content -->
    <div class="relative z-10 flex max-w-3xl flex-col items-center text-center">
      <span
        class="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-primary-300 backdrop-blur-md"
      >
        {{ $t("home.badge") }}
      </span>

      <TextType
        as="h1"
        class="mb-6 text-4xl tracking-tight text-transparent bg-clip-text font-bold bg-linear-to-r from-white to-white/60 pb-2 sm:text-7xl lg:text-8xl"
        cursor-class-name="text-white"
        :text="$t('home.title')"
        :typing-speed="100"
        :show-cursor="true"
        :loop="false"
        :hide-cursor-after-complete="false"
      />

      <p class="max-w-3xl text-lg text-gray-400 text-balance sm:text-xl">
        {{ $t("home.description") }}
      </p>

      <div class="mt-10 flex gap-4">
        <NuxtLink
          class="relative inline-flex border border-white/10 group hover:bg-white/20 hover:shadow-[0_0_20px_rgba(184,126,239,0.3)] backdrop-blur-md items-center justify-center overflow-hidden rounded-lg bg-white/10 px-8 py-3 font-medium text-white transition-all duration-300"
          :to="localePath(ROUTE_PATH.GETTING_STARTED)"
        >
          <span class="mr-2">{{ $t("home.getStarted") }}</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="size-5 transition-transform group-hover:translate-x-1"
          />
          <div
            class="absolute inset-0 -z-10 bg-linear-to-r from-primary-500/20 to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </NuxtLink>

        <!-- Command Palette Trigger -->
        <button
          class="group hidden md:flex items-center backdrop-blur-md justify-center rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-gray-400 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
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

    <!-- Scroll Indicator -->
    <div class="absolute bottom-5 left-0 right-0 z-20 flex justify-center">
      <button
        class="group flex flex-col items-center gap-2 text-gray-400/80 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 focus-visible:ring-offset-0"
        aria-label="Scroll to links"
        @click="scrollToLinks"
      >
        <span class="text-[10px] font-medium uppercase tracking-[0.28em] opacity-60">
          {{ $t("home.links.scrollDown") }}
        </span>
        <UIcon
          name="i-lucide-chevron-down"
          class="size-4 opacity-60 transition-all duration-300 group-hover:opacity-90 motion-safe:group-hover:translate-y-0.5 motion-safe:animate-[bounce_1.6s_ease-in-out_infinite]"
        />
      </button>
    </div>
  </div>
</template>
