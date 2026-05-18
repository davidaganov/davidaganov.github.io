<script setup lang="ts">
import { useUiHeaderHeight } from "@base/composables/useUiHeaderHeight"
import { useDocsHeaderNav } from "@docs/composables/useDocsHeaderNav"
import AppHeaderNavLink from "@base/components/app/AppHeaderNavLink.vue"
import AppMobileMenu from "@base/components/app/AppMobileMenu.vue"
import BaseScrollbar from "@docs/components/base/BaseScrollbar.vue"
import UiGitHubStars from "@ui/components/UiGitHubStars.vue"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiLogo from "@ui/components/UiLogo.vue"
import UiSearchTrigger from "@ui/components/UiSearchTrigger.vue"
import UiThemeToggle from "@ui/components/UiThemeToggle.vue"

const isMobileMenuOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

useUiHeaderHeight(headerRef)

const { isDocsRoute, primaryTabs, trailingActions, mobileInlineTrailingTabs, actionAriaLabel } =
  useDocsHeaderNav()
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-black/5 bg-(--ui-bg)/75 backdrop-blur-md dark:border-white/5"
    ref="headerRef"
  >
    <div class="container flex h-14 items-center justify-end gap-2 pl-1 md:justify-between">
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
              class="mt-2.5 mb-2 flex items-center gap-1 lg:mb-0 lg:pl-1"
              :aria-label="$t('layout.a11y.docsPrimaryNav')"
            >
              <AppHeaderNavLink
                v-for="tab in primaryTabs"
                variant="tab"
                :key="tab.id"
                :action="tab"
              />

              <AppHeaderNavLink
                v-for="action in mobileInlineTrailingTabs"
                variant="tab"
                class="lg:hidden"
                :key="`mobile-${action.id}`"
                :action="action"
              />
            </nav>
          </BaseScrollbar>
        </div>

        <div class="hidden items-center gap-1 lg:flex">
          <AppHeaderNavLink
            v-for="action in trailingActions"
            variant="icon"
            :key="action.id"
            :action="action"
            :aria-label="actionAriaLabel(action)"
          />
        </div>
      </div>
    </div>
  </header>

  <AppMobileMenu
    :open="isMobileMenuOpen"
    @close="isMobileMenuOpen = false"
  />
</template>
