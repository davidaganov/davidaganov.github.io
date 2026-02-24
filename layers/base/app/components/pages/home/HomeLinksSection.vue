<script setup lang="ts">
import HomeLinkCard from "@base/components/pages/home/HomeLinkCard.vue"
import HomeLinksEmpty from "@base/components/pages/home/HomeLinksEmpty.vue"
import { VIEW_MODE } from "@base/types/enums"
import type { Link } from "@base/types/links"

const { t, locale } = useI18n()
const { localizedPath: aboutEntryPath } = useDocsSectionEntryPath("about")

const mode = ref<VIEW_MODE>(VIEW_MODE.PROFESSIONAL)
const isMobile = ref(false)

const { links, error } = useLinksGistClient()

const viewModeItems = computed(() => [
  {
    value: VIEW_MODE.PROFESSIONAL,
    icon: "i-lucide-briefcase"
  },
  {
    value: VIEW_MODE.PERSONAL,
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
      url: aboutEntryPath.value,
      localizedName: t("layout.navigation.sections.docs"),
      localizedDescription: t("pages.home.ctaDesc"),
      icon: "i-lucide-book-open",
      isCta: true,
      customStyle: { color: "#b87eef" }
    }
  ]
})

const getLocalizedText = (value?: { ru: string; en: string }): string | undefined => {
  if (!value) return undefined
  return value[locale.value as keyof typeof value] || value.en
}

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
            {{ $t("layout.navigation.menu.contacts") }}
          </h2>
          <UTabs
            v-model="mode"
            :items="viewModeItems"
            :ui="{
              list: 'rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md',
              trigger:
                'rounded-full px-4 py-2 text-sm font-medium data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white',
              indicator: 'rounded-[18px] bg-white/10'
            }"
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
