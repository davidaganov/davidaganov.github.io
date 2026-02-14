<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core"
import HomeLinkCard from "@base/components/pages/home/HomeLinkCard.vue"
import HomeLinksEmpty from "@base/components/pages/home/HomeLinksEmpty.vue"
import { VIEW_MODE, ROUTE_PATH } from "@base/types/enums"
import type { Link } from "@base/types/links"
import UiTabs from "@ui/components/bits/UiTabs.vue"

const { t } = useI18n()
const localePath = useLocalePath()
const { locale } = useI18n()

const mode = ref<VIEW_MODE>(VIEW_MODE.PROFESSIONAL)
const displayedMode = ref<VIEW_MODE>(VIEW_MODE.PROFESSIONAL)
const sectionRef = ref<HTMLElement | null>(null)
const revealed = ref(false)
const motionKey = ref(0)
const phase = ref<"hidden" | "enter" | "leave">("hidden")

const { links, error } = useLinksGistClient()

const ANIMATION_CONFIG = {
  INITIAL: {
    opacity: 0,
    y: 14,
    filter: "blur(6px)"
  },
  DURATION: 294,
  STAGGER_DELAY: 56
} as const

const INTERSECTION_CONFIG = {
  threshold: [0, 0.2, 0.35, 0.5, 1],
  rootMargin: "0px 0px -15% 0px"
}

const getLocalizedText = (value?: { ru: string; en: string }): string | undefined => {
  if (!value) return undefined
  return value[locale.value as keyof typeof value] || value.en
}

const getCardEnter = (index: number) => {
  if (phase.value === "hidden") return ANIMATION_CONFIG.INITIAL
  if (phase.value === "leave") {
    return {
      ...ANIMATION_CONFIG.INITIAL,
      transition: {
        duration: ANIMATION_CONFIG.DURATION,
        ease: "easeIn",
        delay: 0
      }
    }
  }

  return {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: ANIMATION_CONFIG.DURATION,
      ease: "easeOut",
      delay: index * ANIMATION_CONFIG.STAGGER_DELAY
    }
  }
}

const viewModeItems = computed(() => [
  {
    value: VIEW_MODE.PROFESSIONAL,
    label: t("home.links.tabs.professional"),
    icon: "i-lucide-briefcase"
  },
  {
    value: VIEW_MODE.PERSONAL,
    label: t("home.links.tabs.personal"),
    icon: "i-lucide-user"
  }
])

const activeLinks = computed(() =>
  displayedMode.value === VIEW_MODE.PROFESSIONAL ? links.value.professional : links.value.personal
)

const localizedLinks = computed(() => {
  const transformedLinks = activeLinks.value.map((link: Link) => ({
    ...link,
    localizedName: getLocalizedText(link.name),
    localizedDescription: getLocalizedText(link.description),
    isCta: false
  }))

  return [
    ...transformedLinks,
    {
      url: localePath(ROUTE_PATH.GETTING_STARTED),
      localizedName: t("home.links.cta"),
      localizedDescription: t("home.links.ctaDescription"),
      icon: "i-lucide-book-open",
      isCta: true,
      customStyle: { color: "#b87eef" }
    }
  ]
})

const handleIntersection = ([entry]: IntersectionObserverEntry[]) => {
  const shouldReveal = entry?.isIntersecting && entry.intersectionRatio >= 0.35

  if (shouldReveal && !revealed.value) {
    motionKey.value += 1
    revealed.value = true
    phase.value = "enter"
  }
}

watch(mode, () => {
  if (!revealed.value) return
  if (phase.value === "leave") return

  phase.value = "leave"

  window.setTimeout(() => {
    displayedMode.value = mode.value
    motionKey.value += 1
    phase.value = "enter"
  }, ANIMATION_CONFIG.DURATION)
})

useIntersectionObserver(sectionRef, handleIntersection, INTERSECTION_CONFIG)
</script>

<template>
  <section
    class="relative w-full py-20"
    ref="sectionRef"
    id="links-section"
  >
    <div class="mx-auto w-full max-w-6xl px-6">
      <div class="mb-8 flex items-end justify-between gap-6">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {{ $t("home.links.title") }}
          </h2>
          <UiTabs
            v-model="mode"
            hide-label
            :items="viewModeItems"
          />
        </div>
      </div>

      <HomeLinksEmpty v-if="error" />

      <div
        v-else
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        :key="motionKey"
      >
        <HomeLinkCard
          v-for="(linkItem, idx) in localizedLinks"
          :link="linkItem"
          :index="idx"
          :animated="revealed"
          :motion-initial="ANIMATION_CONFIG.INITIAL"
          :motion-enter="getCardEnter"
          :key="`${linkItem.url}-${idx}`"
        />
      </div>
    </div>
  </section>
</template>
