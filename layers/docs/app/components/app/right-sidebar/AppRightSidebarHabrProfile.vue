<script setup lang="ts">
import AppRightSidebarProfile from "@docs/components/app/right-sidebar/AppRightSidebarProfile.vue"
import { useHabrArticles } from "@docs/composables/useHabrArticles"
import { HABR_LINK } from "@base/constants/config"

const { t } = useI18n()
const { habrCount, siteCount } = useHabrArticles()

const platformUrl = `${HABR_LINK}/articles`
const platformLabel = computed(() => t("pages.profile.myProfile"))

const stats = computed(() => [
  {
    label: t("pages.profile.platforms.onHabr"),
    value: String(unref(habrCount) || 0),
    icon: "i-simple-icons-habr"
  },
  {
    label: t("pages.profile.platforms.onSite"),
    value: String(unref(siteCount) || 0),
    icon: "i-lucide-file-text"
  }
])
</script>

<template>
  <AppRightSidebarProfile
    platform-icon="i-simple-icons-habr"
    platform-bg="bg-[#077fa3]"
    icon-color-class="size-2.5 text-white"
    :platform-url="platformUrl"
    :platform-label="platformLabel"
    :stats="stats"
  />
</template>
