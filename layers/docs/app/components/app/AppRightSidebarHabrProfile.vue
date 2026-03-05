<script setup lang="ts">
import { useHabrArticles } from "@docs/composables/useHabrArticles"
import { useAvatar } from "@base/composables/useAvatar"
import { HABR_LINK, USERNAME } from "@base/constants/config"

const { avatarUrl } = useAvatar()

const { habrCount, siteCount } = useHabrArticles()
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
          class="absolute right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-[#077fa3]"
        >
          <UIcon
            name="i-simple-icons-habr"
            class="size-2.5 text-white"
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

    <hr class="my-3 border-black/5 dark:border-white/10" />

    <div class="grid grid-cols-2 gap-2">
      <UiBadge
        icon="i-simple-icons-habr"
        class="col-span-1"
        :label="$t('pages.profile.platforms.onHabr')"
        :value="String(habrCount || 0)"
      />
      <UiBadge
        icon="i-lucide-file-text"
        class="col-span-1"
        :label="$t('pages.profile.platforms.onSite')"
        :value="String(siteCount || 0)"
      />
    </div>

    <UButton
      block
      target="_blank"
      rel="noopener noreferrer"
      class="mt-3"
      color="primary"
      variant="soft"
      icon="i-simple-icons-habr"
      :href="`${HABR_LINK}/articles`"
    >
      {{ $t("pages.profile.myProfile") }}
    </UButton>
  </div>
</template>
