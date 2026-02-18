<script setup lang="ts">
import { useGitHubStats } from "@docs/composables/useGitHubStats"
import { useAvatar } from "@base/composables/useAvatar"
import { USERNAME } from "@base/constants/config"

const { avatarUrl } = useAvatar()
const { user } = useGitHubStats()
</script>

<template>
  <div class="rounded-xl border border-white/5 bg-white/3 p-4">
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
            class="size-2.5 text-white"
          />
        </div>
      </div>
      <div class="min-w-0">
        <div class="truncate text-sm font-semibold text-white">{{ $t("common.name") }}</div>
        <div class="text-muted truncate text-xs">@{{ USERNAME }}</div>
      </div>
    </div>

    <hr class="my-3 border-white/10" />

    <div class="grid gap-2">
      <UiBadge
        icon="i-simple-icons-github"
        class="col-span-1"
        external
        :label="$t('layout.githubProfile.repositories')"
        :value="String(user?.public_repos || 0)"
        :href="`https://github.com/${USERNAME}?tab=repositories`"
      />
      <UiBadge
        icon="i-simple-icons-github"
        class="col-span-1"
        :label="$t('layout.githubProfile.followers')"
        :value="String(user?.followers || 0)"
      />
    </div>

    <a
      target="_blank"
      rel="noopener noreferrer"
      class="bg-primary-500/15 text-primary-300 hover:bg-primary-500/20 mt-3 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
      :href="`https://github.com/${USERNAME}`"
    >
      <UIcon
        name="i-simple-icons-github"
        class="size-4"
      />
      <span>{{ $t("layout.githubProfile.myProfile") }}</span>
    </a>
  </div>
</template>
