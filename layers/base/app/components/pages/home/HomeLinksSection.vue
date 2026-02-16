<script setup lang="ts">
import HomeLinkCard from "@base/components/pages/home/HomeLinkCard.vue"
import HomeLinksEmpty from "@base/components/pages/home/HomeLinksEmpty.vue"
import { ROUTE_PATH, VIEW_MODE } from "@base/types/enums"
import type { Link } from "@base/types/links"
import UiTabs from "@ui/components/bits/UiTabs.vue"

const { t } = useI18n()
const localePath = useLocalePath()
const { locale } = useI18n()

const mode = ref<VIEW_MODE>(VIEW_MODE.PROFESSIONAL)
const isMobile = ref(false)

const { links, error } = useLinksGistClient()

const getLocalizedText = (value?: { ru: string; en: string }): string | undefined => {
  if (!value) return undefined
  return value[locale.value as keyof typeof value] || value.en
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
  mode.value === VIEW_MODE.PROFESSIONAL ? links.value.professional : links.value.personal
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

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener("resize", checkMobile)
})

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile)
})
</script>

<template>
  <section
    class="relative w-full py-20"
    id="links-section"
  >
    <div class="container">
      <div class="mb-8 flex items-end justify-between gap-6">
        <div class="flex w-full items-center justify-between gap-4 sm:justify-start sm:text-3xl">
          <h2 class="text-2xl font-semibold tracking-tight text-white">
            {{ $t("home.links.title") }}
          </h2>
          <UiTabs
            v-model="mode"
            hide-label
            :items="viewModeItems"
          />
        </div>
      </div>

      <Transition
        mode="out-in"
        name="tabs-fade"
      >
        <HomeLinksEmpty
          v-if="error"
          key="error"
        />

        <div
          v-else
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          :key="mode"
        >
          <HomeLinkCard
            v-for="(linkItem, idx) in localizedLinks"
            v-motion
            :link="linkItem"
            :initial="{ opacity: 0, y: 30, filter: 'blur(4px)' }"
            :visible="{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                delay: idx * (isMobile ? 30 : 50),
                duration: 300,
                type: 'spring',
                stiffness: 250,
                damping: 25,
                mass: 0.5
              }
            }"
            :key="`${linkItem.url}-${idx}`"
          />
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.tabs-fade-leave-active {
  transition: opacity 0.2s ease-in;
}

.tabs-fade-leave-to {
  opacity: 0;
}
</style>
