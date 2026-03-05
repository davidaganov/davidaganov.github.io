<script setup lang="ts">
import AppRightSidebarProfile from "@docs/components/app/right-sidebar/AppRightSidebarProfile.vue"
import { useGitHubStats } from "@docs/composables/useGitHubStats"
import { GITHUB_LINK } from "@base/constants/config"

const { t } = useI18n()
const { user } = useGitHubStats()

const platformLabel = computed(() => t("pages.profile.myProfile"))

const stats = computed(() => [
  {
    label: t("pages.profile.repositories"),
    value: String(unref(user)?.public_repos || 0),
    icon: "i-simple-icons-github",
    external: true,
    href: `${GITHUB_LINK}?tab=repositories`
  },
  {
    label: t("pages.profile.followers"),
    value: String(unref(user)?.followers || 0),
    icon: "i-simple-icons-github"
  }
])
</script>

<template>
  <AppRightSidebarProfile
    platform-icon="i-simple-icons-github"
    platform-bg="bg-[#24292f]"
    icon-color-class="size-2 text-white dark:text-white"
    :platform-url="GITHUB_LINK"
    :platform-label="platformLabel"
    :stats="stats"
    :stats-cols="1"
  />
</template>
