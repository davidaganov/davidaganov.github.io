<script setup lang="ts">
import { useGitHubStats } from "@docs/composables/useGitHubStats"
import { useAvatar } from "@base/composables/useAvatar"
import { USERNAME } from "@base/constants/config"

const { avatarUrl } = useAvatar()
const { user } = useGitHubStats()
</script>

<template>
  <div
    class="rounded-xl border border-black/15 bg-white/20 p-4 dark:border-white/5 dark:bg-white/3"
  >
    <div class="flex items-center gap-3">
      <div class="relative">
        <img
          alt="Avatar"
          class="size-12 rounded-full"
          :src="avatarUrl"
        />
        <div
          class="absolute right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-[#24292f]"
        >
          <UIcon
            name="i-simple-icons-github"
            class="size-2 text-white dark:text-white"
          />
        </div>
      </div>
      <div class="min-w-0">
        <div class="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {{ $t("global.name") }}
        </div>
        <div class="text-muted truncate text-xs">@{{ USERNAME }}</div>
      </div>
    </div>

    <hr class="my-3 border-black/15 dark:border-white/10" />

    <div class="grid gap-2">
      <UiBadge
        icon="i-simple-icons-github"
        class="col-span-1"
        external
        :label="$t('pages.profile.repositories')"
        :value="String(user?.public_repos || 0)"
        :href="`https://github.com/${USERNAME}?tab=repositories`"
      />
      <UiBadge
        icon="i-simple-icons-github"
        class="col-span-1"
        :label="$t('pages.profile.followers')"
        :value="String(user?.followers || 0)"
      />
    </div>

    <UButton
      target="_blank"
      rel="noopener noreferrer"
      icon="i-simple-icons-github"
      color="primary"
      variant="soft"
      class="mt-2"
      block
      :href="`https://github.com/${USERNAME}`"
    >
      {{ $t("pages.profile.myProfile") }}
    </UButton>
  </div>
</template>
