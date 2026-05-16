<script setup lang="ts">
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import { useChangelogUnreadIndicator } from "@docs/composables/useChangelogUnreadIndicator"
import { DOCS_SECTIONS } from "@docs/config/sections"
import { getFirstPathForSection, getSectionById, getSectionIdByPath } from "@docs/utils/sections"
import AppMobileMenu from "@base/components/app/AppMobileMenu.vue"
import { ROUTE_PATH } from "@base/types/enums"
import UiGitHubStars from "@ui/components/UiGitHubStars.vue"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiLink from "@ui/components/UiLink.vue"
import UiLogo from "@ui/components/UiLogo.vue"
import UiSearchTrigger from "@ui/components/UiSearchTrigger.vue"
import UiThemeToggle from "@ui/components/UiThemeToggle.vue"

const CHANGELOG_SECTION_ID = "changelog" as const

const { t } = useI18n()

const route = useRoute()
const localePath = useLocalePath()

const isMobileMenuOpen = ref(false)

const { showUnreadDot } = useChangelogUnreadIndicator()

const docsMainTabs = computed(() =>
  DOCS_SECTIONS.filter((section) => section.id !== CHANGELOG_SECTION_ID).map((section) => ({
    id: section.id,
    icon: section.icon,
    label: t(section.labelKey),
    to: localePath(getFirstPathForSection(section))
  }))
)

const docsChangelogTab = computed(() => {
  const section = getSectionById(CHANGELOG_SECTION_ID)
  if (!section) return null
  return {
    id: section.id,
    icon: section.icon,
    label: t(section.labelKey),
    to: localePath(getFirstPathForSection(section))
  }
})

const isDocsRoute = computed(() => route.path.includes(ROUTE_PATH.DOCS))
const headerHeight = computed(() => (isDocsRoute.value ? "130px" : "56px"))

const activeSectionId = computed(() => {
  const sectionId = getSectionIdByPath(route.path)
  return getSectionById(sectionId)?.id || DOCS_SECTIONS[0]?.id || ""
})

useHead({
  style: [
    {
      innerHTML: computed(() => `:root { --ui-header-height: ${headerHeight.value}; }`),
      tagPriority: "high"
    }
  ]
})
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-black/5 bg-(--ui-bg)/75 backdrop-blur-md dark:border-white/5"
  >
    <div class="container flex h-14 items-center justify-end gap-2 md:justify-between">
      <UiLogo class="mr-auto" />
      <UiSearchTrigger />

      <div class="flex items-center gap-2">
        <UiGitHubStars class="hidden sm:flex" />
        <UiThemeToggle class="hidden lg:flex" />
        <UiLanguageSwitcher class="hidden lg:flex" />
        <UButton
          class="lg:hidden"
          variant="ghost"
          size="sm"
          icon="i-lucide-menu"
          @click="isMobileMenuOpen = true"
        />
      </div>
    </div>

    <div
      v-if="isDocsRoute"
      class="border-primary/20 border-t border-b"
    >
      <div class="container flex h-14 items-center gap-2 overflow-hidden">
        <div class="flex min-w-0 flex-1 items-center overflow-hidden pb-1">
          <BaseScrollbar
            width="100%"
            :offset-y="5"
          >
            <div class="mt-2.5 mb-1 flex items-center gap-1 lg:mb-0">
              <UiLink
                v-for="tab in docsMainTabs"
                class="py-1.5! lg:py-2!"
                :to="tab.to"
                :active="activeSectionId === tab.id"
                :key="tab.id"
              >
                <UIcon
                  class="size-4"
                  :name="tab.icon"
                />
                {{ tab.label }}
              </UiLink>

              <!-- Changelog for Mobile -->
              <UiLink
                v-if="docsChangelogTab"
                class="lg:hidden"
                :to="docsChangelogTab.to"
                :active="activeSectionId === docsChangelogTab.id"
              >
                <div class="relative mt-1">
                  <UIcon
                    class="size-4"
                    :name="docsChangelogTab.icon"
                  />
                  <span
                    v-if="showUnreadDot"
                    class="bg-primary-500 absolute -top-1 -right-1 size-2 rounded-full ring-2 ring-(--ui-bg)"
                    aria-hidden="true"
                  />
                </div>
                {{ docsChangelogTab.label }}
              </UiLink>
            </div>
          </BaseScrollbar>
        </div>

        <!-- Changelog for Desktop -->
        <div
          v-if="docsChangelogTab"
          class="hidden lg:flex"
        >
          <UiLink
            is-icon
            :to="docsChangelogTab.to"
            :active="activeSectionId === docsChangelogTab.id"
            :aria-label="docsChangelogTab.label"
            :title="docsChangelogTab.label"
          >
            <div class="relative mt-1">
              <UIcon
                class="size-4"
                :name="docsChangelogTab.icon"
              />
              <span
                v-if="showUnreadDot"
                class="bg-primary-500 absolute -top-1 -right-1 size-2 rounded-full ring-2 ring-(--ui-bg)"
                aria-hidden="true"
              />
            </div>
          </UiLink>
        </div>
      </div>
    </div>
  </header>

  <AppMobileMenu
    :open="isMobileMenuOpen"
    @close="isMobileMenuOpen = false"
  />
</template>
