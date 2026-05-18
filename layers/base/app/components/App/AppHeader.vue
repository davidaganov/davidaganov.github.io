<script setup lang="ts">
import { useUiHeaderHeight } from "@base/composables/useUiHeaderHeight"
import { useChangelogUnreadIndicator } from "@docs/composables/useChangelogUnreadIndicator"
import {
  getFirstPathForSection,
  getSectionById,
  getSectionIdByPath,
  isGraphDocsPath
} from "@docs/utils/sections"
import { DOCS_SECTIONS } from "@docs/constants"
import AppMobileMenu from "@base/components/App/AppMobileMenu.vue"
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import UiGitHubStars from "@ui/components/UiGitHubStars.vue"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiLink from "@ui/components/UiLink.vue"
import UiLogo from "@ui/components/UiLogo.vue"
import UiSearchTrigger from "@ui/components/UiSearchTrigger.vue"
import UiThemeToggle from "@ui/components/UiThemeToggle.vue"
import { ROUTE_PATH } from "@base/types/enums"

const CHANGELOG_SECTION_ID = "changelog" as const

const { t } = useI18n()

const route = useRoute()
const localePath = useLocalePath()

const isMobileMenuOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

const { showUnreadDot } = useChangelogUnreadIndicator()

useUiHeaderHeight(headerRef)

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

const isGraphRoute = computed(() => isGraphDocsPath(route.path))

const isDocsRoute = computed(() => route.path.includes(ROUTE_PATH.DOCS))

const activeSectionId = computed(() => {
  if (isGraphRoute.value) return ""
  const sectionId = getSectionIdByPath(route.path)
  return getSectionById(sectionId)?.id || DOCS_SECTIONS[0]?.id || ""
})

const docsChangelogAriaLabel = computed(() => {
  const tab = docsChangelogTab.value
  if (!tab) return ""
  const base = tab.label
  return showUnreadDot.value ? `${base}. ${t("layout.a11y.changelogUnread")}` : base
})
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-black/5 bg-(--ui-bg)/75 backdrop-blur-md dark:border-white/5"
    ref="headerRef"
  >
    <div class="container flex h-14 items-center justify-end gap-2 md:justify-between">
      <UiLogo class="mr-auto" />
      <UiSearchTrigger />

      <div class="flex items-center gap-2">
        <UiGitHubStars class="hidden sm:flex" />
        <UiThemeToggle class="hidden lg:flex" />
        <UiLanguageSwitcher class="hidden lg:flex" />
        <UButton
          class="size-8 lg:hidden"
          variant="ghost"
          size="sm"
          type="button"
          icon="i-lucide-menu"
          aria-controls="site-mobile-nav"
          :aria-expanded="isMobileMenuOpen"
          :aria-label="$t('layout.a11y.openMobileMenu')"
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
            <nav
              class="mt-2.5 mb-1 flex items-center gap-1 pl-1 lg:mb-0"
              :aria-label="$t('layout.a11y.docsPrimaryNav')"
            >
              <UiLink
                v-for="tab in docsMainTabs"
                class="min-h-11 px-3 py-1.5 lg:min-h-0 lg:py-2!"
                :to="tab.to"
                :active="activeSectionId === tab.id"
                :key="tab.id"
              >
                <UIcon
                  class="size-4 shrink-0"
                  aria-hidden="true"
                  :name="tab.icon"
                />
                {{ tab.label }}
              </UiLink>

              <!-- Changelog for Mobile -->
              <UiLink
                v-if="docsChangelogTab"
                class="min-h-11 px-3 py-1.5 lg:hidden lg:min-h-0 lg:py-2!"
                :to="docsChangelogTab.to"
                :active="activeSectionId === docsChangelogTab.id"
              >
                <div class="relative mt-1">
                  <UIcon
                    class="size-4 shrink-0"
                    aria-hidden="true"
                    :name="docsChangelogTab.icon"
                  />
                  <span
                    v-if="showUnreadDot"
                    class="bg-primary-500 absolute -top-1 -right-1 size-2 rounded-full ring-2 ring-(--ui-bg)"
                    aria-hidden="true"
                  />
                </div>
                {{ docsChangelogTab.label }}
                <span
                  v-if="showUnreadDot"
                  class="sr-only"
                >
                  —
                  {{ $t("layout.a11y.changelogUnread") }}
                </span>
              </UiLink>
            </nav>
          </BaseScrollbar>
        </div>

        <div
          v-if="isDocsRoute"
          class="hidden items-center gap-1 lg:flex"
        >
          <UiLink
            is-icon
            :to="localePath(ROUTE_PATH.DOCS_GRAPH)"
            :active="isGraphRoute"
            :aria-label="$t('docs.graph.headerAria')"
            :title="$t('docs.graph.headerAria')"
          >
            <UIcon
              name="i-lucide-git-fork"
              class="size-4 shrink-0"
              aria-hidden="true"
            />
          </UiLink>
          <UiLink
            v-if="docsChangelogTab"
            is-icon
            :to="docsChangelogTab.to"
            :active="activeSectionId === docsChangelogTab.id"
            :aria-label="docsChangelogAriaLabel"
            :title="docsChangelogAriaLabel"
          >
            <div class="relative mt-1">
              <UIcon
                class="size-4 shrink-0"
                aria-hidden="true"
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
