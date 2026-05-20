<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core"
import { useLinksGistClient } from "@api/composables/useLinksGistClient"
import { useDocsSectionEntry } from "@docs/composables/docs/useDocsSectionEntry"
import HomeLinkCard from "@base/components/pages/home/HomeLinkCard.vue"
import HomeLinksEmpty from "@base/components/pages/home/HomeLinksEmpty.vue"
import type { Link } from "@api/types"
import { VIEW_MODE } from "@base/types"

const { t, locale } = useI18n()
const { localizedPath: aboutEntryPath } = useDocsSectionEntry("about")

const mode = ref<VIEW_MODE>(VIEW_MODE.PROFESSIONAL)
const isMobile = useMediaQuery("(max-width: 767px)", { ssrWidth: 768 })

const { links, error } = useLinksGistClient()

const viewModeItems = computed(() => [
  {
    value: VIEW_MODE.PROFESSIONAL,
    icon: "i-lucide-briefcase",
    label: t("pages.home.viewMode.professional")
  },
  {
    value: VIEW_MODE.PERSONAL,
    icon: "i-lucide-user",
    label: t("pages.home.viewMode.personal")
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
</script>

<template>
  <section
    class="relative w-full pt-20 pb-10"
    id="links-section"
  >
    <div class="mx-auto max-w-[1052px] px-3.5">
      <div class="mb-8 flex items-end justify-between gap-6">
        <div class="flex w-full items-center justify-between gap-4 sm:justify-start sm:text-3xl">
          <h2 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {{ $t("layout.navigation.menu.contacts") }}
          </h2>

          <div
            class="flex max-h-10 rounded-full border border-black/10 bg-black/5 p-1 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
            role="tablist"
            :aria-label="$t('pages.home.viewMode.label')"
          >
            <button
              v-for="item in viewModeItems"
              type="button"
              role="tab"
              class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              :class="
                mode === item.value
                  ? 'text-primary-600 bg-black/10 dark:bg-white/10 dark:text-white'
                  : 'hover:text-primary-700 text-gray-500 dark:text-gray-400 dark:hover:text-white'
              "
              :aria-label="item.label"
              :aria-selected="mode === item.value"
              :title="item.label"
              :key="item.value"
              @click="mode = item.value"
            >
              <UIcon
                class="size-4"
                aria-hidden="true"
                :name="item.icon"
              />
            </button>
          </div>
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
