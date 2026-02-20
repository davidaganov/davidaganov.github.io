<script setup lang="ts">
import { DOCS_SECTIONS } from "@docs/config/sections"
import { getFirstPathForSection, getSectionById, getSectionIdByPath } from "@docs/utils/sections"
import UiGitHubStars from "@ui/components/UiGitHubStars.vue"
import UiLanguageSwitcher from "@ui/components/UiLanguageSwitcher.vue"
import UiLogo from "@ui/components/UiLogo.vue"
import UiSearchTrigger from "@ui/components/UiSearchTrigger.vue"

const { t } = useI18n()

const route = useRoute()
const localePath = useLocalePath()

const isMobileMenuOpen = ref(false)

const docsTabs = computed(() =>
  DOCS_SECTIONS.map((section) => ({
    id: section.id,
    icon: section.icon,
    label: t(section.labelKey),
    to: localePath(getFirstPathForSection(section))
  }))
)

const isDocsRoute = computed(() => route.path.includes("/docs"))

const activeSectionId = computed(() => {
  const sectionId = getSectionIdByPath(route.path)
  return getSectionById(sectionId)?.id || DOCS_SECTIONS[0]?.id || ""
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-white/5 bg-(--ui-bg)/75 backdrop-blur-md">
    <div class="container flex h-14 items-center justify-end gap-2 md:justify-between">
      <UiLogo class="mr-auto" />
      <UiSearchTrigger />

      <div class="flex items-center gap-2">
        <UiGitHubStars class="hidden sm:flex" />
        <UiLanguageSwitcher />
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
      <div class="container flex h-14 items-center gap-1 overflow-x-auto">
        <NuxtLink
          v-for="tab in docsTabs"
          class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
          :to="tab.to"
          :class="
            activeSectionId === tab.id
              ? 'text-primary-400 bg-primary-500/10'
              : 'text-muted hover:text-white'
          "
          :key="tab.id"
        >
          <UIcon
            class="size-4"
            :name="tab.icon"
          />
          {{ tab.label }}
        </NuxtLink>
      </div>
    </div>
  </header>

  <AppMobileMenu
    :open="isMobileMenuOpen"
    @close="isMobileMenuOpen = false"
  />
</template>
