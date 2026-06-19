<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core"
import { useLinksGistClient } from "@api/composables/useLinksGistClient"
import { useDocsSectionEntry } from "@docs/composables/docs/useDocsSectionEntry"
import HomeLinkCard from "@base/components/pages/home/HomeLinkCard.vue"
import type { LocalizedLink } from "@base/components/pages/home/HomeLinkCard.vue"
import HomeLinkCardSkeleton from "@base/components/pages/home/HomeLinkCardSkeleton.vue"
import HomeLinksEmpty from "@base/components/pages/home/HomeLinksEmpty.vue"
import type { Link } from "@api/types"
import { VIEW_MODE } from "@base/types"

const REMOTE_LINKS_COUNT = 5

const { t, locale } = useI18n()
const { localizedPath: aboutEntryPath } = useDocsSectionEntry("about")

const mode = ref<VIEW_MODE>(VIEW_MODE.PROFESSIONAL)
const isMobile = useMediaQuery("(max-width: 767px)", { ssrWidth: 768 })

const { links, error, pending } = useLinksGistClient()

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

const getLocalizedText = (value?: { ru: string; en: string }): string | undefined => {
  if (!value) return undefined
  return value[locale.value as keyof typeof value] || value.en
}

const toLocalizedLink = (link: Link): LocalizedLink => ({
  url: link.url,
  icon: link.icon,
  customStyle: link.customStyle,
  localizedName: getLocalizedText(link.name),
  localizedDescription: getLocalizedText(link.description),
  isCta: false
})

const remoteLinkCards = computed((): LocalizedLink[] => activeLinks.value.map(toLocalizedLink))

const docsCtaLink = computed(
  (): LocalizedLink => ({
    url: aboutEntryPath.value,
    localizedName: t("layout.navigation.sections.docs"),
    localizedDescription: t("pages.home.ctaDesc"),
    icon: "i-lucide-book-open",
    isCta: true,
    customStyle: { color: "#b87eef" }
  })
)

const cardEnter = (idx: number) => ({
  opacity: 1,
  transition: {
    delay: idx * (isMobile.value ? 40 : 60),
    duration: 300,
    ease: "easeOut"
  }
})
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
          key="links-grid"
        >
          <template v-if="pending">
            <HomeLinkCardSkeleton
              v-for="slotIdx in REMOTE_LINKS_COUNT"
              :key="`skeleton-${slotIdx}`"
            />
          </template>

          <template v-else>
            <HomeLinkCard
              v-for="(link, idx) in remoteLinkCards"
              v-motion
              :link="link"
              :initial="{ opacity: 0 }"
              :enter="cardEnter(idx)"
              :key="`${mode}-remote-${idx}`"
            />
          </template>

          <HomeLinkCard
            v-motion
            key="docs-cta"
            :link="docsCtaLink"
            :initial="{ opacity: 0 }"
            :enter="cardEnter(REMOTE_LINKS_COUNT)"
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
